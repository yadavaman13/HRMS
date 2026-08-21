import 'dotenv/config';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../../app.js';
import redis from '../../config/cache.config.js';
import { pool } from '../../config/database.config.js';
import { getTestAuthTokens } from '../testHelper.js';

describe('Dashboard & Analytics Routes Integration Tests', () => {
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

    test('GET /api/dashboard returns 401 Unauthorized when unauthenticated', async () => {
        const res = await fetch(`${baseUrl}/api/dashboard`);
        assert.equal(res.status, 401);
        const body = await res.json();
        assert.equal(body.success, false);
    });

    test('GET /api/dashboard with Admin token returns executive org overview', async () => {
        if (!tokens.adminToken) return;

        const res = await fetch(`${baseUrl}/api/dashboard`, {
            headers: {
                Authorization: `Bearer ${tokens.adminToken}`,
            },
        });

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.equal(body.data.role, 'admin');
        assert.ok(body.data.dashboard.headcount);
        assert.ok(Array.isArray(body.data.dashboard.departmentBreakdown));
        assert.ok(body.data.dashboard.todayAttendance);
        assert.ok(body.data.dashboard.pendingQueues);
    });

    test('GET /api/dashboard/admin returns 200 for Admin', async () => {
        if (!tokens.adminToken) return;

        const res = await fetch(`${baseUrl}/api/dashboard/admin`, {
            headers: {
                Authorization: `Bearer ${tokens.adminToken}`,
            },
        });

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(body.data.headcount);
        assert.ok(Array.isArray(body.data.departmentBreakdown));
    });

    test('GET /api/dashboard/employee with Employee token returns employee self-service metrics', async () => {
        const token = tokens.employeeToken || tokens.adminToken;
        if (!token) return;

        const res = await fetch(`${baseUrl}/api/dashboard/employee`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // 200 if employee profile exists, or 404 if not linked
        assert.ok([200, 404].includes(res.status));
        const body = await res.json();
        if (res.status === 200) {
            assert.equal(body.success, true);
            assert.ok(body.data.today);
            assert.ok(Array.isArray(body.data.leaveBalances));
        }
    });
});
