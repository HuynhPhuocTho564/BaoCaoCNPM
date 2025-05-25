# Error Handling Strategy

## General Approach

- **Error Model:** Structured error responses với consistent format
- **Exception Hierarchy:** Custom error classes extending base Error
- **Error Propagation:** Centralized error handling trong API routes

## Logging Standards

- **Library:** Console logging với structured format
- **Format:** JSON structured logs với timestamp, level, message, context
- **Levels:** ERROR, WARN, INFO, DEBUG
- **Required Context:**
  - Correlation ID: Request ID cho tracing
  - Service Context: Component/service name
  - User Context: User ID (when available, không log sensitive data)

## Error Handling Patterns

### External API Errors

- **Retry Policy:** Exponential backoff với max 3 retries
- **Circuit Breaker:** Not implemented (future enhancement)
- **Timeout Configuration:** 30 seconds cho AI API calls
- **Error Translation:** Convert external errors thành user-friendly messages

### Business Logic Errors

- **Custom Exceptions:** StoryNotFoundError, InvalidUserError, etc.
- **User-Facing Errors:** Localized Vietnamese error messages
- **Error Codes:** HTTP status codes với custom error types

### Data Consistency

- **Transaction Strategy:** Database transactions cho multi-table operations
- **Compensation Logic:** Manual rollback procedures
- **Idempotency:** API key-based request deduplication
