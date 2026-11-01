const jwt = require('jsonwebtoken');
const AuthService = require('../services/AuthService');
const User = require('../models/User');

const authController = {
  register: async (req, res) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        status_code: 201,
        message: 'Đăng ký thành công!',
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        status_code: 400,
        message: error.message,
        data: null,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json({
        success: true,
        status_code: 200,
        message: 'Đăng nhập thành công!',
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        status_code: 401,
        message: error.message,
        data: null,
      });
    }
  },

  me: async (req, res) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) throw new Error('Thiếu token');

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'my_secret_key');
      const user = await User.findById(payload.sub);
      if (!user) throw new Error('Người dùng không tồn tại');

      res.status(200).json({
        success: true,
        status_code: 200,
        message: 'OK',
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        status_code: 401,
        message: 'Token không hợp lệ hoặc đã hết hạn',
        data: null,
      });
    }
  },
};

module.exports = authController;