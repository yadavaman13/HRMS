import 'dotenv/config';
import request from 'supertest';
import app from '../app.js';
import { createAndLoginTestUser } from './helpers/auth-helper.js';
import redis from '../config/cache.config.js';
import { pool } from '../config/database.config.js';

async function testPayroll() {
    try {
        console.log('1. Creating admin user...');
        const adminUser = await createAndLoginTestUser({ role: 'admin' });
        console.log('Admin user created. Org:', adminUser.organizationId);

        console.log('2. Creating employee...');
        const timestamp = Date.now();
        const resEmp = await request(app)
            .post('/api/employees')
            .set('Cookie', adminUser.cookie)
            .send({
                firstName: 'Fiona',
                lastName: 'Gallagher',
                email: `fiona_${timestamp}@personal.com`,
                phone: '9444433330',
                joiningDate: '2026-08-01',
                employmentType: 'full_time',
                salary: 50000,
            });
        console.log(
            'Employee response status:',
            resEmp.status,
            'empId:',
            resEmp.body.data?.employee?.id,
        );

        console.log('3. Creating payroll period...');
        const year = 2100 + Math.floor(Math.random() * 5000);
        const periodPayload = {
            periodStart: `${year}-01-01`,
            periodEnd: `${year}-01-31`,
        };
        const resPeriod = await request(app)
            .post('/api/payroll/periods')
            .set('Cookie', adminUser.cookie)
            .send(periodPayload);
        console.log(
            'Period response status:',
            resPeriod.status,
            'periodId:',
            resPeriod.body.data?.period?.id,
        );
        const periodId = resPeriod.body.data.period.id;

        console.log('4. Calling process period...');
        const t0 = Date.now();
        const resProcess = await request(app)
            .post(`/api/payroll/periods/${periodId}/process`)
            .set('Cookie', adminUser.cookie);
        console.log(
            'Process response status:',
            resProcess.status,
            'Time taken:',
            Date.now() - t0,
            'ms',
        );
        console.log('Process response body:', resProcess.body);
    } catch (err) {
        console.error('Error during test:', err);
    } finally {
        if (redis) await redis.quit();
        await pool.end();
    }
}

testPayroll();
