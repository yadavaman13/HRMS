import 'dotenv/config';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../../app.js';
import redis from '../../config/cache.config.js';
import { pool } from '../../config/database.config.js';
import { getTestAuthTokens } from '../testHelper.js';

describe('Company / HR Configuration Routes Integration Tests', () => {
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

    test('GET /api/companies/my returns company details for authenticated user', async () => {
        if (!tokens.adminToken) return;

        const res = await fetch(`${baseUrl}/api/companies/my`, {
            headers: {
                Authorization: `Bearer ${tokens.adminToken}`,
            },
        });

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(body.data.company);
        assert.equal(body.data.company.code, 'OI');
    });

    test('GET /api/companies/:id/locations returns locations list', async () => {
        if (!tokens.adminToken || !tokens.adminUser?.organizationId) return;

        const res = await fetch(
            `${baseUrl}/api/companies/${tokens.adminUser.organizationId}/locations`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.adminToken}`,
                },
            },
        );

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(Array.isArray(body.data.locations));
    });

    test('POST /api/companies/:id/locations creates a new location', async () => {
        if (!tokens.adminToken || !tokens.adminUser?.organizationId) return;

        const res = await fetch(
            `${baseUrl}/api/companies/${tokens.adminUser.organizationId}/locations`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens.adminToken}`,
                },
                body: JSON.stringify({
                    name: `Test Branch - ${Date.now()}`,
                    address: 'Pune Hinjewadi IT Park',
                }),
            },
        );

        assert.equal(res.status, 201);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(body.data.location.id);
    });

    test('GET /api/companies/:id/departments returns departments list', async () => {
        if (!tokens.adminToken || !tokens.adminUser?.organizationId) return;

        const res = await fetch(
            `${baseUrl}/api/companies/${tokens.adminUser.organizationId}/departments`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.adminToken}`,
                },
            },
        );

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(Array.isArray(body.data.departments));
    });

    test('GET /api/companies/:id/schedules returns work schedules list with days', async () => {
        if (!tokens.adminToken || !tokens.adminUser?.organizationId) return;

        const res = await fetch(
            `${baseUrl}/api/companies/${tokens.adminUser.organizationId}/schedules`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.adminToken}`,
                },
            },
        );

        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(Array.isArray(body.data.schedules));
    });
});
