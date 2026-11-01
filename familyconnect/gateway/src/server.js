// Khởi động gateway (cổng 8080)
import app from './app.js';

const PORT = process.env.PORT || 8080; 

app.listen(PORT, () => {
    console.log(`🚀 API Gateway đang chạy tại http://localhost:${PORT}`);
});