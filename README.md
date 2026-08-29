# 🏢 Dayflow HRMS — Enterprise Template & DevOps Pipeline

[![CI Quality Gate](https://github.com/yadavaman13/HRMS/actions/workflows/ci.yml/badge.svg)](https://github.com/yadavaman13/HRMS/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Deployment: Render](https://img.shields.io/badge/Deploy-Render-46E3B7.svg)](https://render.com)

A production-grade, hackathon-speed full-stack Human Resource Management System (HRMS) template built with React, Node.js/Express, PostgreSQL, Drizzle ORM, and automated CI/CD DevOps workflows.

---

## 🏆 CI/CD Target Architecture

```text
                               GitHub Repository
                                       │
                     ┌─────────────────┼─────────────────┐
                     │                 │                 │
                     ↓                 ↓                 ↓
               feature/*          develop             main
                     │                 │                 │
                Development       Integration       Production
                     │                 │                 │
                     ↓                 ↓                 ↓
               Pre-commit            CI              CI + CD
                     │                 │                 │
              Prettier + ESLint      ├─ Format        │
                                     ├─ Lint          │
                                     ├─ Test          │
                                     └─ Build         │
                                                       ↓
                                                    Render
                                                       ↓
                                                🚀 Live System
```

### Branch Responsibilities & Quality Gates

| Branch      | Responsibility                        | Target Environment | Deployment Trigger                   |
| :---------- | :------------------------------------ | :----------------- | :----------------------------------- |
| `feature/*` | Individual developer features / fixes | Local Development  | Husky + lint-staged (Pre-commit)     |
| `develop`   | Integrated sprint / milestone code    | Staging / QA       | GitHub Actions CI (`Quality Gate`)   |
| `main`      | Stable, production-ready release      | Render Production  | Render CD (Gated by CI `checksPass`) |

---

## ⚡ Developer Scripts (Single Root Interface)

Run standard workflow commands directly from the root workspace without switching directories:

```bash
# 1. Format code across workspace
npm run format

# 2. Verify formatting (CI check)
npm run format:check

# 3. Lint client & server code
npm run lint

# 4. Automatically fix linting issues
npm run lint:fix

# 5. Run lightning-fast zero-dependency unit & utility tests
npm run test

# 6. Build client production bundle (Vite)
npm run build
```

---

## 🛡️ The Pre-Commit Quality Gate

Every local commit automatically triggers Husky and `lint-staged`:

```text
git commit
   │
   ├─► Staged JS/JSX ──► ESLint --fix ──► Prettier --write
   ├─► Staged SCSS   ──► Stylelint --fix ──► Prettier --write
   └─► Staged JSON/MD ─► Prettier --write
   │
   ▼
Clean Commit Passed ✅
```

---

## 🚀 GitHub Actions CI Pipeline (`ci.yml`)

On every Pull Request and Push to `develop` or `main`:

```text
               Pull Request / Push
                        │
                        ▼
             1. Setup Node.js 22 & Cache
                        │
                        ▼
             2. Install Dependencies (npm ci)
                        │
                        ▼
             3. Prettier Format Check (`npm run format:check`)
                        │
                        ▼
             4. Code Quality & Linting (`npm run lint`)
                        │
                        ▼
             5. Automated Unit Tests (`npm run test`)
                        │
                        ▼
             6. Production Bundle Build (`npm run build`)
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
          PASS ✅               FAIL ❌
             │                     │
      Allowed to Merge        Blocked from Merge
```

---

## 🌐 Render Infrastructure as Code (`render.yaml`)

Production deployment is fully declarative:

- **Backend API**: Node web service with health check path `/api/health` and graceful `SIGTERM`/`SIGINT` shutdown.
- **Frontend SPA**: Vite static site with client-side SPA route rewrites.
- **Trigger**: `autoDeployTrigger: checksPass` ensures code is deployed **only after GitHub Actions CI passes**.

---

## 📚 Architectural & Database Documentation

- **[ARCHITECTURE_AND_FLOWS.md](file:///c:/Users/Aman/Desktop/HRMS/ARCHITECTURE_AND_FLOWS.md)**:
  - 🗺️ Complete **Mermaid ER Diagram** (covering all 9 modules and 24 tables)
  - 🏛️ **System Architecture Diagram** (Presentation, API Gateway, Core Engines, Data Layer)
  - 🔄 **Core Business Flowcharts**:
    1. Employee Onboarding & Lifecycle Flow
    2. Attendance Tracking & Regularization Flow
    3. Leave Management & Double-Entry Balance Ledger Flow
    4. Monthly Payroll Processing & Calculation Lifecycle Flow
- **[database_schema.sql](file:///c:/Users/Aman/Desktop/HRMS/database_schema.sql)**:
  - Full PostgreSQL DDL schema with constraints, triggers, enums, indexes, and `pgcrypto` encryption.
- **[.github/pull_request_template.md](file:///c:/Users/Aman/Desktop/HRMS/.github/pull_request_template.md)**:
  - Standardized pull request template with testing and quality checklist.
- **[render.yaml](file:///c:/Users/Aman/Desktop/HRMS/render.yaml)**:
  - Render Blueprint specification for zero-config production deployment.

---

## 🎤 Hackathon Pitch & Presentation Positioning

> _"We built our solution on a reusable engineering template with automated code formatting, linting, testing, and production build validation on every PR. Only CI-verified code reaches our production branch, and production deployment is automatically triggered on Render after all quality checks pass. This allowed our team to spend 100% of our hackathon time on core business logic and differentiating features."_
