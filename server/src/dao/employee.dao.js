import { db } from '../config/database.config.js';
import { eq } from 'drizzle-orm';
import { employees } from '../db/schema/employees.schema.js';

/**
 * Fetch employee profile by Employee Code.
 * @param {string} employeeCode
 * @returns {Promise<object|null>} The employee record or null if not found.
 */
export async function getEmployeeByCode(employeeCode) {
    if (typeof employeeCode !== 'string') return null;
    const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.employeeCode, employeeCode.toUpperCase()));
    return employee || null;
}
