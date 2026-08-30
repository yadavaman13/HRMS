import 'dotenv/config';
import app from './src/app.js';
import { connectToDatabase, pool } from './src/config/database.config.js';
import envConfig from './src/config/env.config.js';
import './src/cron/cleanup.cron.js';

const PORT = envConfig.SERVER_PORT || 3000;

connectToDatabase();

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown handling for Render & production environments
const handleShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Gracefully shutting down...`);
    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            if (pool && typeof pool.end === 'function') {
                await pool.end();
                console.log('Database pool drained.');
            }
            process.exit(0);
        } catch (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    });

    // Force exit if shutdown takes too long (10s timeout)
    setTimeout(() => {
        console.error('Forced shutdown due to timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
