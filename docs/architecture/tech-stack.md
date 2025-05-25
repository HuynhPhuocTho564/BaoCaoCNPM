# Tech Stack

## Cloud Infrastructure

- **Provider:** Docker Containerization (Local/Cloud agnostic)
- **Key Services:** MySQL Database, File Storage (Google Drive), Email (Gmail SMTP)
- **Deployment Regions:** Configurable based on deployment target

## Technology Stack Table

| Category             | Technology        | Version   | Purpose                      | Rationale                                                        |
| -------------------- | ----------------- | --------- | ---------------------------- | ---------------------------------------------------------------- |
| **Runtime**          | Node.js           | 20.x      | JavaScript runtime           | LTS version, excellent performance, wide ecosystem               |
| **Language**         | TypeScript        | 5.x       | Primary development language | Type safety, better developer experience, maintainability        |
| **Framework**        | Next.js           | 15.3.3    | Full-stack React framework   | SSR/SSG capabilities, API routes, excellent developer experience |
| **Database**         | MySQL             | 8.0       | Primary database             | Relational data model fits story/character relationships         |
| **ORM/Query**        | mysql2            | 3.12.0    | Database driver              | Direct SQL queries, performance, flexibility                     |
| **Authentication**   | NextAuth.js       | 4.24.11   | Authentication system        | OAuth integration, session management, security                  |
| **AI Service**       | Google Gemini     | 2.5-flash | Content generation AI        | Advanced language model, multimodal capabilities                 |
| **UI Framework**     | React             | 19.0.0    | Frontend framework           | Component-based architecture, large ecosystem                    |
| **Styling**          | TailwindCSS       | 3.4.1     | CSS framework                | Utility-first, rapid development, consistent design              |
| **UI Components**    | Radix UI          | Various   | Accessible components        | Accessibility-first, customizable, well-tested                   |
| **State Management** | React Hooks       | Built-in  | Client state management      | Simple, built-in solution, sufficient for current needs          |
| **File Storage**     | Google Drive API  | v3        | File and image storage       | Free tier, reliable, easy integration                            |
| **Email Service**    | Gmail SMTP        | -         | Transactional emails         | Reliable, free tier, easy setup                                  |
| **Payment**          | VNPay             | 1.6.1     | Payment processing           | Local Vietnam payment gateway                                    |
| **Containerization** | Docker            | Latest    | Application containerization | Consistent deployment, environment isolation                     |
| **MCP Integration**  | MCP SDK           | 1.12.0    | AI assistant integration     | Standardized protocol cho AI assistant communication             |
| **Development**      | ESLint + Prettier | Latest    | Code quality and formatting  | Code consistency, error prevention                               |
