import Redis from 'ioredis';
import envConfig from './env.config.js';

const redis = new Redis({
    host: envConfig.REDIS_HOST,
    port: Number(envConfig.REDIS_PORT),
    password: envConfig.REDIS_PASSWORD,

    connectTimeout: 10000, //ms

    retryStrategy(times) {
        if (times > 10) {
            console.error('Redis retry attempts exhausted');
            return null;
        }

        const delay = Math.min(times * 200, 2000);

        console.log(`Retrying Redis connection in ${delay}ms...`);

        return delay;
    },

    maxRetriesPerRequest: 3,

    enableReadyCheck: true,
});

redis.on('connect', () => {
    console.log('Redis socket connected');
});

redis.on('ready', () => {
    console.log('Redis ready');
});

redis.on('reconnecting', () => {
    console.log('Redis reconnecting...');
});

redis.on('close', () => {
    console.log('Redis connection closed');
});

redis.on('end', () => {
    console.log('Redis connection ended');
});

redis.on('error', (err) => {
    console.error('Redis error:', err.message);
});

export const clearAllCache = async () => {
    try {
        await redis.flushdb();
        console.log('Redis database cache flushed successfully');
        return true;
    } catch (err) {
        console.error('Failed to flush Redis cache:', err.message);
        throw err;
    }
};

export const clearCacheByPattern = async (pattern) => {
    try {
        const stream = redis.scanStream({ match: pattern, count: 100 });
        let totalDeleted = 0;

        return new Promise((resolve, reject) => {
            stream.on('data', async (keys) => {
                if (keys.length) {
                    stream.pause();
                    try {
                        const pipeline = redis.pipeline();
                        keys.forEach((key) => pipeline.del(key));
                        await pipeline.exec();
                        totalDeleted += keys.length;
                        stream.resume();
                    } catch (pipelineErr) {
                        reject(pipelineErr);
                    }
                }
            });

            stream.on('end', () => {
                console.log(`Cleared ${totalDeleted} key(s) matching pattern "${pattern}"`);
                resolve(totalDeleted);
            });

            stream.on('error', (err) => {
                console.error(`Error clearing pattern "${pattern}":`, err.message);
                reject(err);
            });
        });
    } catch (err) {
        console.error(`Failed to clear cache for pattern "${pattern}":`, err.message);
        throw err;
    }
};

export const deleteCache = async (...keys) => {
    try {
        if (!keys.length) return 0;
        return await redis.del(...keys);
    } catch (err) {
        console.error('Failed to delete cache keys:', err.message);
        throw err;
    }
};

export default redis;
