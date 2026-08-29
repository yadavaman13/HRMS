import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import envConfig from './config/env.config.js';
import { authRouter, userRouter, adminRouter } from './modules/auth/index.js';
import aiRouter from './modules/ai/routes/ai.routes.js';
import { ragRouter } from './modules/rag/index.js';
import { pdfRouter } from './modules/pdf/index.js';
import { companyRouter } from './modules/company/index.js';
import { auditRouter } from './modules/audit/index.js';
import { notificationRouter } from './modules/notifications/index.js';
import { settingsRouter } from './modules/settings/index.js';
import { dashboardRouter } from './modules/dashboard/index.js';
import { employeeRouter, profileRouter } from './modules/employees/index.js';
import { attendanceRouter } from './modules/attendance/index.js';
import { leaveRouter } from './modules/leave/index.js';
import { payrollRouter } from './modules/payroll/index.js';
import { errorHandler } from './modules/auth/middleware/errorHandler.js';

import { pool } from './config/database.config.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: envConfig.CLIENT_ORIGINS,
        credentials: true,
    }),
);
app.use(morgan('combined'));

// Health check endpoints for Render, monitoring & CI quality gate
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        service: 'hrms-api',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: envConfig.NODE_ENV || 'development',
    });
});

app.get('/api/health/db', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({
            success: true,
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(503).json({
            success: false,
            status: 'degraded',
            database: 'disconnected',
            error: err.message,
            timestamp: new Date().toISOString(),
        });
    }
});

// Authentication & Users
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

// Core HRMS Domain Modules
app.use('/api/dashboard', dashboardRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/companies', companyRouter);
app.use('/api/company', companyRouter); // REST alias
app.use('/api/audit-logs', auditRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/settings', settingsRouter);

// Auxiliary & Operational Modules
app.use('/api/ai', aiRouter);
app.use('/api/rag', ragRouter);
app.use('/api/pdf', pdfRouter);
app.use('/api/profile', profileRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/payroll', payrollRouter);

app.use(errorHandler);

export default app;
