# Tài liệu API - ChatStoryAI

## Xác thực API

Tất cả các API đều hỗ trợ 2 phương thức xác thực:

- **Session Auth**: Sử dụng session cookie từ đăng nhập web
- **API Key Auth**: Sử dụng Bearer token trong header `Authorization: Bearer YOUR_API_KEY`

## 1. Quản lý Truyện (Stories)

### 1.1 Lấy danh sách truyện của người dùng

- **URL**: `/api/stories`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy tất cả truyện thuộc về người dùng hiện tại
- **Response**:

```json
{
  "stories": [
    {
      "story_id": 1,
      "title": "Tên truyện",
      "description": "Mô tả truyện",
      "cover_image": "URL ảnh bìa",
      "status": "draft|published",
      "view_count": 100,
      "updated_at": "2024-01-01T00:00:00.000Z",
      "main_category": "Tên thể loại",
      "tags": ["tag1", "tag2"],
      "favorite_count": 5
    }
  ]
}
```

### 1.2 Tạo truyện mới

- **URL**: `/api/stories/create`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title` (string, required): Tiêu đề truyện
  - `description` (string, required): Mô tả truyện
  - `mainCategoryId` (string, required): ID thể loại chính
  - `tagIds` (string, required): JSON array của tag IDs
  - `coverImage` (file, optional): File ảnh bìa
- **Tính năng**: Tạo truyện mới với ảnh bìa và tags
- **Response**:

```json
{
  "message": "Tạo truyện thành công",
  "storyId": 123
}
```

### 1.3 Lấy chi tiết truyện

- **URL**: `/api/stories/{id}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy thông tin chi tiết của một truyện
- **Response**:

```json
{
  "story": {
    "story_id": 1,
    "title": "Tên truyện",
    "description": "Mô tả",
    "main_category": "Thể loại",
    "tag_ids": [1, 2, 3],
    "tags": ["tag1", "tag2"],
    "favorite_count": 10
  }
}
```

### 1.4 Cập nhật truyện

- **URL**: `/api/stories/{id}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title` (string, required): Tiêu đề mới
  - `description` (string, required): Mô tả mới
  - `mainCategoryId` (string, required): ID thể loại mới
  - `tagIds` (string, required): JSON array của tag IDs mới
  - `coverImage` (file, optional): Ảnh bìa mới
- **Tính năng**: Cập nhật thông tin truyện bao gồm ảnh bìa
- **Response**:

```json
{
  "message": "Cập nhật truyện thành công"
}
```

### 1.5 Xóa truyện

- **URL**: `/api/stories/{id}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Xóa hoàn toàn truyện và tất cả dữ liệu liên quan
- **Response**:

```json
{
  "message": "Xóa truyện thành công"
}
```

### 1.6 Xuất bản truyện

- **URL**: `/api/stories/{id}/publish`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Chuyển trạng thái từ draft sang published
- **Response**:

```json
{
  "message": "Xuất bản truyện thành công"
}
```

## 2. Quản lý Bookmark

### 2.1 Kiểm tra trạng thái bookmark

- **URL**: `/api/stories/{id}/bookmarks`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Kiểm tra người dùng đã bookmark truyện chưa
- **Response**:

```json
{
  "isBookmarked": true
}
```

### 2.2 Toggle bookmark truyện

- **URL**: `/api/stories/{id}/bookmarks`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Thêm hoặc xóa bookmark cho truyện
- **Response**:

```json
{
  "message": "Đã lưu truyện",
  "isBookmarked": true
}
```

## 3. Quản lý Chương (Chapters)

### 3.1 Lấy danh sách chương

- **URL**: `/api/stories/{id}/chapters`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Query Parameters**:
  - `status` (optional): `draft` hoặc `published`
- **Tính năng**: Lấy tất cả chương của truyện
- **Response**:

```json
{
  "chapters": [
    {
      "chapter_id": 1,
      "title": "Chương 1",
      "summary": "Tóm tắt chương",
      "order_number": 1,
      "status": "draft",
      "publish_order": null,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3.2 Tạo chương mới

- **URL**: `/api/stories/{id}/chapters`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "title": "Chương 1: Khởi đầu",
  "summary": "Tóm tắt nội dung chương",
  "status": "draft"
}
```

- **Tính năng**: Tạo chương mới cho truyện
- **Response**:

```json
{
  "chapter_id": 123,
  "title": "Chương 1: Khởi đầu",
  "summary": "Tóm tắt nội dung chương",
  "status": "draft",
  "order_number": 1,
  "publish_order": null
}
```

### 3.3 Lấy thông tin chương

- **URL**: `/api/stories/{id}/chapters/{chapterId}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy chi tiết một chương
- **Response**:

```json
{
  "chapter": {
    "chapter_id": 1,
    "title": "Chương 1",
    "status": "draft",
    "summary": "Tóm tắt",
    "dialogue_count": 5
  }
}
```

### 3.4 Cập nhật chương

- **URL**: `/api/stories/{id}/chapters/{chapterId}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "title": "Tiêu đề mới",
  "summary": "Tóm tắt mới",
  "status": "published"
}
```

- **Tính năng**: Cập nhật thông tin chương, tự động tạo thông báo khi xuất bản
- **Response**:

```json
{
  "message": "Cập nhật chương thành công",
  "chapter": {
    "chapter_id": 1,
    "title": "Tiêu đề mới",
    "summary": "Tóm tắt mới",
    "status": "published"
  }
}
```

### 3.5 Xóa chương

- **URL**: `/api/stories/{id}/chapters/{chapterId}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Xóa chương khỏi truyện
- **Response**:

```json
{
  "message": "Xóa chương thành công"
}
```

## 4. Quản lý Hội thoại (Dialogues)

### 4.1 Lấy danh sách hội thoại

- **URL**: `/api/stories/{id}/chapters/{chapterId}/dialogues`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy tất cả hội thoại trong chương
- **Response**:

```json
{
  "dialogues": [
    {
      "dialogue_id": 1,
      "character_id": 1,
      "content": "Nội dung hội thoại",
      "order_number": 1,
      "type": "dialogue"
    }
  ]
}
```

### 4.2 Thêm hội thoại mới

- **URL**: `/api/stories/{id}/chapters/{chapterId}/dialogues`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "character_id": 1,
  "content": "Nội dung hội thoại",
  "order_number": 1,
  "type": "dialogue"
}
```

- **Tính năng**: Thêm hội thoại mới vào chương
- **Response**:

```json
{
  "message": "Thêm dialogue thành công",
  "dialogue": {
    "dialogue_id": 123,
    "character_id": 1,
    "content": "Nội dung hội thoại",
    "order_number": 1,
    "type": "dialogue"
  }
}
```

### 4.3 Cập nhật hội thoại

- **URL**: `/api/stories/{id}/chapters/{chapterId}/dialogues/{dialogueId}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "content": "Nội dung mới"
}
```

- **Tính năng**: Cập nhật nội dung hội thoại
- **Response**:

```json
{
  "message": "Cập nhật dialogue thành công"
}
```

### 4.4 Xóa hội thoại

- **URL**: `/api/stories/{id}/chapters/{chapterId}/dialogues/{dialogueId}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Xóa hội thoại khỏi chương
- **Response**:

```json
{
  "message": "Xóa dialogue thành công"
}
```

### 4.5 Di chuyển hội thoại

- **URL**: `/api/stories/{id}/chapters/{chapterId}/dialogues/{dialogueId}/move`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "new_order": 3
}
```

- **Tính năng**: Thay đổi thứ tự hội thoại trong chương
- **Response**:

```json
{
  "message": "Di chuyển dialogue thành công"
}
```

## 5. Quản lý Nhân vật (Characters)

### 5.1 Lấy danh sách nhân vật

- **URL**: `/api/stories/{id}/characters`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy tất cả nhân vật của truyện
- **Response**:

```json
{
  "characters": [
    {
      "character_id": 1,
      "name": "Tên nhân vật",
      "avatar_image": "URL ảnh đại diện",
      "description": "Mô tả nhân vật",
      "role": "main"
    }
  ]
}
```

### 5.2 Tạo nhân vật mới

- **URL**: `/api/stories/{id}/characters`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name` (string, required): Tên nhân vật
  - `description` (string, required): Mô tả nhân vật
  - `role` (string, required): `main` hoặc `supporting`
  - `gender` (string, optional): Giới tính
  - `birthday` (string, optional): Ngày sinh
  - `height` (integer, optional): Chiều cao (cm)
  - `weight` (integer, optional): Cân nặng (kg)
  - `personality` (string, optional): Tính cách
  - `appearance` (string, optional): Ngoại hình
  - `background` (string, optional): Lý lịch
  - `avatarImage` (file, optional): Ảnh đại diện
- **Tính năng**: Tạo nhân vật mới với ảnh đại diện, chỉ cho phép 1 nhân vật chính
- **Response**:

```json
{
  "message": "Tạo nhân vật thành công"
}
```

### 5.3 Lấy thông tin nhân vật

- **URL**: `/api/stories/{id}/characters/{characterId}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy chi tiết một nhân vật
- **Response**:

```json
{
  "character": {
    "character_id": 1,
    "name": "Tên nhân vật",
    "description": "Mô tả",
    "role": "main",
    "gender": "Nam",
    "birthday": "1990-01-01",
    "height": 175,
    "weight": 70,
    "personality": "Tính cách",
    "appearance": "Ngoại hình",
    "background": "Lý lịch",
    "avatar_image": "URL ảnh",
    "avatar_file_id": "file_id"
  }
}
```

### 5.4 Cập nhật nhân vật

- **URL**: `/api/stories/{id}/characters/{characterId}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `multipart/form-data`
- **Body**: Giống như tạo nhân vật mới
- **Tính năng**: Cập nhật thông tin nhân vật, có thể thay đổi ảnh đại diện
- **Response**:

```json
{
  "message": "Cập nhật nhân vật thành công"
}
```

### 5.5 Xóa nhân vật

- **URL**: `/api/stories/{id}/characters/{characterId}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Xóa nhân vật và ảnh đại diện khỏi truyện
- **Response**:

```json
{
  "message": "Xóa nhân vật thành công"
}
```

## 6. Quản lý Đại cương (Outlines)

### 6.1 Lấy danh sách đại cương

- **URL**: `/api/stories/{id}/outlines`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy tất cả đại cương của truyện theo thứ tự
- **Response**:

```json
{
  "outlines": [
    {
      "outline_id": 1,
      "title": "Đại cương 1",
      "description": "Mô tả đại cương",
      "order_number": 1,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 6.2 Tạo đại cương mới

- **URL**: `/api/stories/{id}/outlines`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "title": "Tiêu đề đại cương",
  "description": "Mô tả chi tiết"
}
```

- **Tính năng**: Thêm đại cương mới cho truyện
- **Response**:

```json
{
  "outline_id": 123,
  "title": "Tiêu đề đại cương",
  "description": "Mô tả chi tiết",
  "order_number": 1
}
```

### 6.3 Lấy thông tin đại cương

- **URL**: `/api/stories/{id}/outlines/{outlineId}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy chi tiết một đại cương
- **Response**:

```json
{
  "outline": {
    "outline_id": 1,
    "title": "Tiêu đề",
    "description": "Mô tả",
    "order_number": 1
  }
}
```

### 6.4 Cập nhật đại cương

- **URL**: `/api/stories/{id}/outlines/{outlineId}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "title": "Tiêu đề mới",
  "description": "Mô tả mới"
}
```

- **Tính năng**: Cập nhật thông tin đại cương
- **Response**:

```json
{
  "message": "Cập nhật đại cương thành công",
  "outline": {
    "outline_id": 1,
    "title": "Tiêu đề mới",
    "description": "Mô tả mới"
  }
}
```

### 6.5 Xóa đại cương

- **URL**: `/api/stories/{id}/outlines/{outlineId}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Xóa đại cương khỏi truyện
- **Response**:

```json
{
  "message": "Xóa đại cương thành công"
}
```

## 7. Quản lý Tài khoản (Account)

### 7.1 Lấy danh sách bookmark

- **URL**: `/api/account/bookmarks`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy tất cả truyện đã bookmark
- **Response**:

```json
{
  "bookmarks": [
    {
      "story_id": 1,
      "title": "Tên truyện",
      "cover_image": "URL ảnh bìa",
      "main_category": "Thể loại",
      "bookmarked_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 7.2 Lấy lịch sử xem

- **URL**: `/api/account/view-history`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer YOUR_API_KEY`
- **Tính năng**: Lấy 20 truyện gần đây nhất đã xem
- **Response**:

```json
{
  "history": [
    {
      "story_id": 1,
      "title": "Tên truyện",
      "cover_image": "URL ảnh bìa",
      "main_category": "Thể loại",
      "view_date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Mã lỗi phổ biến

- **401 Unauthorized**: Chưa xác thực hoặc API key không hợp lệ
- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
- **404 Not Found**: Không tìm thấy tài nguyên
- **500 Internal Server Error**: Lỗi server

## Ví dụ sử dụng với cURL

### Lấy danh sách truyện:

```bash
curl -X GET "http://localhost:3000/api/stories" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Tạo truyện mới:

```bash
curl -X POST "http://localhost:3000/api/stories/create" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "title=Truyện mới" \
  -F "description=Mô tả truyện" \
  -F "mainCategoryId=1" \
  -F "tagIds=[1,2,3]" \
  -F "coverImage=@cover.jpg"
```

### Tạo chương mới:

```bash
curl -X POST "http://localhost:3000/api/stories/1/chapters" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chương 1: Khởi đầu",
    "summary": "Tóm tắt chương",
    "status": "draft"
  }'
```
