-- Tạo user và cấp quyền cho ChatStory AI
-- File này sẽ được thực thi trước file init.sql

-- Tạo user nếu chưa tồn tại
CREATE USER IF NOT EXISTS 'chatstory_user'@'%' IDENTIFIED BY 'chatstory_password';

-- Cấp tất cả quyền cho database chatstoryai
GRANT ALL PRIVILEGES ON chatstoryai.* TO 'chatstory_user'@'%';

-- Cấp quyền tạo database (nếu cần)
GRANT CREATE ON *.* TO 'chatstory_user'@'%';

-- Áp dụng thay đổi
FLUSH PRIVILEGES;

-- Hiển thị thông báo
SELECT 'User chatstory_user created and granted permissions successfully!' as message;
