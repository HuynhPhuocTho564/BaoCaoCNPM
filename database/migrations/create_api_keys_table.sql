CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    last_used_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSON DEFAULT NULL,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_api_key (api_key),
    INDEX idx_is_active (is_active),
    INDEX idx_expires_at (expires_at)
);


