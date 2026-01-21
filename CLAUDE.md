# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Termix is a full-stack server management platform providing SSH terminal access, tunneling, file editing, and server monitoring through a web-based interface. The architecture uses a multi-port WebSocket system for real-time features.

**Tech Stack:** React 19, TypeScript, Vite, Node.js/Express, SQLite (Drizzle ORM), SSH2, xterm.js, Radix UI (shadcn), Tailwind CSS 4

## Installation & Getting Started

### Prerequisites

- **Node.js:** v18 or higher (LTS recommended)
- **npm:** v9 or higher (comes with Node.js)
- **PowerShell 7** (pwsh) - Required for development workflow on Windows

### Install Dependencies

```bash
npm install
```

This installs all frontend and backend dependencies including TypeScript, Vite, React, and SSH-related packages.

### Database Setup

The project uses SQLite with Drizzle ORM. The database file is created automatically on first run at `data/termix.db`.

### Google Cloud Secret Manager Setup (JWT Authentication)

This application uses Google Cloud Secret Manager to securely store and retrieve the JWT signing key. This prevents hardcoded secrets in the codebase.

#### Prerequisites

1. **Google Cloud Account** - Create one at https://console.cloud.google.com
2. **Google Cloud Project** - A GCP project (create at https://console.cloud.google.com/projectcreate)
3. **Billing Account** - Secret Manager API requires billing enabled (free tier available)
4. **gcloud CLI** - Google Cloud Command Line Interface

#### Install gcloud CLI

**Windows:**
```powershell
winget install Google.CloudSDK
```

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
```

#### Setup Steps

**1. Create/Select a Google Cloud Project**
- Go to https://console.cloud.google.com/projectcreate
- Note your **Project ID** (e.g., `termix-auth`)

**2. Enable Billing**
- Go to https://console.cloud.google.com/billing/projects
- Select your project and link a billing account

**3. Enable Secret Manager API**
- Go to https://console.cloud.google.com/apis/library/secretmanager.googleapis.com
- Select your project and click **"Enable"**

**4. Authenticate with Google Cloud**

**Important:** Stop your backend if running on port 8085 before running this!

```powershell
# Authenticate (opens browser)
gcloud auth login

# Set up application default credentials
gcloud auth application-default login

# Set your quota project
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

**5. Create the JWT_SECRET**

**PowerShell:**
```powershell
# Generate secure random secret and create it
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
$secret | Out-File -Encoding UTF8 temp_jwt.txt
gcloud secrets create JWT_SECRET --data-file=temp_jwt.txt --project=YOUR_PROJECT_ID
rm temp_jwt.txt
```

**Bash:**
```bash
echo -n "$(openssl rand -base64 64)" | gcloud secrets create JWT_SECRET --data-file=- --project=YOUR_PROJECT_ID
```

**Or via Console:**
- Go to https://console.cloud.google.com/security/secrets
- Click **"Create Secret"**
- Name: `JWT_SECRET`
- Secret value: Generate a random 64+ character string
- Click **Create**

**6. Configure Environment**

Add to `.env`:
```
GOOGLE_CLOUD_PROJECT_ID=YOUR_PROJECT_ID
```

**7. Verify Setup**
```powershell
# List secrets
gcloud secrets list --project=YOUR_PROJECT_ID

# Test accessing the secret
gcloud secrets versions access latest --secret="JWT_SECRET" --project=YOUR_PROJECT_ID
```

#### Troubleshooting

- **"Secret Manager API has not been used"** - Enable the API (step 3)
- **"Secret not found"** - Create the JWT_SECRET (step 5)
- **"Permission denied"** - Run `gcloud auth application-default login`
- **"Unable to detect Project Id"** - Set `GOOGLE_CLOUD_PROJECT_ID` in `.env`
- **Port 8085 conflict** - Stop backend before running `gcloud auth application-default login`

### Running the Application

**Development Mode (requires two terminals):**

Terminal 1 - Frontend:
```bash
npm run dev
```
Starts the Vite dev server (typically at http://localhost:5173)

Terminal 2 - Backend:
```bash
npm run dev:backend
```
Compiles TypeScript and starts all backend services on ports 8081-8085

**Production Mode:**

First build both frontend and backend:
```bash
npm run build
npm run build:backend
```

Then start the backend server:
```bash
node dist/backend/starter.js
```

The production build outputs static assets to `dist/` which can be served by any web server.

### First Run

1. Start both frontend and backend as shown above
2. Open http://localhost:5173 in your browser
3. Create your first user account (the initial user becomes an admin)
4. Add SSH hosts via the UI to begin managing servers

### Troubleshooting

- **Port conflicts:** If ports 5173 or 8081-8085 are in use, modify them in `vite.config.ts` (frontend) and `src/backend/starter.ts` (backend)
- **Module not found:** Run `npm install` again to ensure all dependencies are installed
- **TypeScript errors:** Run `npm run clean` to format code, then check `npm run lint`

**Start Development:**
```bash
npm run dev          # Frontend Vite dev server (typically port 5173)
npm run dev:backend  # Compile and start backend (ports 8081-8085)
```

**Build:**
```bash
npm run build         # Build frontend with Vite
npm run build:backend # Compile backend TypeScript to dist/backend/
```

**Code Quality:**
```bash
npm run clean  # Format code with Prettier (run after code changes)
npm run lint   # Run ESLint
```

**Electron Desktop:**
```bash
npm run electron              # Run Electron app
npm run electron:dev          # Run Electron with Vite dev server
npm run build:win-installer   # Build Windows installer
npm run build:linux-portable  # Build Linux portable
```

## Architecture Overview

### Multi-Port WebSocket System

The backend uses separate WebSocket servers on different ports for each feature:

| Port | Service      | Purpose                         |
|------|--------------|---------------------------------|
| 8081 | Database API | REST CRUD, auth, SSH hosts      |
| 8082 | Terminal     | SSH terminal WebSocket          |
| 8083 | Tunnel       | SSH tunneling WebSocket         |
| 8084 | File Manager | File operations WebSocket       |
| 8085 | Stats        | Server monitoring WebSocket     |

**Entry Point:** `src/backend/starter.ts` - initializes all services

### Frontend Architecture

**Entry Point:** `src/main.tsx`

- **DesktopApp.tsx** - Renders for screens >= 768px
- **MobileApp.tsx** - Renders for screens < 768px (mobile-optimized UI)

**Tab System:** Custom tab context in `src/ui/Desktop/Navigation/` with unique ID generation. Supports split-screen view (up to 4 panels).

### API Layer Pattern

**All API calls must be added to `src/ui/main-axios.ts`** - not individual components. This file contains:
- Centralized axios instances with request/response interceptors
- Service-specific logging (sshLogger, tunnelLogger, fileLogger, etc.)
- Error handling with ApiError class
- JWT authentication via Bearer tokens

API instances are exported for use in components:
- `sshHostApi` - SSH host CRUD (port 8081)
- `tunnelApi` - Tunnel management (port 8083)
- `fileManagerApi` - File operations (port 8084)
- `statsApi` - Server metrics (port 8085)
- `authApi` - Authentication, users, credentials (port 8081)

### Database Schema

**Location:** `src/backend/database/db/schema.ts`

Tables: `users`, `sshData`, `sshCredentials`, `fileManagerRecent`, `fileManagerPinned`, `fileManagerShortcuts`, `dismissedAlerts`, `settings`

ORM: Drizzle ORM with better-sqlite3

### SSH Credential System

Three-tier authentication resolution:
1. Direct password/key embedded in host config
2. Stored credential references via `credentialId`
3. Credential references with usage tracking

**Backend routes:** `src/backend/database/routes/` - add Express routes here

### WebSocket Service Pattern

Each SSH feature has its own WebSocket service in `src/backend/ssh/`:
- `terminal.ts` - xterm.js PTY sessions
- `tunnel.ts` - SSH forwarding with auto-reconnect
- `file-manager.ts` - SFTP file operations
- `server-stats.ts` - System metrics polling

Services manage SSH connections, session cleanup, timeouts, and credential resolution.

### UI Components

**Location:** `src/components/ui/` - 35+ shadcn/ui components

**Feature Apps:** `src/ui/Desktop/Apps/` - Terminal, Tunnel, File Manager, Stats, etc.

**Theme:** next-themes with CSS variables for colors. See CONTRIBUTING.md for the full color scheme definitions.

## Key Patterns

### Adding New Features

1. **Frontend:** Add UI components to `src/ui/Desktop/Apps/` or use existing shadcn components from `src/components/ui/`
2. **API Routes:** Add to `src/ui/main-axios.ts` - follow the pattern with service-specific logging
3. **Backend Routes:** Add Express routes in `src/backend/database/routes/`
4. **WebSocket Services:** Create new service in `src/backend/ssh/` following existing patterns
5. **Database Changes:** Update schema in `src/backend/database/db/schema.ts`
6. **Types:** Add shared types to `src/types/index.ts`
7. **Translations:** Add keys to both `src/locales/en/translation.json` and `src/locales/zh/translation.json`

### Logging Architecture

Service-specific loggers in `src/lib/frontend-logger.js` and `src/backend/utils/logger.ts`:
- `apiLogger`, `authLogger`, `sshLogger`, `tunnelLogger`, `fileLogger`, `statsLogger`, `systemLogger`

Logs include structured context: `requestId`, `method`, `url`, `operation`, etc.

### State Management

- React Context for global state (TabContext, ThemeProvider, AuthContext)
- Local component state for UI-specific data
- Database as single source of truth for persistent data

### Path Aliases

Use `@/` prefix for imports from src directory (configured in vite.config.ts)

### Electron Integration

**Main Process:** `electron/main.cjs`
**Preload:** `electron/preload.js`

Electron apps use `localStorage` instead of cookies for JWT storage. Check `isElectron()` in main-axios.ts for Electron-specific behavior.

## Important Guidelines

- **Follow existing code style:** Tailwind CSS with shadcn components
- **Use the defined color scheme** from CONTRIBUTING.md with CSS variables
- **Place all API routes in `main-axios.ts`** - updating openapi.json is unneeded
- **Format code after changes:** Run `npm run clean` (Prettier)
- **Mobile breakpoint:** 768px - components above/below this are in Desktop/Mobile folders respectively
