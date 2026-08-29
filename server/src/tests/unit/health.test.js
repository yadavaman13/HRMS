import request from 'supertest';
import app from '../../app.js';

describe('Health Check Endpoints (Unit Tests)', () => {
    it('GET /api/health should return 200 with service metadata', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('status', 'healthy');
        expect(response.body).toHaveProperty('service', 'hrms-api');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('uptime');
    });
});
