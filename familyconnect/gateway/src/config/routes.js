// Bảng tiền tố đường dẫn -> service (xem docs/api-contract.md) và danh sách route công khai (login, register)
// Các API không cần kiểm tra đăng nhập (đăng ký, đăng nhập)
export const PUBLIC_ROUTES = [
    '/api/v1/auth/login',
    '/api/v1/auth/register'
];

// Bảng định tuyến (dựa theo docs/api-contract.md)
export const ROUTES = [
    { prefix: '/api/v1/auth', target: 'http://localhost:3001' },
    { prefix: '/api/v1/users', target: 'http://localhost:3001' },
    { prefix: '/api/v1/families', target: 'http://localhost:3002' },
    { prefix: '/api/v1/branches', target: 'http://localhost:3002' },
    { prefix: '/api/v1/members', target: 'http://localhost:3002' },
    { prefix: '/api/v1/relationships', target: 'http://localhost:3002' },
    { prefix: '/api/v1/marriages', target: 'http://localhost:3002' },
    { prefix: '/api/v1/tree', target: 'http://localhost:3002' },
    { prefix: '/api/v1/posts', target: 'http://localhost:3003' },
    { prefix: '/api/v1/comments', target: 'http://localhost:3003' },
    { prefix: '/api/v1/reactions', target: 'http://localhost:3003' },
    { prefix: '/api/v1/events', target: 'http://localhost:3004' },
    { prefix: '/api/v1/rsvps', target: 'http://localhost:3004' },
    { prefix: '/api/v1/heritages', target: 'http://localhost:3005' },
    { prefix: '/api/v1/ai', target: 'http://localhost:3006' },
    { prefix: '/api/v1/dashboard', target: 'http://localhost:3007' },
    { prefix: '/api/v1/audit-logs', target: 'http://localhost:3007' },
    { prefix: '/api/v1/reports', target: 'http://localhost:3007' }
];