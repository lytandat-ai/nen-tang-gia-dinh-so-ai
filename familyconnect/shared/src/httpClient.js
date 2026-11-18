// Hàm gọi REST giữa các service: timeout, đọc đúng định dạng response (docs/api-contract.md mục 6).
// Gọi đồng bộ, timeout mặc định 3 giây, chuỗi gọi tối đa một tầng.
// Trả về `data` khi downstream thành công; ném AppError khi lỗi:
//   - downstream trả lỗi 4xx: giữ nguyên mã HTTP, code, message và fields
//   - downstream trả 5xx, trả sai định dạng, hoặc không kết nối được: 502 SERVICE_UNAVAILABLE
//   - quá thời gian chờ: 504 GATEWAY_TIMEOUT
// Ví dụ: const result = await callService(config.genealogyUrl, '/internal/memberships', { query: { user_id: '1' } });

import { AppError, ErrorCodes } from './AppError.js';

const DEFAULT_TIMEOUT_MS = 3000;

function isEnvelope(p) {
  return p !== null && typeof p === 'object'
    && typeof p.success === 'boolean'
    && Number.isInteger(p.status_code)
    && typeof p.message === 'string'
    && 'data' in p;
}

/**
 * @param {string} baseUrl ví dụ process.env.GENEALOGY_URL (http://genealogy-service:3002)
 * @param {string} path ví dụ '/internal/memberships'
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {object} [options.query] tham số truy vấn (bỏ qua giá trị undefined/null)
 * @param {*} [options.body] gửi dạng JSON
 * @param {{userId?: string, role?: string}} [options.user] chuyển tiếp X-User-Id, X-User-Role
 * @param {number} [options.timeoutMs=3000]
 */
export async function callService(baseUrl, path, options = {}) {
  const { method = 'GET', query, body, user, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const url = new URL(path, baseUrl);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (user?.userId) {
    headers['X-User-Id'] = String(user.userId);
    headers['X-User-Role'] = String(user.role ?? 'GUEST');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    let payload;
    try {
      payload = await response.json();
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      throw AppError.serviceUnavailable(`Service ${url.host} returned a non-JSON response`);
    }
    if (!isEnvelope(payload)) {
      throw AppError.serviceUnavailable(`Service ${url.host} returned an invalid response format`);
    }
    if (!payload.success) {
      if (payload.status_code >= 500) throw AppError.serviceUnavailable(`Service ${url.host} failed`);
      throw new AppError(payload.status_code, payload.data?.code ?? ErrorCodes.INTERNAL_ERROR, payload.message, payload.data?.fields);
    }
    return payload.data;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.name === 'AbortError') throw AppError.gatewayTimeout(`Service ${url.host} did not respond within ${timeoutMs} ms`);
    throw AppError.serviceUnavailable(`Cannot reach service ${url.host}`);
  } finally {
    clearTimeout(timer);
  }
}
