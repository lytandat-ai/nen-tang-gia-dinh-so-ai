import jwt from 'jsonwebtoken';
import { PUBLIC_ROUTES } from '../config/routes.js';

// Phải GIỐNG với JWT_SECRET trong .env của auth-service
const JWT_SECRET = process.env.JWT_SECRET || 'familyconnect_secret_key_2026';

const fail = (res, status, message) =>
    res.status(status).json({ success: false, status_code: status, message, data: null });

export const verifyToken = (req, res, next) => {
    // 1. Đường dẫn công khai (login, register) thì cho qua
    if (PUBLIC_ROUTES.includes(req.path)) {
        return next();
    }

    // 2. Lấy token từ header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return fail(res, 401, 'Thiếu token xác thực');
    }

    // 3. Kiểm tra token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return fail(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
        }

        // 4. Gắn danh tính để chuyển cho các service (token của auth-service dùng "sub")
        req.headers['x-user-id'] = String(decoded.sub);
        req.headers['x-user-role'] = String(decoded.role);

        next();
    });
};