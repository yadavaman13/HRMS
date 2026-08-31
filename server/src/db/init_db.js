import 'dotenv/config';
import { pool } from '../config/database.config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENUMS_SQL = `
DO $$ BEGIN CREATE TYPE "public"."user_role" AS ENUM('admin', 'hr', 'employee'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."employment_status" AS ENUM('active', 'inactive', 'terminated', 'on_leave', 'probation'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."employment_type" AS ENUM('full_time', 'part_time', 'contract', 'intern', 'consultant'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."gender_type" AS ENUM('male', 'female', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."marital_status_type" AS ENUM('single', 'married', 'divorced', 'widowed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."document_type" AS ENUM('resume', 'pan_card', 'aadhaar', 'offer_letter', 'medical_certificate', 'certification', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."proficiency_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'half_day', 'leave', 'holiday', 'weekly_off', 'incomplete'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."attendance_source" AS ENUM('system', 'manual', 'biometric', 'corrected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."adjustment_status" AS ENUM('pending', 'approved', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."leave_status" AS ENUM('draft', 'pending', 'approved', 'rejected', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."leave_half" AS ENUM('none', 'first_half', 'second_half'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."leave_transaction_type" AS ENUM('allocation', 'leave_used', 'leave_cancelled', 'leave_credited', 'carry_forward', 'adjustment', 'expiry'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."leave_unit" AS ENUM('day', 'half_day', 'hour'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."salary_component_type" AS ENUM('earning', 'employee_deduction', 'employer_contribution'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."salary_calculation_type" AS ENUM('fixed', 'percentage_of_wage', 'percentage_of_component', 'residual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."payroll_period_status" AS ENUM('draft', 'processing', 'calculated', 'review', 'finalized', 'paid', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."payslip_status" AS ENUM('draft', 'processing', 'calculated', 'finalized', 'paid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."wage_type" AS ENUM('fixed', 'hourly', 'daily'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."notification_type" AS ENUM('leave_approved', 'leave_rejected', 'leave_submitted', 'salary_updated', 'payslip_generated', 'payslip_finalized', 'attendance_reminder', 'attendance_corrected', 'password_reset', 'password_changed', 'employee_created', 'employee_terminated', 'general', 'system_alert'); EXCEPTION WHEN duplicate_object THEN null; END $$;
`;

async function initDatabase() {
    try {
        console.log('1. Creating / Verifying PostgreSQL Enums...');
        await pool.query(ENUMS_SQL);
        console.log('   ✅ Enums created / verified successfully.');

        console.log('2. Running SQL migration statements...');
        const drizzleDir = path.resolve(__dirname, '../../drizzle');
        const files = fs
            .readdirSync(drizzleDir)
            .filter((f) => f.endsWith('.sql'))
            .sort();

        for (const file of files) {
            const sqlContent = fs.readFileSync(path.join(drizzleDir, file), 'utf8');
            const statements = sqlContent.split('--> statement-breakpoint');

            for (const rawStmt of statements) {
                const stmt = rawStmt.trim();
                if (!stmt) continue;
                try {
                    await pool.query(stmt);
                } catch (stmtErr) {
                    // Ignore already existing types, tables, constraints, or duplicates
                    if (
                        stmtErr.code === '42710' || // duplicate_object (enum exists)
                        stmtErr.code === '42P07' || // duplicate_table (table exists)
                        stmtErr.code === '42701' || // duplicate_column (column exists)
                        stmtErr.message.includes('already exists')
                    ) {
                        continue;
                    }
                    console.warn(`[${file}] Warning:`, stmtErr.message);
                }
            }
        }
        console.log('   ✅ All tables, constraints, and schemas verified successfully!');

        console.log('\n🎉 Database initialization complete and ready for seeding.');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

initDatabase();
