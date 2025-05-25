# External APIs

## Google Gemini AI API

- **Purpose:** AI-powered content generation cho stories, characters, dialogues
- **Documentation:** https://ai.google.dev/docs
- **Base URL(s):** https://generativelanguage.googleapis.com
- **Authentication:** API Key authentication
- **Rate Limits:** Requests per minute based on API tier

**Key Endpoints Used:**

- `POST /v1beta/models/gemini-2.5-flash-preview-05-20:generateContent` - Content generation
- `POST /v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent` - Streaming responses

**Integration Notes:** Sử dụng custom prompts cho story creation, character development, và dialogue generation. Safety settings được configure để allow creative content.

## Google Drive API

- **Purpose:** File storage cho cover images, character avatars, và user uploads
- **Documentation:** https://developers.google.com/drive/api
- **Base URL(s):** https://www.googleapis.com/drive/v3
- **Authentication:** Service Account với JSON key
- **Rate Limits:** 1000 requests per 100 seconds per user

**Key Endpoints Used:**

- `POST /files` - File upload
- `GET /files/{fileId}` - File metadata
- `PATCH /files/{fileId}` - Update file permissions

**Integration Notes:** Files được store trong dedicated Google Drive folder với public read permissions cho images.

## Gmail SMTP

- **Purpose:** Transactional emails cho password reset, notifications
- **Documentation:** https://support.google.com/mail/answer/7126229
- **Base URL(s):** smtp.gmail.com:587
- **Authentication:** App Password authentication
- **Rate Limits:** 500 emails per day for free accounts

**Key Operations:**

- Password reset emails
- Account verification emails
- Notification emails

**Integration Notes:** Sử dụng nodemailer với Gmail SMTP, requires App Password setup.

## VNPay Payment Gateway

- **Purpose:** Payment processing cho premium features
- **Documentation:** https://sandbox.vnpayment.vn/apis/
- **Base URL(s):** https://sandbox.vnpayment.vn (sandbox), https://vnpayment.vn (production)
- **Authentication:** TMN Code và Hash Secret
- **Rate Limits:** Based on merchant agreement

**Key Endpoints Used:**

- `POST /paymentv2/vpcpay.html` - Create payment
- `GET /merchant_webapi/api/transaction` - Query transaction

**Integration Notes:** Local Vietnam payment gateway, supports multiple payment methods including banking và e-wallets.

## Model Context Protocol (MCP)

- **Purpose:** Standardized integration với AI assistants như Claude Desktop
- **Documentation:** https://modelcontextprotocol.io/docs
- **Base URL(s):** Local stdio transport
- **Authentication:** API key forwarding từ MCP client
- **Rate Limits:** Inherited từ underlying ChatStoryAI API

**Key Tools Available:**

- Story management (CRUD operations)
- Chapter management
- Character management
- Dialogue management
- Outline management
- Bookmark và reading history
- Categories và tags

**Integration Notes:** MCP Server acts như một proxy layer, forwarding requests từ AI assistants đến ChatStoryAI API endpoints với proper authentication và error handling.
