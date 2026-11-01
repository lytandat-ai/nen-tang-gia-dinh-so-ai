// Khai báo route auth và phân quyền
const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');

// POST http://localhost:3001/api/auth/register
router.post('/register', authController.register);

// POST http://localhost:3001/api/auth/login
router.post('/login', authController.login);

// GET http://localhost:3001/api/auth/me (cần header Authorization: Bearer <token>)
router.get('/me', authController.me);

module.exports = router;