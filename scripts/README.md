# Scripts để Test API ChatStoryAI

Thư mục này chứa các scripts và file cấu hình để test API của ChatStoryAI một cách toàn diện.

## Nội dung

- `postman_collection.json` - Postman collection chứa tất cả API endpoints
- `environment.json` - File cấu hình environment cho Postman
- `test_api.js` - Script Node.js cơ bản để test API
- `comprehensive_test.js` - Script test toàn diện tất cả endpoints
- `performance_test.js` - Script test hiệu suất và khả năng chịu tải
- `package.json` - Cấu hình npm với các scripts tiện ích

## Cách sử dụng

### 1. Postman Collection

1. Mở Postman
2. Import file `postman_collection.json`
3. Import file `environment.json` để cấu hình environment
4. Chạy các request để test API

### 2. Node.js Scripts

```bash
cd scripts

# Chạy test cơ bản
npm test

# Chạy test toàn diện tất cả endpoints
npm run test:comprehensive

# Chạy test hiệu suất
node performance_test.js

# Test từng nhóm API riêng biệt
npm run test:auth      # Test authentication
npm run test:stories   # Test stories management
npm run test:library   # Test public library
```

### 3. Cấu hình Environment Variables

```bash
# Cấu hình URL server
export BASE_URL="http://localhost:3000"

# Cấu hình thông tin test
export TEST_EMAIL="test@example.com"
export TEST_PASSWORD="password123"

# Cấu hình performance test
export CONCURRENT_USERS=10
export REQUESTS_PER_USER=5
```

## Chi tiết Scripts

### test_api.js

Script cơ bản test các API chính:

- Health check
- Authentication
- Stories management
- Public library
- Categories

### comprehensive_test.js

Script test toàn diện với các tính năng:

- Test tất cả endpoints được định nghĩa
- Quản lý dependencies giữa các test
- Lưu kết quả chi tiết vào file JSON
- Báo cáo tỷ lệ thành công/thất bại

### performance_test.js

Script test hiệu suất với các tính năng:

- Mô phỏng nhiều user đồng thời
- Đo thời gian response
- Tính toán requests per second
- Phân tích theo từng scenario
- Đưa ra khuyến nghị tối ưu

## Kết quả Test

Các file kết quả sẽ được tạo:

- `test_results.json` - Kết quả comprehensive test
- `performance_results.json` - Kết quả performance test

## Cấu hình

Cập nhật các biến trong file `environment.json`:

- `base_url`: URL của API server
- `email`: Email để test authentication
- `password`: Password để test authentication
- `story_id`, `user_id`, etc.: IDs để test các API cụ thể
