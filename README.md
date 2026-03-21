# DevFlow

DevFlow is a full-stack Q&A platform built with Next.js App Router, MongoDB, and NextAuth.
It includes authentication, question/answer flows, voting, tags, collections, search, and AI-assisted answer generation.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- MongoDB + Mongoose
- NextAuth v5 (credentials + OAuth)
- Tailwind CSS 4
- Biome (lint/format)
- Jest + Testing Library

## Prerequisites

- Node.js 20+
- pnpm 10+
- MongoDB instance (local or hosted)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env.local` file in the project root.

3. Add required environment variables:

```bash
MONGODB_URI=
AUTH_SECRET=

# OAuth (if using Google/GitHub sign-in)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Optional
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
LOG_LEVEL=info
X_RapidAPI_Key=
```

4. Start the development server:

```bash
pnpm dev
```

5. Open http://localhost:3000

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:unit
pnpm test:integration
```

## Project Structure

```text
src/
	app/          # App Router pages, layouts, API routes
	features/     # Domain features (auth, questions, answers, tags, votes, etc.)
	database/     # Mongoose models and DB entrypoints
	shared/       # Reusable UI, utilities, constants, types
tests/          # Unit, integration, and e2e tests
```

## Build for Production

```bash
pnpm build
pnpm start
```

## Notes

- If you see inconsistent Next.js worker/runtime errors locally, clear caches and reinstall:

```bash
rm -rf node_modules .next
pnpm store prune
pnpm install
```
