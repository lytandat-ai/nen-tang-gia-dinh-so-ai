// Service: nghiệp vụ và kiểm tra dữ liệu
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User để tương tác DB

class AuthService {
    // 1. CHỨC NĂNG ĐĂNG KÝ (REGISTER)
    static async register(userData) {
        const { username, email, password } = userData;

        // Kiểm tra email đã tồn tại chưa (Giả định hàm findByEmail có trong User.js)
        const existingUser = await User.findByEmail(email); 
        if (existingUser) {
            throw new Error('Email này đã được sử dụng!');
        }

        // Băm (Hash) mật khẩu để bảo mật
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Lưu User mới vào Database
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        return newUser;
    }

    // 2. CHỨC NĂNG ĐĂNG NHẬP (LOGIN)
    static async login(email, password) {
        // Tìm user theo email
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Tài khoản không tồn tại!');
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã băm trong DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Sai mật khẩu!');
        }

        // Tạo mã Token (JWT) để duy trì đăng nhập
        // Lưu ý: Chuỗi 'my_secret_key' sau này nên đưa vào file .env
        const token = jwt.sign(
            { sub: String(user.user_id), email: user.email, role: user.role },
            process.env.JWT_SECRET || 'my_secret_key',
            { expiresIn: '1h' }
        );

        const { password_hash, ...safeUser } = user;
        return { user: safeUser, token };
    }
}

module.exports = AuthService;