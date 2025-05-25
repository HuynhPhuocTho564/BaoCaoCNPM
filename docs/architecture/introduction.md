# Introduction

Tài liệu này mô tả tổng quan kiến trúc dự án cho **ChatStoryAI**, bao gồm hệ thống backend, các dịch vụ chia sẻ, và các vấn đề không liên quan đến UI cụ thể. Mục tiêu chính là phục vụ như bản thiết kế kiến trúc hướng dẫn cho việc phát triển được điều khiển bởi AI, đảm bảo tính nhất quán và tuân thủ các mẫu và công nghệ đã chọn.

**Mối quan hệ với Kiến trúc Frontend:**
Vì dự án bao gồm một giao diện người dùng quan trọng, một Tài liệu Kiến trúc Frontend riêng biệt sẽ chi tiết thiết kế cụ thể cho frontend và PHẢI được sử dụng kết hợp với tài liệu này. Các lựa chọn công nghệ cốt lõi được ghi lại ở đây (xem "Tech Stack") là quyết định cho toàn bộ dự án, bao gồm cả các thành phần frontend.

## Starter Template hoặc Dự án Hiện có

**Phân tích dự án hiện có:**

Dự án ChatStoryAI là một **brownfield project** đã được phát triển với:

- **Framework chính**: Next.js (Full-stack React framework)
- **Cấu trúc**: Monolithic Next.js application với API routes
- **Database**: MySQL với kết nối trực tiếp
- **AI Integration**: Google Gemini API cho tính năng chat và tạo nội dung
- **Authentication**: NextAuth.js
- **Containerization**: Docker với docker-compose
- **Cloud Storage**: Google Drive API

**Ràng buộc từ codebase hiện có:**

- Đã có cấu trúc thư mục Next.js với `src/app` directory structure
- Database schema đã được thiết lập cho stories, characters, chapters, dialogues
- API endpoints đã được implement trong `src/app/api/`
- UI components sử dụng Radix UI + TailwindCSS
- TypeScript configuration đã được setup

**Quyết định kiến trúc**: Tiếp tục phát triển trên nền tảng Next.js hiện có, tối ưu hóa và mở rộng các tính năng mà không thay đổi cấu trúc cốt lõi.

**Cập nhật mới nhất**: Đã thêm MCP (Model Context Protocol) Server để tích hợp với AI assistants như Claude Desktop, mở rộng khả năng tương tác với hệ thống qua giao thức chuẩn.

## Change Log

| Date       | Version | Description                                    | Author              |
| ---------- | ------- | ---------------------------------------------- | ------------------- |
| 2025-01-18 | 1.0     | Tài liệu kiến trúc ban đầu từ codebase hiện có | Winston (Architect) |
| 2025-01-18 | 1.1     | Cập nhật kiến trúc với MCP Server integration  | Winston (Architect) |
