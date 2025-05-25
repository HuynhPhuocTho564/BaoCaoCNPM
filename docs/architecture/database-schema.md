# Database Schema

## MySQL Schema Definition

```sql
-- Users table
CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) DEFAULT NULL,
  avatar VARCHAR(255) DEFAULT '/default-user.webp',
  drive_file_id VARCHAR(255) DEFAULT NULL,
  has_badge TINYINT(1) DEFAULT '0',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stories table
CREATE TABLE stories (
  story_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  main_category VARCHAR(100) NOT NULL,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  cover_image VARCHAR(255) DEFAULT NULL,
  cover_file_id VARCHAR(255) DEFAULT NULL,
  view_count INT DEFAULT '0',
  favorite_count INT DEFAULT '0',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (story_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_main_category (main_category),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Story chapters table
CREATE TABLE story_chapters (
  chapter_id INT NOT NULL AUTO_INCREMENT,
  story_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  order_number INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (chapter_id),
  FOREIGN KEY (story_id) REFERENCES stories(story_id) ON DELETE CASCADE,
  INDEX idx_story_id (story_id),
  INDEX idx_order_number (order_number),
  UNIQUE KEY unique_story_order (story_id, order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Story characters table
CREATE TABLE story_characters (
  character_id INT NOT NULL AUTO_INCREMENT,
  story_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  gender VARCHAR(50),
  birthday VARCHAR(50),
  height VARCHAR(50),
  weight VARCHAR(50),
  personality TEXT,
  appearance TEXT,
  background TEXT,
  role VARCHAR(100),
  avatar_image VARCHAR(255),
  avatar_file_id VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (character_id),
  FOREIGN KEY (story_id) REFERENCES stories(story_id) ON DELETE CASCADE,
  INDEX idx_story_id (story_id),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chapter dialogues table
CREATE TABLE chapter_dialogues (
  dialogue_id INT NOT NULL AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  content TEXT NOT NULL,
  type ENUM('dialogue', 'aside') DEFAULT 'dialogue',
  character_name VARCHAR(255),
  order_number INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (dialogue_id),
  FOREIGN KEY (chapter_id) REFERENCES story_chapters(chapter_id) ON DELETE CASCADE,
  INDEX idx_chapter_id (chapter_id),
  INDEX idx_order_number (order_number),
  INDEX idx_character_name (character_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI generated dialogues table
CREATE TABLE ai_generated_dialogues (
  dialogue_id INT NOT NULL AUTO_INCREMENT,
  story_id INT NOT NULL,
  chapter_id INT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'dialogue',
  character_names JSON,
  is_added TINYINT(1) DEFAULT '0',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (dialogue_id),
  FOREIGN KEY (story_id) REFERENCES stories(story_id) ON DELETE CASCADE,
  FOREIGN KEY (chapter_id) REFERENCES story_chapters(chapter_id) ON DELETE CASCADE,
  INDEX idx_story_id (story_id),
  INDEX idx_chapter_id (chapter_id),
  INDEX idx_is_added (is_added)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI chat history table
CREATE TABLE ai_chat_history (
  chat_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (chat_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI chat messages table
CREATE TABLE ai_chat_messages (
  message_id INT NOT NULL AUTO_INCREMENT,
  chat_id INT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id),
  FOREIGN KEY (chat_id) REFERENCES ai_chat_history(chat_id) ON DELETE CASCADE,
  INDEX idx_chat_id (chat_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Key Design Decisions

1. **UTF8MB4 Charset**: Supports full Unicode including emojis và special characters
2. **InnoDB Engine**: ACID compliance, foreign key support, better performance
3. **Timestamp Audit Trail**: created_at và updated_at cho tất cả major entities
4. **Cascading Deletes**: Maintain referential integrity khi delete parent records
5. **Strategic Indexing**: Optimize common query patterns (user_id, status, categories)
6. **JSON Fields**: character_names trong ai_generated_dialogues cho flexibility
7. **ENUM Types**: Constrain values cho status và type fields
