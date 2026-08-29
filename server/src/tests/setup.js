import { pool } from '../config/database.config.js';
import redis from '../config/cache.config.js';

beforeEach(async () => {
    try {
        if (redis && redis.status === 'ready') {
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
        if (pool && typeof pool.end === 'function') {
            await pool.end();
        }
        if (redis && typeof redis.quit === 'function') {
            await redis.quit();
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
        // Ignore teardown disconnect errors
    }
});
