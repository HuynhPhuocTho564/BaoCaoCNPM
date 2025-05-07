# ChatStoryAI - Nền Tảng Sáng Tạo Truyện với AI

ChatStoryAI là một nền tảng sáng tạo truyện với sự hỗ trợ của AI, cho phép người dùng tạo và chia sẻ những câu chuyện độc đáo. Dự án được phát triển bởi nhóm sinh viên DA22TTC - Trường Đại học Trà Vinh.

## 🌟 Tính Năng Chính

### 1. Sáng Tạo với AI
- Tạo ý tưởng truyện độc đáo
- Phát triển nhân vật đa chiều
- Tạo hội thoại tự nhiên
- Quản lý chương và đại cương
- Tạo prompt cho ảnh bìa và avatar

### 2. Thư Viện Truyện
- Đọc truyện đa dạng thể loại
- Đánh dấu chương đã đọc
- Theo dõi tiến độ đọc
- Tìm kiếm và lọc truyện

### 3. Quản Lý Nội Dung
- Tạo và quản lý truyện
- Phát triển nhân vật
- Quản lý chương và cốt truyện
- Xuất bản và chia sẻ

## 🛠 Công Nghệ Sử Dụng

- **Frontend:** Next.js, TypeScript, TailwindCSS
- **Backend:** Node.js, MySQL
- **AI:** Google Gemini API
- **Storage:** Google Drive API
- **Authentication:** NextAuth.js
- **Container:** Docker

## 🚀 Cài Đặt và Chạy

1. Clone repository:
```bash
git clone https://github.com/your-username/chatstoryai.git
cd chatstoryai
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file môi trường:
```bash
cp .env.example .env
```

4. Cấu hình các biến môi trường trong `.env`

5. Chạy với Docker:
```bash
docker-compose up -d
```

6. Chạy ứng dụng:
```bash
npm run dev
```

## 📝 Cấu Trúc Dự Án

```
src/
├── app/              # Pages và API routes
├── components/       # React components
├── lib/             # Utilities và helpers
├── services/        # External services
└── styles/          # Global styles
```

## 🔑 API Endpoints

### Stories
- `GET /api/stories` - Lấy danh sách truyện
- `POST /api/stories/create` - Tạo truyện mới
- `GET /api/stories/[id]` - Chi tiết truyện
- `PUT /api/stories/[id]` - Cập nhật truyện
- `DELETE /api/stories/[id]` - Xóa truyện

### Chapters
- `GET /api/stories/[id]/chapters` - Danh sách chương
- `POST /api/stories/[id]/chapters` - Thêm chương mới
- `GET /api/stories/[id]/chapters/[chapterId]` - Chi tiết chương

### Characters
- `GET /api/stories/[id]/characters` - Danh sách nhân vật
- `POST /api/stories/[id]/characters` - Thêm nhân vật mới
- `PUT /api/stories/[id]/characters/[characterId]` - Cập nhật nhân vật

## 👥 Đóng Góp

Chúng tôi rất hoan nghênh mọi đóng góp! Vui lòng:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 Giấy Phép

Dự án được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm thông tin.

## 📞 Liên Hệ

- Email: chatstoryai@gmail.com
- Phone: 0762605309
- Địa chỉ: Trường Đại Học Trà Vinh - DA22TTC

## ✨ Người Đóng Góp

Cảm ơn những người đã đóng góp cho dự án này:

- Nhóm sinh viên DA22TTC - Báo cáo môn học Công Nghệ Phần Mềm - Nguyễn Huỳnh Phú Vinh - Nguyễn Phú Vinh - Huỳnh Phước Thọ - Trường Đại học Trà Vinh
