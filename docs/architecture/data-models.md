# Data Models

## Core Business Entities

Dựa trên phân tích codebase, ChatStoryAI có các entity chính sau:

### User

**Purpose:** Quản lý thông tin người dùng và authentication

**Key Attributes:**

- user_id: INT (Primary Key) - Unique identifier
- username: VARCHAR(255) - Display name
- email: VARCHAR(255) - Authentication và communication
- user_password: VARCHAR(255) - Hashed password (nullable cho Google users)
- avatar: VARCHAR(255) - Profile image URL
- has_badge: BOOLEAN - Premium user indicator
- created_at: TIMESTAMP - Account creation time

**Relationships:**

- One-to-Many với Stories (user tạo nhiều stories)
- One-to-Many với AI Chat History
- One-to-Many với API Keys

### Story

**Purpose:** Core entity cho việc quản lý truyện và nội dung

**Key Attributes:**

- story_id: INT (Primary Key) - Unique identifier
- title: VARCHAR(255) - Story title
- description: TEXT - Story summary/description
- main_category: VARCHAR(100) - Primary genre
- status: ENUM('draft', 'published', 'archived') - Publication status
- cover_image: VARCHAR(255) - Cover image URL
- view_count: INT - Reading statistics
- favorite_count: INT - User engagement metrics
- created_at/updated_at: TIMESTAMP - Audit trail

**Relationships:**

- Many-to-One với User (story belongs to user)
- One-to-Many với Chapters
- One-to-Many với Characters
- One-to-Many với Outlines
- Many-to-Many với Tags

### Chapter

**Purpose:** Tổ chức nội dung truyện theo chương

**Key Attributes:**

- chapter_id: INT (Primary Key) - Unique identifier
- story_id: INT (Foreign Key) - Parent story
- title: VARCHAR(255) - Chapter title
- summary: TEXT - Chapter summary
- status: VARCHAR(50) - Chapter status
- order_number: INT - Chapter sequence
- created_at/updated_at: TIMESTAMP - Audit trail

**Relationships:**

- Many-to-One với Story
- One-to-Many với Dialogues
- One-to-Many với AI Generated Dialogues

### Character

**Purpose:** Quản lý nhân vật trong truyện

**Key Attributes:**

- character_id: INT (Primary Key) - Unique identifier
- story_id: INT (Foreign Key) - Parent story
- name: VARCHAR(255) - Character name
- description: TEXT - Character description
- gender: VARCHAR(50) - Character gender
- personality: TEXT - Personality traits
- appearance: TEXT - Physical description
- background: TEXT - Character backstory
- role: VARCHAR(100) - Character role in story
- avatar_image: VARCHAR(255) - Character avatar

**Relationships:**

- Many-to-One với Story
- Referenced trong Dialogues

### Dialogue

**Purpose:** Quản lý hội thoại và nội dung chapter

**Key Attributes:**

- dialogue_id: INT (Primary Key) - Unique identifier
- chapter_id: INT (Foreign Key) - Parent chapter
- content: TEXT - Dialogue content
- type: ENUM('dialogue', 'aside') - Content type
- character_name: VARCHAR(255) - Speaking character
- order_number: INT - Sequence trong chapter

**Relationships:**

- Many-to-One với Chapter
- References Character (by name)

### AI_Generated_Dialogues

**Purpose:** Lưu trữ nội dung AI tạo ra trước khi được approve

**Key Attributes:**

- dialogue_id: INT (Primary Key) - Unique identifier
- story_id: INT (Foreign Key) - Parent story
- chapter_id: INT (Foreign Key) - Parent chapter
- content: TEXT - AI generated content
- type: VARCHAR(50) - Content type
- character_names: JSON - Array of character names
- is_added: BOOLEAN - Approval status

**Relationships:**

- Many-to-One với Story
- Many-to-One với Chapter
