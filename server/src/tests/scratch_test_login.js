import 'dotenv/config';
import http from 'node:http';
import app from '../app.js';
import redis from '../config/cache.config.js';
import { pool } from '../config/database.config.js';

const testUsers = [
    { email: 'aryanpatel.me@gmail.com', password: 'Aryan@123', expectedRole: 'admin' },
    { email: 'iteshofficial@gmail.com', password: 'Itesh@123', expectedRole: 'admin' },
    { email: 'asr24983@gmail.com', password: 'Asr@123', expectedRole: 'admin' },
    { email: 'admin@example.com', password: 'Admin@123', expectedRole: 'admin' },
    { email: 'yadavaman1948@gmail.com', password: 'Aman@123', expectedRole: 'hr' },
    { email: 'leopatel967@gmail.com', password: 'Leo@123', expectedRole: 'hr' },
    { email: 'doomwiser@gmail.com', password: 'Doom@123', expectedRole: 'hr' },
    { email: 'hr@example.com', password: 'Priya@123', expectedRole: 'hr' },
    { email: 'work.yadavaman@gmail.com', password: 'Aman@123', expectedRole: 'employee' },
    { email: 'skyh53624@gmail.com', password: 'Sky@123', expectedRole: 'employee' },
    { email: 'employee@example.com', password: 'Aman@123', expectedRole: 'employee' },
];

async function runLoginVerification() {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;

    console.log(`\n======================================================`);
    console.log(`🧪 TESTING AUTH LOGIN FOR SEEDED CREDENTIALS`);
    console.log(`======================================================\n`);

    let passedCount = 0;
    let failedCount = 0;

    for (const u of testUsers) {
        try {
            // Clear rate limit key before test request
            const keys = await redis.keys('ratelimit:*');
            if (keys.length > 0) {
                await redis.del(...keys);
            }

            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: u.email, password: u.password }),
            });

            const body = await res.json();

            if (res.status === 200 && body.success) {
                const returnedUser = body.data?.user || body.user || {};
                const token =
                    body.data?.token ||
                    body.token ||
                    (res.headers.get('set-cookie') ? 'Cookie Set' : 'N/A');
                console.log(
                    `✅ [LOGIN SUCCESS] ${u.email} | Role: ${returnedUser.role || u.expectedRole} | Name: ${returnedUser.firstName} ${returnedUser.lastName}`,
                );
                passedCount++;
            } else {
                console.error(
                    `❌ [LOGIN FAILED] ${u.email} -> HTTP ${res.status}: ${body.message}`,
                );
                failedCount++;
            }
        } catch (err) {
            console.error(`❌ [LOGIN ERROR] ${u.email} -> ${err.message}`);
            failedCount++;
        }
    }

    console.log(`\n======================================================`);
    console.log(
        `📊 RESULTS: ${passedCount}/${testUsers.length} Logins Passed (${failedCount} failed)`,
    );
    console.log(`======================================================\n`);

    server.close();
    if (redis) await redis.quit();
    await pool.end();
    process.exit(failedCount === 0 ? 0 : 1);
}

runLoginVerification().catch((err) => {
    console.error('Fatal error during login verification:', err);
    process.exit(1);
});
