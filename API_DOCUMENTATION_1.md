# ChatStoryAI API Documentation

## Tổng quan

ChatStoryAI cung cấp một bộ API RESTful hoàn chỉnh để quản lý truyện, người dùng, và các tính năng AI. API được thiết kế theo chuẩn OpenAPI 3.0 và có thể được truy cập thông qua Swagger UI.

## Truy cập API Documentation

### Swagger UI

- **URL**: `/docs`
- **Mô tả**: Giao diện tương tác để khám phá và test API
- **Tính năng**:
  - Xem tất cả endpoints
  - Lọc theo nhóm API
  - Xem chi tiết request/response
  - Test API trực tiếp

### OpenAPI Specification

- **URL**: `/api/docs`
- **Format**: JSON
- **Mô tả**: Specification đầy đủ theo chuẩn OpenAPI 3.0

## Nhóm API chính

### 🔐 Authentication

- `POST /api/auth/login` - Đăng nhập người dùng
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/forgot-password` - Gửi mã xác thực quên mật khẩu
- `POST /api/auth/verify-reset-code` - Xác thực mã đặt lại mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu mới

### 📚 Stories Management

- `GET /api/stories` - Lấy danh sách truyện của người dùng
- `POST /api/stories/create` - Tạo truyện mới với ảnh bìa
- `GET /api/stories/[id]` - Chi tiết truyện
- `PUT /api/stories/[id]` - Cập nhật thông tin truyện
- `DELETE /api/stories/[id]` - Xóa truyện hoàn toàn
- `PUT /api/stories/[id]/publish` - Xuất bản truyện

### 📖 Public Library

- `GET /api/library/new` - Truyện mới nhất (có phân trang)
- `GET /api/library/popular` - Truyện phổ biến nhất
- `GET /api/library/search` - Tìm kiếm truyện với bộ lọc nâng cao
- `GET /api/library/[id]` - Chi tiết truyện công khai

### 📑 Chapters Management

- `GET /api/stories/[id]/chapters` - Lấy danh sách chương
- `POST /api/stories/[id]/chapters` - Tạo chương mới

### 🏷️ Categories & Tags

- `GET /api/categories` - Danh sách thể loại chính và tag

### 👤 User Management

- `POST /api/user/update-avatar` - Cập nhật ảnh đại diện
- `PATCH /api/user/update-username` - Thay đổi tên hiển thị
- `PATCH /api/user/update-password` - Đổi mật khẩu

### 🤖 AI Features

- `GET /api/ai/gemini` - Lấy API key Gemini cho AI
- `POST /api/ai/chat-history/messages` - Lưu lịch sử chat với AI

### 💳 Payment (VNPay)

- `POST /api/vnpay` - Tạo URL thanh toán VNPay
- `GET /api/vnpay/callback` - Xử lý callback thanh toán

### 📄 Documentation

- `GET /api/docs` - OpenAPI specification JSON

## Authentication

API sử dụng session-based authentication với NextAuth.js:

```javascript
// Các request cần authentication sẽ tự động include session cookie
fetch("/api/stories", {
  credentials: "include",
});
```

## Response Format

Tất cả API responses đều có format JSON:

### Success Response

```json
{
  "data": {...},
  "message": "Success message"
}
```

### Error Response

```json
{
  "error": "Error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Pagination

Các API trả về danh sách hỗ trợ pagination:

```
GET /api/library/new?page=1
```

- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 20)

## Rate Limiting

API có rate limiting để bảo vệ server:

- 100 requests/minute cho authenticated users
- 20 requests/minute cho anonymous users

## Examples

### Đăng nhập

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});
```

### Lấy danh sách truyện

```javascript
const response = await fetch("/api/stories", {
  credentials: "include",
});
const data = await response.json();
```

### Tạo truyện mới

```javascript
const response = await fetch("/api/stories/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    title: "Tên truyện",
    description: "Mô tả truyện",
    main_category_id: 1,
    tag_ids: [1, 2, 3],
  }),
});
```

## Error Handling

```javascript
try {
  const response = await fetch("/api/stories");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API Error");
  }

  const data = await response.json();
  // Handle success
} catch (error) {
  console.error("API Error:", error.message);
  // Handle error
}
```

## Development

### Thêm JSDoc cho API mới

Khi tạo API route mới, thêm JSDoc comments:

```javascript
/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Mô tả ngắn
 *     description: Mô tả chi tiết
 *     tags:
 *       - Example
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
  // Implementation
}
```

### Cập nhật Schemas

Thêm schemas mới vào `src/lib/swagger.ts`:

```javascript
components: {
  schemas: {
    NewSchema: {
      type: 'object',
      properties: {
        // Define properties
      }
    }
  }
}
```

## Support

Nếu có vấn đề với API documentation:

1. Kiểm tra console browser để xem lỗi
2. Verify API endpoint hoạt động bình thường
3. Kiểm tra JSDoc syntax
4. Restart development server

## Links

- [Swagger UI](/docs)
- [OpenAPI Spec](/api/docs)
- [GitHub Repository](https://github.com/NguyenHuynhPhuVinh-TomiSakae/ChatStoryAI)
