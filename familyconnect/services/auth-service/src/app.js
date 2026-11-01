const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// API kiểm tra trạng thái sống của service
app.get('/health', (req, res) => res.status(200).json({ status: 'Auth Service is OK' }));

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    console.error('[Auth Service Error]', err.stack);
    res.status(500).json({ message: 'Lỗi Auth Service nội bộ', error: err.message });
});

// 1. Khai báo route
const authRoutes = require('./routes/auth.routes');

// 2. Sử dụng route (đặt trước chỗ app.listen hoặc export)
app.use('/api/auth', authRoutes);

module.exports = app;