const app = require('./app');
const createUsersTable = require('./models/initDB.js');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    // Chạy lệnh tạo bảng trước khi mở cổng
    await createUsersTable();

    app.listen(PORT, () => {
        console.log(`🔑 Auth Service đang chạy tại http://localhost:${PORT}`);
    });
};

startServer();