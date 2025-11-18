# MedStudy-Spaced-Repetition

MedStudy Spaced Repetition System (SRS) for Medical School Entrance Exam Prep.

This project is a full-stack TypeScript monorepo using **Turborepo**, **Next.js** (Frontend), **NestJS** (Backend), and **Prisma** with **PostgreSQL** (Database).

## Features

- **Full-stack TypeScript:** Maximizing TypeScript usage for Findy score improvement.
- **Spaced Repetition System (SRS):** Algorithm implementation for efficient learning.
- **Markdown & KaTeX Support:** Rich text editing for complex formulas and diagrams in study cards.
- **Modern Stack:** Next.js (App Router), NestJS, Prisma, Auth.js, Tailwind CSS.

## Project Structure

This monorepo is managed by [Turborepo](https://turborepo.com/).

### Apps and Packages

- `apps/web`: Next.js application (Frontend)
- `apps/api`: NestJS application (Backend)
- `packages/db`: Prisma schema and database client
- `packages/eslint-config`: Shared ESLint configurations
- `packages/typescript-config`: Shared `tsconfig.json` files
- `packages/ui`: Shared UI components (React)

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker (for PostgreSQL)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Omochikun55/MedStudy-Spaced-Repetition.git
   cd MedStudy-Spaced-Repetition
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Database Setup (using Docker):**
   *(To be added in the next phase)*

4. **Run Development Servers:**
   ```bash
   pnpm dev
   ```

## Development Commands

- `pnpm build`: Build all apps and packages
- `pnpm dev`: Develop all apps and packages
- `pnpm lint`: Lint all apps and packages
- `pnpm test`: Run tests for all apps and packages
