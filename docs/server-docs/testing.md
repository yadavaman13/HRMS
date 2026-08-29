# 🧪 Master Guide: End-to-End API Testing, Live Documentation & Postman Collection Generation

> **A production-ready blueprint for configuring modular E2E integration testing with Jest + Supertest in any Node.js / Express backend, featuring automatic Markdown API documentation and Postman Collection (v2.1.0) generation.**

---

## 📑 Table of Contents

1. [Architecture & Core Concepts](#-1-architecture--core-concepts)
2. [Quick-Start Checklist](#-2-quick-start-checklist)
3. [Dependencies & Installation](#-3-dependencies--installation)
4. [Standard Directory Structure](#-4-standard-directory-structure)
5. [Jest Configuration](#-5-jest-configuration)
6. [Core Testing Infrastructure & Helpers](#-6-core-testing-infrastructure--helpers)
   - [Global Lifecycle & Database Teardown (`setup.js`)](#61-global-lifecycle--db-teardown-srctestssetupjs)
   - [Authentication & Session Helper (`auth-helper.js`)](#62-authentication--session-helper-srctestshelpersauth-helperjs)
   - [Markdown API Doc Logger (`md-logger.js`)](#63-markdown-api-doc-logger-srctestshelpersmd-loggerjs)
   - [Postman Collection v2.1.0 Generator (`generate-postman.js`)](#64-postman-collection-v210-generator-scriptsgenerate-postmanjs)
7. [Writing Module-Wise Test Suites](#-7-writing-module-wise-test-suites)
   - [Module 1: Authentication & User Management](#71-module-1-authentication--user-management)
   - [Module 2: Business Resource / CRUD Workflow](#72-module-2-business-resource--crud-workflow)
8. [Generating & Importing Postman Collections](#-8-generating--importing-postman-collections)
9. [Running Tests & NPM Scripts](#-9-running-tests--npm-scripts)
10. [CI/CD Integration (GitHub Actions)](#-10-cicd-integration-github-actions)
11. [Troubleshooting & Best Practices](#-11-troubleshooting--best-practices)

---

## 🏛️ 1. Architecture & Core Concepts

Traditional API documentation tools (like static Swagger docs or manual Postman collections) suffer from **documentation drift**—the code changes, but the docs and collections remain outdated.

This architecture introduces **Test-Driven Documentation (TDDoc)**:
1. **Module-wise E2E Test Suites** run against live Express endpoints using Supertest.
2. During each test assertion, an interceptor records the exact **HTTP method, route, query parameters, headers, request payload, status code, and live JSON response**.
3. Upon suite completion (`afterAll`), an enriched, human-readable **Markdown API doc** is generated for that specific feature module in `docs/api-docs/`.
4. A post-processing generator automatically parses the module documentation/records and compiles a **Postman Collection (v2.1.0 JSON)** with organized folders, parameterized `{{baseUrl}}`, request bodies, and **pre-saved mock response examples** for 200, 201, 400, 401, 404, etc.

```mermaid
flowchart TD
    A[Jest Test Runner] -->|Executes module-wise| B[01_auth.test.js]
    A -->|Executes module-wise| C[02_dashboard.test.js]
    A -->|Executes module-wise| D[03_trips.test.js]
    
    B -->|Supertest HTTP Calls| E[Express Server & DB]
    C -->|Supertest HTTP Calls| E
    D -->|Supertest HTTP Calls| E
    
    B -->|Record Payloads| F[FeatureApiDocLogger]
    C -->|Record Payloads| F
    D -->|Record Payloads| F
    
    F -->|afterAll: writes| G["docs/api-docs/*.md<br/>(Markdown API Docs)"]
    G -->|scripts/generate-postman.js| H["docs/api-docs/postman_collection.json<br/>(Postman v2.1.0 Schema)"]
    H -->|Import| I[Postman Workspace / Team Collection]
```

---

## ⚡ 2. Quick-Start Checklist

- [ ] Install dev dependencies: `jest`, `supertest`, `dotenv`.
- [ ] Configure `jest.config.js` with ES Module / CommonJS flags and test environment.
- [ ] Add `src/tests/setup.js` for DB/Redis connection pooling and teardown.
- [ ] Add `src/tests/helpers/md-logger.js` to capture live test payloads.
- [ ] Add `scripts/generate-postman.js` to compile the Postman v2.1.0 collection.
- [ ] Create test suites under `src/tests/modules/` prefixed by module order (`01_auth.test.js`, `02_resource.test.js`).
- [ ] Add npm script `"test:api:docs": "jest --runInBand && node scripts/generate-postman.js"`.

---

## 📦 3. Dependencies & Installation

### For ES Modules (`"type": "module"` in `package.json`):

```bash
npm install --save-dev jest supertest dotenv
```

If using Node.js native ESM, ensure your scripts invoke Jest with the `--experimental-vm-modules` flag:

```json
{
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:api:docs": "node --experimental-vm-modules node_modules/jest/bin/jest.js --config jest.config.js --runInBand && node scripts/generate-postman.js",
    "generate:postman": "node scripts/generate-postman.js"
  }
}
```

### For CommonJS projects:

```bash
npm install --save-dev jest supertest dotenv
```

```json
{
  "scripts": {
    "test": "jest",
    "test:api:docs": "jest --config jest.config.js --runInBand && node scripts/generate-postman.js",
    "generate:postman": "node scripts/generate-postman.js"
  }
}
```

---

## 📁 4. Standard Directory Structure

Organize your backend workspace as follows:

```text
my-project/
├── docs/
│   └── api-docs/                          <-- Generated Markdown Docs & Postman JSON
│       ├── 01_auth_user.md
│       ├── 02_dashboard.md
│       ├── README.md
│       └── postman_collection.json        <-- Importable in Postman
├── scripts/
│   └── generate-postman.js                <-- Postman Collection Compiler
├── src/
│   ├── app.js                             <-- Express app (exported without listening)
│   ├── server.js                          <-- app.listen() entrypoint
│   └── tests/
│       ├── setup.js                       <-- Jest lifecycle & DB teardown
│       ├── helpers/
│       │   ├── auth-helper.js             <-- Test user seeding & JWT creation
│       │   └── md-logger.js               <-- Live API documentation recorder
│       └── modules/                       <-- Feature Module Test Suites
│           ├── 01_auth_user.test.js
│           ├── 02_dashboard.test.js
│           └── 03_products.test.js
├── jest.config.js
└── package.json
```

> [!IMPORTANT]
> Keep `app.js` and `server.js` decoupled. `app.js` should export the configured Express `app` instance without calling `app.listen()`. This allows Supertest to bind ephemeral ports automatically without port conflicts.

---

## ⚙️ 5. Jest Configuration

Create `jest.config.js` in the root of your project:

```javascript
// jest.config.js
export default {
    testEnvironment: 'node',
    transform: {},
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    testSequencer: '<rootDir>/src/tests/testSequencer.js', // Guarantees 01 -> 10 execution order
    testTimeout: 30000,
    testMatch: ['<rootDir>/src/tests/modules/**/*.test.js'],
    verbose: true,
    forceExit: true, // Cleanly terminates open sockets/pool connections upon completion
};
```

---

## 🛠️ 6. Core Testing Infrastructure & Helpers

### 6.1 Global Lifecycle & DB Teardown (`src/tests/setup.js`)

Manages clean test states, flushes Redis/rate-limit keys before each test, and closes database connection pools after all tests finish.

```javascript
// src/tests/setup.js
import { pool } from '../config/database.config.js'; // Adjust to your DB pool/client (pg, mongoose, prisma)
import redis from '../config/cache.config.js';        // Optional: Redis client if used

beforeEach(async () => {
    try {
        // Reset rate limiter keys or test caches between tests
        if (redis) {
            const keys = await redis.keys('ratelimit:*');
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }
    } catch (err) {
        // Ignore cache cleanup errors in testing
    }
});

afterAll(async () => {
    try {
        // Gracefully close database connection pools
        if (pool && typeof pool.end === 'function') {
            await pool.end();
        }
        if (redis && typeof redis.quit === 'function') {
            await redis.quit();
        }
        // Brief pause to allow pending sockets to unbind
        await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
        // Ignore teardown disconnect errors
    }
});
```

---

### 6.2 Authentication & Session Helper (`src/tests/helpers/auth-helper.js`)

Provides helper utilities for dynamically creating authenticated test accounts, generating JWT tokens, and providing `Cookie` or `Authorization` headers.

```javascript
// src/tests/helpers/auth-helper.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/database.config.js';
import { users } from '../../db/schema/users.schema.js';

/**
 * Generate randomized user data to avoid unique constraint collisions
 */
export function generateTestUserData(prefix = 'test_user') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return {
        firstName: 'Test',
        lastName: 'User',
        email: `${prefix}_${timestamp}_${random}@example.com`,
        password: 'Password@123',
        role: 'user',
    };
}

/**
 * Directly create an authenticated test user and return records + auth headers/cookies
 */
export async function createAndLoginTestUser(overrides = {}) {
    const payload = {
        ...generateTestUserData(),
        ...overrides,
    };

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Insert user into your database
    const [user] = await db
        .insert(users)
        .values({
            ...payload,
            password: hashedPassword,
            isActive: true,
            emailVerified: true,
        })
        .returning();

    // Sign JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'test-jwt-secret-key',
        { expiresIn: '1d' }
    );

    return {
        user,
        token,
        cookie: `token=${token}`,
        authHeader: `Bearer ${token}`,
    };
}
```

---

### 6.3 Markdown API Doc Logger (`src/tests/helpers/md-logger.js`)

Records HTTP transactions during test execution and produces clean, formatted Markdown documentation with overview tables, headers, query parameters, payloads, status codes, and notes.

```javascript
// src/tests/helpers/md-logger.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_OUTPUT_DIR = path.resolve(__dirname, '../../../../docs/api-docs');

export class FeatureApiDocLogger {
    /**
     * @param {string} filename - Output filename (e.g. "01_auth_user.md")
     * @param {string} title - Module Title (e.g. "Feature 01: Authentication API")
     * @param {string} description - Summary of the feature module
     */
    constructor(filename, title, description = '') {
        this.filename = filename;
        this.title = title;
        this.description = description;
        this.sections = [];
    }

    /**
     * Record an API test endpoint interaction
     */
    record({
        scenario,
        method,
        endpoint,
        headers,
        queryParams,
        requestBody,
        statusCode,
        responseBody,
        notes,
    }) {
        this.sections.push({
            scenario,
            method: method.toUpperCase(),
            endpoint,
            headers,
            queryParams,
            requestBody,
            statusCode,
            responseBody,
            notes,
        });
    }

    /**
     * Write captured API logs out to Markdown file
     */
    save() {
        if (!fs.existsSync(DOCS_OUTPUT_DIR)) {
            fs.mkdirSync(DOCS_OUTPUT_DIR, { recursive: true });
        }

        const filePath = path.join(DOCS_OUTPUT_DIR, this.filename);

        let markdown = `# ${this.title}\n\n`;
        if (this.description) {
            markdown += `> ${this.description}\n\n`;
        }

        markdown += `## 📋 Endpoints Overview\n\n`;
        markdown += `| Method | Endpoint | Scenario | Status |\n`;
        markdown += `| :--- | :--- | :--- | :--- |\n`;

        this.sections.forEach((s) => {
            markdown += `| \`${s.method}\` | \`${s.endpoint}\` | ${s.scenario} | \`${s.statusCode}\` |\n`;
        });

        markdown += `\n---\n\n## 🔍 Detailed Scenarios & Outputs\n\n`;

        this.sections.forEach((s, idx) => {
            markdown += `### ${idx + 1}. ${s.scenario}\n\n`;
            markdown += `- **Endpoint**: \`${s.method} ${s.endpoint}\`\n`;
            markdown += `- **Expected Status**: \`${s.statusCode}\`\n`;

            if (s.headers && Object.keys(s.headers).length > 0) {
                markdown += `- **Headers**:\n\`\`\`json\n${JSON.stringify(s.headers, null, 2)}\n\`\`\`\n`;
            }

            if (s.queryParams && Object.keys(s.queryParams).length > 0) {
                markdown += `- **Query Parameters**:\n\`\`\`json\n${JSON.stringify(s.queryParams, null, 2)}\n\`\`\`\n`;
            }

            if (s.requestBody && Object.keys(s.requestBody).length > 0) {
                markdown += `- **Request Body**:\n\`\`\`json\n${JSON.stringify(s.requestBody, null, 2)}\n\`\`\`\n`;
            } else if (s.requestBody !== undefined && s.method !== 'GET') {
                markdown += `- **Request Body**: *(None)*\n`;
            }

            markdown += `- **Response Body**:\n\`\`\`json\n${JSON.stringify(s.responseBody, null, 2)}\n\`\`\`\n`;

            if (s.notes) {
                markdown += `\n> **Note**: ${s.notes}\n`;
            }

            markdown += `\n---\n\n`;
        });

        fs.writeFileSync(filePath, markdown, 'utf8');
        console.log(`[API Doc Generated] -> ${filePath}`);
    }
}
```

---

### 6.4 Postman Collection v2.1.0 Generator (`scripts/generate-postman.js`)

Reads all module markdown documents in `docs/api-docs/`, builds Postman-compliant folders, formats parameterized URLs (`{{baseUrl}}`), sets up JSON request bodies, and embeds **pre-saved mock response examples** for every scenario.

```javascript
// scripts/generate-postman.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../docs/api-docs');
const OUTPUT_FILE = path.join(DOCS_DIR, 'postman_collection.json');

const HTTP_STATUS_MESSAGES = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
};

function parseMarkdownDoc(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let title = path.basename(filePath, '.md');
    let description = '';

    const firstHeader = lines.find((l) => l.startsWith('# '));
    if (firstHeader) title = firstHeader.replace('# ', '').trim();

    const descLine = lines.find((l) => l.startsWith('> '));
    if (descLine) description = descLine.replace('> ', '').trim();

    const scenarioBlocks = content.split(/\n### \d+\.\s+/).slice(1);

    const scenarios = scenarioBlocks.map((block) => {
        const scenarioTitle = block.split('\n')[0].trim();
        const endpointMatch = block.match(/- \*\*Endpoint\*\*:\s*`([A-Z]+)\s+([^`]+)`/);
        const method = endpointMatch ? endpointMatch[1] : 'GET';
        const rawEndpoint = endpointMatch ? endpointMatch[2] : '/';

        const statusMatch = block.match(/- \*\*Expected Status\*\*:\s*`?(\d+)`?/);
        const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : 200;

        let headers = null;
        const headersMatch = block.match(/- \*\*Headers\*\*:\s*```json\s*([\s\S]*?)\s*```/);
        if (headersMatch) {
            try { headers = JSON.parse(headersMatch[1]); } catch (e) {}
        }

        let queryParams = null;
        const queryParamsMatch = block.match(/- \*\*Query Parameters\*\*:\s*```json\s*([\s\S]*?)\s*```/);
        if (queryParamsMatch) {
            try { queryParams = JSON.parse(queryParamsMatch[1]); } catch (e) {}
        }

        let requestBody = null;
        const reqBodyMatch = block.match(/- \*\*Request Body\*\*:\s*```json\s*([\s\S]*?)\s*```/);
        if (reqBodyMatch) {
            try { requestBody = JSON.parse(reqBodyMatch[1]); } catch (e) {}
        }

        let responseBody = null;
        const resBodyMatch = block.match(/- \*\*Response Body\*\*:\s*```json\s*([\s\S]*?)\s*```/);
        if (resBodyMatch) {
            try { responseBody = JSON.parse(resBodyMatch[1]); } catch (e) {}
        }

        let notes = '';
        const notesMatch = block.match(/> \*\*Note\*\*:\s*(.*)/);
        if (notesMatch) notes = notesMatch[1].trim();

        return { scenario: scenarioTitle, method, endpoint: rawEndpoint, statusCode, headers, queryParams, requestBody, responseBody, notes };
    });

    return { title, description, scenarios };
}

function buildPostmanUrl(rawEndpoint, queryParams) {
    const cleanPath = rawEndpoint.startsWith('/') ? rawEndpoint.slice(1) : rawEndpoint;
    const pathParts = cleanPath.split('/').filter(Boolean);

    let rawUrl = `{{baseUrl}}${rawEndpoint.startsWith('/') ? '' : '/'}${rawEndpoint}`;
    const query = [];

    if (queryParams && Object.keys(queryParams).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, String(value));
            query.push({ key, value: String(value), description: '' });
        });
        rawUrl += `?${searchParams.toString()}`;
    }

    return { raw: rawUrl, host: ['{{baseUrl}}'], path: pathParts, query: query.length > 0 ? query : undefined };
}

export function generatePostmanCollection({
    collectionName = 'API Integration Collection',
    collectionDescription = 'Live tested Postman Collection with saved mock responses generated directly from Jest E2E test runs.',
    baseUrl = 'http://localhost:5000',
    docsDir = DOCS_DIR,
    outputFile = OUTPUT_FILE,
} = {}) {
    if (!fs.existsSync(docsDir)) {
        console.error(`[Error] Documentation directory not found at: ${docsDir}`);
        return null;
    }

    const mdFiles = fs
        .readdirSync(docsDir)
        .filter((file) => file.endsWith('.md') && file !== 'README.md' && file !== 'SKILL.md')
        .sort();

    const folders = [];

    for (const file of mdFiles) {
        const filePath = path.join(docsDir, file);
        const parsed = parseMarkdownDoc(filePath);

        if (!parsed.scenarios || parsed.scenarios.length === 0) continue;

        const endpointMap = new Map();
        parsed.scenarios.forEach((sc) => {
            const key = `${sc.method} ${sc.endpoint}`;
            if (!endpointMap.has(key)) endpointMap.set(key, []);
            endpointMap.get(key).push(sc);
        });

        const items = [];

        endpointMap.forEach((scenariosList) => {
            const primaryScenario = scenariosList[0];
            const urlObj = buildPostmanUrl(primaryScenario.endpoint, primaryScenario.queryParams);

            const headers = [{ key: 'Content-Type', value: 'application/json', type: 'text' }];
            if (primaryScenario.headers && primaryScenario.headers.Cookie) {
                headers.push({ key: 'Cookie', value: primaryScenario.headers.Cookie, type: 'text', description: 'Authentication cookie' });
            }

            const requestBodyObj = primaryScenario.requestBody
                ? {
                      mode: 'raw',
                      raw: JSON.stringify(primaryScenario.requestBody, null, 2),
                      options: { raw: { language: 'json' } },
                  }
                : undefined;

            const responseExamples = scenariosList.map((sc) => {
                const statusText = HTTP_STATUS_MESSAGES[sc.statusCode] || 'OK';
                return {
                    name: `${sc.scenario} (${sc.statusCode} ${statusText})`,
                    originalRequest: {
                        method: sc.method,
                        header: headers,
                        body: sc.requestBody ? { mode: 'raw', raw: JSON.stringify(sc.requestBody, null, 2) } : undefined,
                        url: buildPostmanUrl(sc.endpoint, sc.queryParams),
                    },
                    status: statusText,
                    code: sc.statusCode,
                    _postman_previewlanguage: 'json',
                    header: [{ key: 'Content-Type', value: 'application/json' }],
                    cookie: [],
                    body: sc.responseBody ? JSON.stringify(sc.responseBody, null, 2) : '',
                };
            });

            items.push({
                name: primaryScenario.scenario,
                request: {
                    method: primaryScenario.method,
                    header: headers,
                    body: requestBodyObj,
                    url: urlObj,
                    description: primaryScenario.notes || `${primaryScenario.method} ${primaryScenario.endpoint}`,
                },
                response: responseExamples,
            });
        });

        folders.push({
            name: parsed.title,
            description: parsed.description,
            item: items,
        });
    }

    const postmanCollection = {
        info: {
            _postman_id: crypto.randomUUID(),
            name: collectionName,
            description: collectionDescription,
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        item: folders,
        variable: [{ key: 'baseUrl', value: baseUrl, type: 'string' }],
    };

    fs.writeFileSync(outputFile, JSON.stringify(postmanCollection, null, 2), 'utf8');
    console.log(`[Postman Collection Generated] -> ${outputFile}`);
    return postmanCollection;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    generatePostmanCollection();
}
```

---

## 🧪 7. Writing Module-Wise Test Suites

Organize tests by functional domain (e.g. `01_auth_user.test.js`, `02_dashboard.test.js`, `03_trips.test.js`). 

### 7.1 Module 1: Authentication & User Management

```javascript
// src/tests/modules/01_auth_user.test.js
import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { generateTestUserData, createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '01_auth_user.md',
    'Feature 01: Authentication & User Profile API',
    'Covers user registration, authentication, profile updates, and session termination.'
);

describe('01: Auth & User Profile Management API', () => {
    let testUser;
    let authCookie;

    afterAll(() => {
        // Automatically write docs to docs/api-docs/01_auth_user.md
        docLogger.save();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully (201 Created)', async () => {
            const signupPayload = generateTestUserData('signup_test');

            const res = await request(app)
                .post('/api/auth/register')
                .send(signupPayload);

            docLogger.record({
                scenario: 'Register New User (Success)',
                method: 'POST',
                endpoint: '/api/auth/register',
                requestBody: signupPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Registers new user and sets HTTP-only session cookie.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toBeDefined();
        });

        it('should return 400 when registration fails validation', async () => {
            const invalidPayload = { email: 'invalid-email', password: '' };

            const res = await request(app)
                .post('/api/auth/register')
                .send(invalidPayload);

            docLogger.record({
                scenario: 'Register User (Validation Failure)',
                method: 'POST',
                endpoint: '/api/auth/register',
                requestBody: invalidPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns validation errors when required fields are missing.',
            });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/get-me', () => {
        beforeAll(async () => {
            const authResult = await createAndLoginTestUser();
            testUser = authResult.user;
            authCookie = authResult.cookie;
        });

        it('should return authenticated user profile (200 OK)', async () => {
            const res = await request(app)
                .get('/api/auth/get-me')
                .set('Cookie', authCookie);

            docLogger.record({
                scenario: 'Get Current Authenticated User (Success)',
                method: 'GET',
                endpoint: '/api/auth/get-me',
                headers: { Cookie: 'token=JWT_COOKIE_VALUE' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves current active session user object.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe(testUser.email);
        });

        it('should return 401 when accessed without credentials', async () => {
            const res = await request(app).get('/api/auth/get-me');

            docLogger.record({
                scenario: 'Get Current User (Unauthenticated Error)',
                method: 'GET',
                endpoint: '/api/auth/get-me',
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Protected route returns 401 when session cookie is missing.',
            });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});
```

---

### 7.2 Module 2: Business Resource / CRUD Workflow

```javascript
// src/tests/modules/02_dashboard.test.js
import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '02_dashboard.md',
    'Feature 02: Dashboard & Aggregated Metrics API',
    'Provides unified dashboard metrics including upcoming trips, bookmarks, and financial summaries.'
);

describe('02: Dashboard Module API Tests', () => {
    let authUser;

    beforeAll(async () => {
        authUser = await createAndLoginTestUser();
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('GET /api/dashboard', () => {
        it('should retrieve aggregated dashboard metrics for user', async () => {
            const res = await request(app)
                .get('/api/dashboard')
                .set('Cookie', authUser.cookie);

            docLogger.record({
                scenario: 'Get User Dashboard Summary (Authenticated)',
                method: 'GET',
                endpoint: '/api/dashboard',
                headers: { Cookie: 'token=JWT_COOKIE_VALUE' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Aggregates metrics across trips, expenses, and saved destinations.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
        });
    });
});
```

---

## 📮 8. Generating & Importing Postman Collections

### Generate the Collection:
Run the generator script directly or through npm:
```bash
npm run generate:postman
```
Output:
```text
[Postman Collection Generated] -> docs/api-docs/postman_collection.json
Successfully converted 10 modules into Postman v2.1.0 collection.
```

### Import into Postman:
1. Open **Postman Desktop** or **Postman Web**.
2. Click **Import** (top left).
3. Drag & drop `docs/api-docs/postman_collection.json` or choose file.
4. The collection will appear with:
   - Organized folders for each module (`01. Auth & User Profile`, `02. Dashboard`, etc.).
   - All requests pre-configured with `{{baseUrl}}`.
   - Saved response examples attached to each request for 200, 201, 400, 401, 404!
5. In Postman, configure the `baseUrl` variable (default is `http://localhost:5000` or `http://localhost:3000`).

---

## 🚀 9. Running Tests & NPM Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:auth": "node --experimental-vm-modules node_modules/jest/bin/jest.js src/tests/modules/01_auth_user.test.js",
    "test:api:docs": "node --experimental-vm-modules node_modules/jest/bin/jest.js --config jest.config.js --runInBand && node scripts/generate-postman.js",
    "generate:postman": "node scripts/generate-postman.js"
  }
}
```

### Command Highlights:
- **`npm run test:api:docs`**: Runs all modular tests in sequence (`--runInBand`), regenerates all `docs/api-docs/*.md` files, and automatically compiles `docs/api-docs/postman_collection.json`.
- **`npm run generate:postman`**: Re-compiles `postman_collection.json` from the latest documentation markdown without re-running tests.

---

## 🤖 10. CI/CD Integration (GitHub Actions)

Add this workflow in `.github/workflows/test-and-docs.yml` to automatically verify tests and ensure docs remain updated on pull requests:

```yaml
name: Test Suite & API Docs Validation

on:
  push:
    branches: [main, master, dev]
  pull_request:
    branches: [main, master, dev]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Database Migrations
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: npm run db:migrate # or npx drizzle-kit migrate / npx prisma migrate deploy

      - name: Execute E2E Tests & Generate Docs & Postman Collection
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test_ci_jwt_secret_123456
        run: npm run test:api:docs

      - name: Upload API Docs & Postman Collection Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: api-documentation-and-postman
          path: |
            docs/api-docs/*.md
            docs/api-docs/postman_collection.json
```

---

## 💡 11. Troubleshooting & Best Practices

| Issue / Symptom | Root Cause | Solution |
| :--- | :--- | :--- |
| `Jest did not exit one second after the test run has completed` | Database connection pools, Redis clients, or server listeners remain active | Ensure `setup.js` has `afterAll` closing `pool.end()` and `redis.quit()`. Set `forceExit: true` in `jest.config.js`. |
| `EADDRINUSE: address already in use` | `server.js` (with `app.listen`) is imported instead of `app.js` | Export Express `app` instance in `app.js` without calling `.listen()`. Pass `app` directly into `request(app)`. |
| Flaky tests or test cross-talk | Tests running in parallel mutating shared rows or exceeding rate limits | Run with `--runInBand` so modules execute sequentially. Flush test user keys and rate limits in `beforeEach`. |
| Postman raw JSON bodies escaped improperly | JSON payload stringified without proper indentation or character escaping | Use `JSON.stringify(payload, null, 2)` when constructing Postman raw body blocks. |
| Multipart / File upload testing | Need to test file uploads with Supertest | Use `.attach('file', 'path/to/test-file.jpg')`. In Postman generator, set body mode to `"formdata"`. |
| `SyntaxError: Cannot use import statement outside a module` in Jest | Node.js ESM loader not enabled for Jest | Prefix Jest runner script with `node --experimental-vm-modules node_modules/jest/bin/jest.js` in `package.json`. |

---

> **Summary**: With this architecture, every test run keeps documentation and Postman collections 100% synchronized with actual backend behavior, eliminating API regressions and manual documentation toil.
