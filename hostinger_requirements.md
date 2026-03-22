# Project Hosting Requirements for Goodwill Global Exports

This document details the technical requirements to host this application. You can share this with Hostinger support or use it to select the correct hosting plan.

## Technical Stack
- **Application Type**: Full-Stack Node.js Application (Monorepo-style with client/server in one).
- **Runtime**: Node.js (Version 18+ recommended, 20+ preferred).
- **Frontend**: React + TypeScript (Builds to static files via Vite).
- **Backend**: Express.js (Node.js server).
- **Database**: PostgreSQL (Required).
- **ORM**: Drizzle ORM.

## Hosting Requirements

### 1. Node.js Support (Critical)
The hosting environment **MUST** support long-running Node.js processes.
- **Shared Hosting**: Most basic shared hosting plans (configured for PHP/WordPress) **CANNOT** run this application properly.
- **VPS (Virtual Private Server)**: **Highly Recommended**. A Hostinger VPS (KVM) gives you full control to install Node.js types and PostgreSQL.
- **Cloud Hosting**: Some Hostinger Cloud plans support Node.js, but check for specific version support and persistent process management (like PM2).

### 2. PostgreSQL Database
The application requires a PostgreSQL database.
- If using a VPS, you can install PostgreSQL directly on the server.
- If using Shared/Cloud hosting, check if they provide PostgreSQL databases (many only provide MySQL).

### 3. Build & Run Commands
The server needs to run build scripts during deployment.
- **Install**: `npm install`
- **Build**: `npm run build` (Compiles Frontend to `dist/public`)
- **Start**: `npm start` (Runs `node dist/index.js`)

### 4. Environment Variables
The host must allow setting custom Environment Variables (e.g., in a dashboard or `.env` file):
- `DATABASE_URL` (PostgreSQL connection string)
- `RESEND_API_KEY` (For emails)
- `PORT` (Default 5000)
- `NODE_ENV` (Set to "production")

## Recommendation for Hostinger
**Recommendation: Hostinger VPS (KVM 1 or higher)**
This plan allows you to:
1. Install Node.js & npm.
2. Install PostgreSQL.
3. Use PM2 to keep the server running 24/7.
4. Configure Nginx as a reverse proxy (standard practice for Node apps).

*Standard "Web Hosting" or "Shared Hosting" plans are likely insufficient due to the Node.js + PostgreSQL backend requirement.*
