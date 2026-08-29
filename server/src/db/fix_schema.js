import 'dotenv/config';
import { pool } from '../config/database.config.js';

async function fixSchema() {
    try {
        console.log('1. Fixing role_enum values...');
        await pool.query(`
            ALTER TYPE "public"."role_enum" ADD VALUE IF NOT EXISTS 'hr';
            ALTER TYPE "public"."role_enum" ADD VALUE IF NOT EXISTS 'employee';
        `);

        console.log('2. Ensuring default organization exists...');
        const orgRes = await pool.query(`
            INSERT INTO organizations (name, code, email, timezone, currency)
            VALUES ('Default Organization', 'DEFAULT', 'admin@default.com', 'Asia/Kolkata', 'INR')
            ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
            RETURNING id;
        `);
        const orgId = orgRes.rows[0]?.id;

        console.log('3. Adding missing columns to users table...');
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password boolean DEFAULT false NOT NULL;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0 NOT NULL;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until timestamp with time zone;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_expires_at timestamp with time zone;
        `);

        if (orgId) {
            await pool.query(
                `
                UPDATE users SET organization_id = $1 WHERE organization_id IS NULL;
            `,
                [orgId],
            );
            await pool.query(`
                ALTER TABLE users ALTER COLUMN organization_id SET NOT NULL;
            `);
        }

        console.log('4. Creating remaining tables if not exist...');
        const initSql = `
            CREATE TABLE IF NOT EXISTS "employee_code_sequences" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "organization_id" uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
                "joining_year" integer NOT NULL,
                "last_sequence" integer DEFAULT 0 NOT NULL
            );

            CREATE TABLE IF NOT EXISTS "employee_private_info" (
                "employee_id" uuid PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
                "residential_address" text,
                "personal_email" varchar(255),
                "nationality" varchar(100),
                "marital_status" "marital_status_type",
                "emergency_contact_name" varchar(255),
                "emergency_contact_phone" varchar(20),
                "created_at" timestamp with time zone DEFAULT now() NOT NULL,
                "updated_at" timestamp with time zone DEFAULT now() NOT NULL
            );

            CREATE TABLE IF NOT EXISTS "employee_schedule_assignments" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "employee_id" uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
                "schedule_id" uuid NOT NULL REFERENCES work_schedules(id) ON DELETE CASCADE,
                "effective_from" date NOT NULL,
                "effective_to" date,
                "created_at" timestamp with time zone DEFAULT now() NOT NULL
            );
        `;
        await pool.query(initSql);

        console.log('Schema alignment complete.');
    } catch (err) {
        console.error('Schema alignment error:', err);
    } finally {
        await pool.end();
    }
}

fixSchema();
