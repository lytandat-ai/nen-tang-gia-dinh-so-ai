// Xác thực, đăng ký, đăng nhập, JWT
import { ApiClient } from './ApiClient.js';
import { StorageHelper } from '../utils/StorageHelper.js';

export class AuthService extends ApiClient {
  /** Đăng nhập, lưu phiên, trả về thông tin người dùng. */
  async login(email, password) {
    const data = await this.post('/auth/login', { email, password }, { auth: false });
    StorageHelper.setSession({ token: data.token, user: data.user });
    return data.user;
  }

  /** Đăng ký tài khoản mới (vai trò mặc định GUEST). */
  register({ full_name, email, password }) {
    return this.post(
      '/auth/register',
      { username: full_name, full_name, email, password },
      { auth: false }
    );
  }

  /** Lấy thông tin người dùng hiện tại từ server. */
  me() {
    return this.get('/auth/me');
  }

  logout() {
    StorageHelper.clear();
  }
}