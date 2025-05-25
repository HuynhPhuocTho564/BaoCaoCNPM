# Source Tree

```
ChatStoryAI/
├── .bmad-core/                     # BMAD framework configuration
│   ├── agents/                     # AI agent definitions
│   ├── templates/                  # Document templates
│   ├── tasks/                      # Workflow tasks
│   └── core-config.yaml           # Core configuration
├── mcp/                            # Model Context Protocol Server
│   ├── src/                        # MCP server source code
│   │   ├── api/                    # API client và constants
│   │   ├── config/                 # MCP server configuration
│   │   ├── mcp/                    # MCP tool registration
│   │   ├── tools/                  # Tool implementations
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── utils/                  # Utility functions
│   │   └── index.ts                # MCP server entry point
│   ├── package.json                # MCP server dependencies
│   └── tsconfig.json               # TypeScript configuration
├── .github/                        # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml                  # CI/CD pipeline
│       └── performance.yml         # Performance testing
├── database/                       # Database related files
│   └── migrations/                 # Database migration scripts
├── docker/                         # Docker configuration
│   └── mysql/
│       └── init/                   # MySQL initialization scripts
├── docs/                           # Documentation
│   ├── architecture.md             # This document
│   ├── prd.md                      # Product Requirements
│   └── API_DOCUMENTATION.md       # API documentation
├── src/                            # Application source code
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Authentication pages
│   │   ├── account/                # User account pages
│   │   ├── ai/                     # AI chat interface
│   │   │   ├── components/         # AI-specific components
│   │   │   ├── api/                # AI client-side API calls
│   │   │   └── types/              # AI-related TypeScript types
│   │   ├── api/                    # API routes
│   │   │   ├── account/            # Account management APIs
│   │   │   ├── ai/                 # AI integration APIs
│   │   │   ├── auth/               # Authentication APIs
│   │   │   ├── library/            # Library/reading APIs
│   │   │   ├── stories/            # Story management APIs
│   │   │   └── user/               # User management APIs
│   │   ├── docs/                   # API documentation page
│   │   ├── library/                # Story library pages
│   │   ├── stories/                # Story management pages
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout component
│   │   └── page.tsx                # Home page
│   ├── components/                 # Reusable React components
│   │   ├── auth/                   # Authentication components
│   │   ├── common/                 # Common UI components
│   │   ├── library/                # Library-specific components
│   │   ├── nav/                    # Navigation components
│   │   ├── stories/                # Story management components
│   │   └── ui/                     # Base UI components (Radix UI)
│   ├── lib/                        # Utility libraries and configurations
│   │   ├── auth.ts                 # NextAuth.js configuration
│   │   ├── db.ts                   # Database connection
│   │   ├── gemini.ts               # Gemini AI integration
│   │   ├── gemini-chat.ts          # AI chat functionality
│   │   ├── gemini-chat-config.ts   # AI chat configuration
│   │   ├── swagger.ts              # API documentation setup
│   │   ├── together.ts             # Together AI integration
│   │   └── utils.ts                # General utilities
│   ├── providers/                  # React context providers
│   │   ├── auth-provider.tsx       # Authentication context
│   │   └── loading-provider.tsx    # Loading state context
│   ├── services/                   # Business logic services
│   │   └── auth.service.ts         # Authentication service
│   └── types/                      # TypeScript type definitions
│       └── next-auth.d.ts          # NextAuth type extensions
├── .env.example                    # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── docker-compose.yml              # Docker Compose configuration
├── Dockerfile                      # Docker image definition
├── next.config.ts                  # Next.js configuration
├── package.json                    # Node.js dependencies and scripts
├── README.md                       # Project documentation
├── tailwind.config.ts              # TailwindCSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## Key Organizational Principles

1. **Next.js App Router Structure**: Follows Next.js 13+ conventions với app directory
2. **Feature-Based Organization**: Components và pages organized by feature (stories, ai, library)
3. **Separation of Concerns**: Clear separation between UI components, business logic, và data access
4. **Shared Utilities**: Common functionality trong `src/lib` và `src/components/ui`
5. **Type Safety**: Comprehensive TypeScript types trong `src/types`
6. **Configuration Centralization**: All config files ở root level cho easy access
7. **Docker Support**: Complete containerization với docker-compose setup
8. **MCP Integration**: Separate MCP server cho AI assistant integration với proper tooling
