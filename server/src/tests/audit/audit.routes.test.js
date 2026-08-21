import 'dotenv/config';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../../app.js';
import redis from '../../config/cache.config.js';
import { pool } from '../../config/database.config.js';
import { getTestAuthTokens } from '../testHelper.js';

describe('Audit Trail Routes Integration Tests', () => {
    let server;
    let baseUrl;
    let tokens;

    before(async () => {
        tokens = await getTestAuthTokens();
        await new Promise((resolve) => {
            server = app.listen(0, '127.0.0.1', () => {
                const address = server.address();
                baseUrl = `http://127.0.0.1:${address.port}`;
                resolve();
            });
        });
    });

    after(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        try {
            await redis.quit();
        } catch {
            // Ignore
        }
        try {
            await pool.end();
        } catch {
            // Ignore
        }
    });

    test('GET /api/audit-logs returns 401 when unauthenticated', async () => {
        const res = await fetch(`${baseUrl}/api/audit-logs`);
        assert.equal(res.status, 401);
    });

    test('GET /api/audit-logs returns 200 and paginated logs for Admin', async () => {
        if (!tokens.adminToken) return;

        const res = await fetch(`${baseUrl}/api/audit-logs?limit=10`, {
            headers: {
                Authorization: `Bearer ${tokens.adminToken}`,
            },
        });

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(Array.isArray(body.data.logs));
        assert.ok(typeof body.data.total === 'number');
    });

    test('GET /api/audit-logs/stats returns summary metrics for Admin', async () => {
        if (!tokens.adminToken) return;

        const res = await fetch(`${baseUrl}/api/audit-logs/stats`, {
            headers: {
                Authorization: `Bearer ${tokens.adminToken}`,
            },
        });

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(body.data.stats);
        assert.ok(typeof body.data.stats.totalLogs === 'number');
    });
});
