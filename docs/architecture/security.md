# Security

## Input Validation

- **Validation Library:** Built-in Next.js validation với custom middleware
- **Validation Location:** API route level trước khi processing
- **Required Rules:**
  - All external inputs MUST be validated và sanitized
  - Validation at API boundary trước business logic
  - Whitelist approach preferred over blacklist
  - SQL injection prevention qua parameterized queries

## Authentication & Authorization

- **Auth Method:** NextAuth.js với session-based authentication
- **Session Management:** JWT tokens với secure httpOnly cookies
- **Required Patterns:**
  - All protected API routes must check authentication
  - Role-based access control cho admin features
  - Session timeout và refresh mechanisms
  - Secure password hashing với bcryptjs

## Secrets Management

- **Development:** Environment variables trong `.env.local`
- **Production:** Cloud provider secret management service
- **Code Requirements:**
  - NEVER hardcode secrets trong source code
  - Access via process.env only
  - No secrets trong logs hoặc error messages
  - Rotate API keys regularly

## API Security

- **Rate Limiting:** Not implemented (future enhancement)
- **CORS Policy:** Configured trong Next.js config
- **Security Headers:** Next.js default security headers
- **HTTPS Enforcement:** Required trong production deployment

## Data Protection

- **Encryption at Rest:** Database-level encryption
- **Encryption in Transit:** HTTPS/TLS cho all communications
- **PII Handling:** Minimal PII collection, secure storage
- **Logging Restrictions:** Never log passwords, API keys, hoặc sensitive user data

## Dependency Security

- **Scanning Tool:** GitHub Dependabot và npm audit
- **Update Policy:** Monthly security updates, immediate cho critical vulnerabilities
- **Approval Process:** Review security advisories trước updating dependencies

## Security Testing

- **SAST Tool:** ESLint security rules
- **DAST Tool:** Manual penetration testing (future automation)
- **Penetration Testing:** Annual third-party security assessment
