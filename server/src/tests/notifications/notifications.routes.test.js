import 'dotenv/config';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../../app.js';
import redis from '../../config/cache.config.js';
import { pool } from '../../config/database.config.js';
import { getTestAuthTokens } from '../testHelper.js';

describe('Notifications Routes Integration Tests', () => {
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

    test('GET /api/notifications returns 401 when unauthenticated', async () => {
        const res = await fetch(`${baseUrl}/api/notifications`);
        assert.equal(res.status, 401);
    });

    test('GET /api/notifications returns notification list for authenticated user', async () => {
        if (!tokens.adminToken) return;

        const res = await fetch(`${baseUrl}/api/notifications`, {
            headers: {
                Authorization: `Bearer ${tokens.adminToken}`,
            },
        });

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(Array.isArray(body.data.notifications));
    });

    test('GET /api/notifications/unread-count returns integer badge count', async () => {
        if (!tokens.adminToken) return;

        const res = await fetch(`${baseUrl}/api/notifications/unread-count`, {
            headers: {
                Authorization: `Bearer ${tokens.adminToken}`,
            },
        });

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(typeof body.data.unreadCount === 'number');
    });

    test('POST /api/notifications/broadcast sends broadcast to organization users', async () => {
        if (!tokens.adminToken) return;

        const res = await fetch(`${baseUrl}/api/notifications/broadcast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokens.adminToken}`,
            },
            body: JSON.stringify({
                title: 'Company All-Hands Meeting',
                message: 'Quarterly all-hands meeting scheduled for tomorrow at 3 PM.',
                type: 'general',
            }),
        });

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(body.data.sentCount >= 1);
    });
});
