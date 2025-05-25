# Coding Standards

## Core Standards

- **Languages & Runtimes:** TypeScript 5.x, Node.js 20.x
- **Style & Linting:** ESLint với Next.js config, Prettier formatting
- **Test Organization:** Co-located test files với `.test.ts` suffix

## Critical Rules

- **Logging Rule:** Never use console.log trong production code - use structured logging
- **API Response Rule:** All API responses must use consistent JSON format với error handling
- **Database Rule:** All database queries must use connection pool, never direct connections
- **Authentication Rule:** All protected routes must use NextAuth.js middleware
- **Type Safety Rule:** No `any` types except trong legacy integration code
- **Environment Rule:** All configuration must come from environment variables

## TypeScript Specifics

- **Strict Mode:** Enable strict TypeScript checking
- **Interface Naming:** Use PascalCase cho interfaces, avoid `I` prefix
- **Type Imports:** Use `import type` cho type-only imports
- **Null Safety:** Use optional chaining và nullish coalescing
