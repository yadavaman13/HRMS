import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';
import { db, pool } from '../config/database.config.js';
import {
    organizations,
    locations,
    departments,
    jobPositions,
} from './schema/organizations.schema.js';
import { users } from './schema/users.schema.js';
import {
    employees,
    employeePrivateInfo,
    employeeBankAccounts,
    employeeCodeSequences,
} from './schema/employees.schema.js';
import {
    workSchedules,
    workScheduleDays,
    employeeScheduleAssignments,
    holidays,
} from './schema/work_schedules.schema.js';
import { leaveTypes, leaveAllocations, leaveRequests } from './schema/leave.schema.js';
import { attendanceRecords, attendanceSessions } from './schema/attendance.schema.js';
import {
    payrollSettings,
    salaryComponentDefinitions,
    salaryStructures,
    salaryStructureComponents,
    payrollPeriods,
    payslips,
    payslipLines,
} from './schema/payroll.schema.js';
import { notifications } from './schema/notifications.schema.js';
import { auditLogs } from './schema/audit.schema.js';

async function seed() {
    console.log('🌱 Starting Comprehensive Indian HRMS Database Seeding...');

    try {
        // 1. Organization Setup
        let [org] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.code, 'OI'))
            .limit(1);

        if (!org) {
            [org] = await db
                .insert(organizations)
                .values({
                    name: 'Dayflow Technologies India Pvt. Ltd.',
                    code: 'OI',
                    email: 'contact@dayflow.in',
                    phone: '+91 22 6123 4567',
                    address:
                        'Tower B, 8th Floor, Nesco IT Park, Western Express Highway, Goregaon (East)',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India',
                    postalCode: '400063',
                    timezone: 'Asia/Kolkata',
                    currency: 'INR',
                    isActive: true,
                })
                .returning();
            console.log(`✅ Seeded Organization: ${org.name} (${org.code})`);
        } else {
            console.log(`ℹ️ Using Existing Organization: ${org.name} (${org.code})`);
        }

        // 2. Locations
        const defaultLocations = [
            {
                name: 'Mumbai HQ - Nesco IT Park',
                address: 'Goregaon (East), Mumbai, Maharashtra 400063',
            },
            {
                name: 'Bengaluru Tech Center - Manyata Park',
                address: 'Hebbal, Outer Ring Road, Bengaluru, Karnataka 560045',
            },
            {
                name: 'Pune Development Hub - EON Free Zone',
                address: 'Kharadi, Pune, Maharashtra 411014',
            },
            { name: 'Remote / Work From Home', address: 'Flexible Remote Location' },
        ];

        const locationMap = {};
        for (const loc of defaultLocations) {
            let [existing] = await db
                .select()
                .from(locations)
                .where(and(eq(locations.organizationId, org.id), eq(locations.name, loc.name)))
                .limit(1);

            if (!existing) {
                [existing] = await db
                    .insert(locations)
                    .values({
                        organizationId: org.id,
                        name: loc.name,
                        address: loc.address,
                        isActive: true,
                    })
                    .returning();
            }
            locationMap[loc.name] = existing;
        }
        console.log(
            `✅ Seeded ${Object.keys(locationMap).length} Locations (Mumbai, Bengaluru, Pune, Remote)`,
        );

        // 3. Departments
        const defaultDepts = [
            { name: 'Executive Leadership', code: 'EXEC' },
            { name: 'Engineering & Product', code: 'ENG' },
            { name: 'Human Resources & Talent', code: 'HR' },
            { name: 'Finance & Accounts', code: 'FIN' },
            { name: 'Sales & Enterprise Growth', code: 'SALES' },
            { name: 'Marketing & Brand', code: 'MKTG' },
            { name: 'Customer Success & Ops', code: 'OPS' },
        ];

        const deptMap = {};
        for (const dept of defaultDepts) {
            let [existing] = await db
                .select()
                .from(departments)
                .where(and(eq(departments.organizationId, org.id), eq(departments.code, dept.code)))
                .limit(1);

            if (!existing) {
                [existing] = await db
                    .insert(departments)
                    .values({
                        organizationId: org.id,
                        name: dept.name,
                        code: dept.code,
                        isActive: true,
                    })
                    .returning();
            }
            deptMap[dept.code] = existing;
        }
        console.log(`✅ Seeded ${Object.keys(deptMap).length} Departments`);

        // 4. Job Positions
        const defaultPositions = [
            {
                name: 'Chief Technology Officer (CTO)',
                description: 'Technology and platform leadership',
            },
            {
                name: 'Head of Human Resources',
                description: 'People operations and organizational development',
            },
            { name: 'VP of Engineering', description: 'Engineering organization leader' },
            {
                name: 'Lead Software Engineer',
                description: 'Core architecture and team leadership',
            },
            { name: 'Senior Full Stack Engineer', description: 'Full stack web development' },
            { name: 'Software Engineer', description: 'Application feature development' },
            {
                name: 'DevOps & Cloud Architect',
                description: 'Cloud infrastructure, CI/CD, and reliability',
            },
            { name: 'UI/UX Product Designer', description: 'Design systems and user experience' },
            {
                name: 'HR Operations Specialist',
                description: 'HR administration, onboarding, and employee support',
            },
            { name: 'Talent Acquisition Lead', description: 'Hiring and recruiting' },
            {
                name: 'Financial Controller',
                description: 'Financial planning, audits, and compliance',
            },
            {
                name: 'Senior Payroll Accountant',
                description: 'Payroll processing, PF, and statutory taxes',
            },
            { name: 'Enterprise Account Executive', description: 'B2B enterprise sales' },
            { name: 'Digital Marketing Manager', description: 'Growth marketing and campaigns' },
            { name: 'Customer Success Manager', description: 'Client onboarding and satisfaction' },
        ];

        const positionMap = {};
        for (const pos of defaultPositions) {
            let [existing] = await db
                .select()
                .from(jobPositions)
                .where(
                    and(eq(jobPositions.organizationId, org.id), eq(jobPositions.name, pos.name)),
                )
                .limit(1);

            if (!existing) {
                [existing] = await db
                    .insert(jobPositions)
                    .values({
                        organizationId: org.id,
                        name: pos.name,
                        description: pos.description,
                        isActive: true,
                    })
                    .returning();
            }
            positionMap[pos.name] = existing;
        }
        console.log(`✅ Seeded ${Object.keys(positionMap).length} Job Positions`);

        // 5. Work Schedule (Standard 5-Day Mon-Fri: 09:30 - 18:30 with 60 min lunch)
        let [standardSchedule] = await db
            .select()
            .from(workSchedules)
            .where(
                and(
                    eq(workSchedules.organizationId, org.id),
                    eq(workSchedules.name, 'Standard 5-Day General Shift'),
                ),
            )
            .limit(1);

        if (!standardSchedule) {
            [standardSchedule] = await db
                .insert(workSchedules)
                .values({
                    organizationId: org.id,
                    name: 'Standard 5-Day General Shift',
                    timezone: 'Asia/Kolkata',
                    defaultBreakMinutes: 60,
                    isActive: true,
                })
                .returning();

            // Weekdays: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
            const daysToInsert = [];
            for (let weekday = 0; weekday <= 6; weekday++) {
                const isWorking = weekday >= 1 && weekday <= 5;
                daysToInsert.push({
                    scheduleId: standardSchedule.id,
                    weekday,
                    isWorkingDay: isWorking,
                    startTime: isWorking ? '09:30:00' : null,
                    endTime: isWorking ? '18:30:00' : null,
                    breakMinutes: isWorking ? 60 : 0,
                });
            }
            await db.insert(workScheduleDays).values(daysToInsert);
            console.log(
                `✅ Seeded Work Schedule with 7 Weekday Rules (Mon-Fri 9:30 AM - 6:30 PM, Sat/Sun Off)`,
            );
        }

        // 6. Indian Public Holidays (2026)
        const indianHolidays = [
            { name: 'Republic Day', date: '2026-01-26', optional: false },
            { name: 'Holi', date: '2026-03-04', optional: false },
            { name: 'Eid-ul-Fitr', date: '2026-03-20', optional: false },
            { name: 'Good Friday', date: '2026-04-03', optional: false },
            { name: 'Independence Day', date: '2026-08-15', optional: false },
            { name: 'Raksha Bandhan', date: '2026-08-28', optional: true },
            { name: 'Gandhi Jayanti', date: '2026-10-02', optional: false },
            { name: 'Dussehra (Vijaya Dashami)', date: '2026-10-20', optional: false },
            { name: 'Diwali (Deepavali)', date: '2026-11-08', optional: false },
            { name: 'Guru Nanak Jayanti', date: '2026-11-24', optional: false },
            { name: 'Christmas Day', date: '2026-12-25', optional: false },
        ];

        for (const h of indianHolidays) {
            const [existing] = await db
                .select()
                .from(holidays)
                .where(and(eq(holidays.organizationId, org.id), eq(holidays.holidayDate, h.date)))
                .limit(1);

            if (!existing) {
                await db.insert(holidays).values({
                    organizationId: org.id,
                    name: h.name,
                    holidayDate: h.date,
                    isOptional: h.optional,
                    description: `Official Declared Public Holiday - ${h.name}`,
                });
            }
        }
        console.log(
            `✅ Seeded ${indianHolidays.length} Indian Gazetted & National Holidays (2026)`,
        );

        // 7. Leave Types (CL, SL, PL, LWP)
        const defaultLeaveTypes = [
            {
                code: 'CL',
                name: 'Casual Leave',
                isPaid: true,
                requiresAllocation: true,
                requiresAttachment: false,
                days: 12,
            },
            {
                code: 'SL',
                name: 'Sick Leave',
                isPaid: true,
                requiresAllocation: true,
                requiresAttachment: true,
                days: 10,
            },
            {
                code: 'PL',
                name: 'Privilege / Earned Leave',
                isPaid: true,
                requiresAllocation: true,
                requiresAttachment: false,
                days: 18,
            },
            {
                code: 'LWP',
                name: 'Leave Without Pay',
                isPaid: false,
                requiresAllocation: false,
                requiresAttachment: false,
                days: 0,
            },
        ];

        const leaveTypeMap = {};
        for (const lt of defaultLeaveTypes) {
            let [existing] = await db
                .select()
                .from(leaveTypes)
                .where(and(eq(leaveTypes.organizationId, org.id), eq(leaveTypes.code, lt.code)))
                .limit(1);

            if (!existing) {
                [existing] = await db
                    .insert(leaveTypes)
                    .values({
                        organizationId: org.id,
                        code: lt.code,
                        name: lt.name,
                        isPaid: lt.isPaid,
                        requiresAllocation: lt.requiresAllocation,
                        requiresAttachment: lt.requiresAttachment,
                        requiresApproval: true,
                        unit: 'day',
                        isActive: true,
                    })
                    .returning();
            }
            leaveTypeMap[lt.code] = { ...existing, defaultDays: lt.days };
        }
        console.log(`✅ Seeded Leave Types (CL, SL, PL, LWP)`);

        // 8. Payroll Settings & Salary Component Definitions
        let [existingPayrollSettings] = await db
            .select()
            .from(payrollSettings)
            .where(eq(payrollSettings.organizationId, org.id))
            .limit(1);

        if (!existingPayrollSettings) {
            [existingPayrollSettings] = await db
                .insert(payrollSettings)
                .values({
                    organizationId: org.id,
                    payrollFrequency: 'MONTHLY',
                    payrollCurrency: 'INR',
                    payDay: 1,
                    workingDaysBasis: '22.00',
                    unpaidLeaveDeductionMethod: 'PROPORTIONAL_GROSS',
                    pfEnabled: true,
                    employeePfRate: '12.00',
                    employerPfRate: '12.00',
                    professionalTaxEnabled: true,
                    professionalTaxAmount: '200.00',
                })
                .returning();
        }

        const salaryComponents = [
            {
                code: 'BASIC',
                name: 'Basic Salary',
                type: 'earning',
                calcType: 'percentage_of_wage',
                base: 'GROSS_WAGE',
                percentage: '50.000',
            },
            {
                code: 'HRA',
                name: 'House Rent Allowance (HRA)',
                type: 'earning',
                calcType: 'percentage_of_component',
                base: 'BASIC',
                percentage: '50.000',
            },
            {
                code: 'STANDARD_ALLOWANCE',
                name: 'Standard Allowance',
                type: 'earning',
                calcType: 'fixed',
                base: null,
                fixed: '4167.00',
            },
            {
                code: 'PERFORMANCE_BONUS',
                name: 'Performance Bonus',
                type: 'earning',
                calcType: 'percentage_of_component',
                base: 'BASIC',
                percentage: '8.330',
            },
            {
                code: 'LTA',
                name: 'Leave Travel Allowance (LTA)',
                type: 'earning',
                calcType: 'percentage_of_component',
                base: 'BASIC',
                percentage: '8.330',
            },
            {
                code: 'FIXED_ALLOWANCE',
                name: 'Fixed Special Allowance',
                type: 'earning',
                calcType: 'residual',
                base: null,
                isResidual: true,
            },
            {
                code: 'EMPLOYEE_PF',
                name: 'Employee PF Deduction',
                type: 'employee_deduction',
                calcType: 'percentage_of_component',
                base: 'BASIC',
                percentage: '12.000',
            },
            {
                code: 'EMPLOYER_PF',
                name: 'Employer PF Contribution',
                type: 'employer_contribution',
                calcType: 'percentage_of_component',
                base: 'BASIC',
                percentage: '12.000',
            },
            {
                code: 'PROFESSIONAL_TAX',
                name: 'Professional Tax (PT)',
                type: 'employee_deduction',
                calcType: 'fixed',
                base: null,
                fixed: '200.00',
            },
        ];

        const componentDefMap = {};
        for (const comp of salaryComponents) {
            let [existing] = await db
                .select()
                .from(salaryComponentDefinitions)
                .where(
                    and(
                        eq(salaryComponentDefinitions.organizationId, org.id),
                        eq(salaryComponentDefinitions.code, comp.code),
                    ),
                )
                .limit(1);

            if (!existing) {
                [existing] = await db
                    .insert(salaryComponentDefinitions)
                    .values({
                        organizationId: org.id,
                        code: comp.code,
                        name: comp.name,
                        componentType: comp.type,
                        calculationType: comp.calcType,
                        calculationBase: comp.base,
                        isActive: true,
                    })
                    .returning();
            }
            componentDefMap[comp.code] = { ...existing, ...comp };
        }
        console.log(
            `✅ Seeded Salary Component Definitions (Basic, HRA, PF, PT, LTA, Bonus, Residual)`,
        );

        // 9. Employee Code Sequence Setup
        const currentYear = new Date().getFullYear();
        const [existingSeq] = await db
            .select()
            .from(employeeCodeSequences)
            .where(
                and(
                    eq(employeeCodeSequences.organizationId, org.id),
                    eq(employeeCodeSequences.joiningYear, currentYear),
                ),
            )
            .limit(1);

        if (!existingSeq) {
            await db.insert(employeeCodeSequences).values({
                organizationId: org.id,
                joiningYear: currentYear,
                lastSequence: 20,
            });
        }
        console.log(`✅ Verified Employee Code Sequences`);

        // 10. Realistic Indian Employees Master Dataset
        const defaultPassword = 'Admin@123';
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        const indianEmployees = [
            {
                firstName: 'Aarav',
                lastName: 'Sharma',
                email: 'admin@example.com',
                role: 'admin',
                code: `OIARSH20230001`,
                dept: 'EXEC',
                position: 'Chief Technology Officer (CTO)',
                location: 'Mumbai HQ - Nesco IT Park',
                wage: '180000.00',
                joiningDate: '2023-01-15',
                gender: 'male',
                address:
                    'Flat 1402, Oberoi Woods, Mohan Gokhale Rd, Goregaon (East), Mumbai 400063',
                phone: '+91 98201 23456',
                pan: 'ABCPS1234F',
                bank: { name: 'HDFC Bank Ltd', ifsc: 'HDFC0000060', account: '50100234567890' },
            },
            {
                firstName: 'Priya',
                lastName: 'Nair',
                email: 'hr@example.com',
                role: 'hr',
                code: `OIPRNA20230002`,
                dept: 'HR',
                position: 'Head of Human Resources',
                location: 'Mumbai HQ - Nesco IT Park',
                wage: '135000.00',
                joiningDate: '2023-03-01',
                gender: 'female',
                address: 'A-304, Sea Green Heights, Palm Beach Road, Vashi, Navi Mumbai 400703',
                phone: '+91 98192 34567',
                pan: 'BNYPN5678G',
                bank: { name: 'ICICI Bank Ltd', ifsc: 'ICIC0000104', account: '002401567891' },
            },
            {
                firstName: 'Ananya',
                lastName: 'Deshmukh',
                email: 'ananya.d@example.com',
                role: 'hr',
                code: `OIANDE20240003`,
                dept: 'HR',
                position: 'HR Operations Specialist',
                location: 'Mumbai HQ - Nesco IT Park',
                wage: '75000.00',
                joiningDate: '2024-02-10',
                gender: 'female',
                address: 'B-12, Green Acres, Lokhandwala Complex, Andheri (West), Mumbai 400053',
                phone: '+91 98701 45678',
                pan: 'CKLPD8910H',
                bank: { name: 'Axis Bank Ltd', ifsc: 'UTIB0000004', account: '918010045678912' },
            },
            {
                firstName: 'Aman',
                lastName: 'Yadav',
                email: 'employee@example.com',
                role: 'employee',
                code: `OIAMYA20240004`,
                dept: 'ENG',
                position: 'Senior Full Stack Engineer',
                location: 'Mumbai HQ - Nesco IT Park',
                wage: '110000.00',
                joiningDate: '2024-04-15',
                gender: 'male',
                address:
                    '702, Silver Arch, Powai Plaza Lane, Hiranandani Gardens, Powai, Mumbai 400076',
                phone: '+91 98334 56789',
                pan: 'DFPYA2345J',
                bank: { name: 'HDFC Bank Ltd', ifsc: 'HDFC0000128', account: '50100345678901' },
            },
            {
                firstName: 'Vikramaditya',
                lastName: 'Roy',
                email: 'vikram.roy@example.com',
                role: 'employee',
                code: `OIVIROY20230005`,
                dept: 'ENG',
                position: 'Lead Software Engineer',
                location: 'Bengaluru Tech Center - Manyata Park',
                wage: '150000.00',
                joiningDate: '2023-06-01',
                gender: 'male',
                address: 'Flat 401, Ferns Paradise, Doddanekkundi, Marathahalli, Bengaluru 560037',
                phone: '+91 99001 23456',
                pan: 'EGHVR6789K',
                bank: { name: 'State Bank of India', ifsc: 'SBIN0004052', account: '30456789012' },
            },
            {
                firstName: 'Sneha',
                lastName: 'Kulkarni',
                email: 'sneha.k@example.com',
                role: 'employee',
                code: `OISNKU20240006`,
                dept: 'ENG',
                position: 'Senior Full Stack Engineer',
                location: 'Pune Development Hub - EON Free Zone',
                wage: '105000.00',
                joiningDate: '2024-05-20',
                gender: 'female',
                address: 'Row House 8, Marvel Bounty, Magarpatta City, Hadapsar, Pune 411028',
                phone: '+91 98901 34567',
                pan: 'FJKPK1234L',
                bank: { name: 'Kotak Mahindra Bank', ifsc: 'KKBK0000712', account: '6712345678' },
            },
            {
                firstName: 'Rahul',
                lastName: 'Verma',
                email: 'rahul.v@example.com',
                role: 'employee',
                code: `OIRAVE20240007`,
                dept: 'ENG',
                position: 'DevOps & Cloud Architect',
                location: 'Bengaluru Tech Center - Manyata Park',
                wage: '125000.00',
                joiningDate: '2024-07-01',
                gender: 'male',
                address: '1203, Prestige Misty Waters, Hebbal, Bengaluru 560024',
                phone: '+91 97401 56789',
                pan: 'GLMPV5678M',
                bank: { name: 'HDFC Bank Ltd', ifsc: 'HDFC0000085', account: '50100456789012' },
            },
            {
                firstName: 'Divya',
                lastName: 'Iyer',
                email: 'divya.i@example.com',
                role: 'employee',
                code: `OIDVIY20250008`,
                dept: 'ENG',
                position: 'UI/UX Product Designer',
                location: 'Bengaluru Tech Center - Manyata Park',
                wage: '95000.00',
                joiningDate: '2025-01-10',
                gender: 'female',
                address: '502, Brigade Gateway, Malleshwaram, Bengaluru 560055',
                phone: '+91 96321 67890',
                pan: 'HNQDI9012N',
                bank: { name: 'ICICI Bank Ltd', ifsc: 'ICIC0000002', account: '000201567893' },
            },
            {
                firstName: 'Karthik',
                lastName: 'Subramanian',
                email: 'karthik.s@example.com',
                role: 'employee',
                code: `OIKASU20250009`,
                dept: 'ENG',
                position: 'Software Engineer',
                location: 'Bengaluru Tech Center - Manyata Park',
                wage: '70000.00',
                joiningDate: '2025-03-01',
                gender: 'male',
                address: '104, Shriram Spandana, Wind Tunnel Road, Murugeshpalya, Bengaluru 560017',
                phone: '+91 98450 12345',
                pan: 'JPQKS3456P',
                bank: { name: 'State Bank of India', ifsc: 'SBIN0000813', account: '20345678901' },
            },
            {
                firstName: 'Pooja',
                lastName: 'Patel',
                email: 'pooja.p@example.com',
                role: 'employee',
                code: `OIPOPA20250010`,
                dept: 'ENG',
                position: 'Software Engineer',
                location: 'Mumbai HQ - Nesco IT Park',
                wage: '65000.00',
                joiningDate: '2025-06-15',
                gender: 'female',
                address: '301, Vasant Galaxy, Bangur Nagar, Goregaon (West), Mumbai 400104',
                phone: '+91 97690 23456',
                pan: 'KLRPA7890Q',
                bank: { name: 'Axis Bank Ltd', ifsc: 'UTIB0000123', account: '919010056789123' },
            },
            {
                firstName: 'Rajeshwari',
                lastName: 'Iyer',
                email: 'rajeshwari.i@example.com',
                role: 'employee',
                code: `OIRAIY20230011`,
                dept: 'FIN',
                position: 'Financial Controller',
                location: 'Mumbai HQ - Nesco IT Park',
                wage: '140000.00',
                joiningDate: '2023-04-01',
                gender: 'female',
                address: '1102, Hiranandani Zen, Powai, Mumbai 400076',
                phone: '+91 98205 67890',
                pan: 'LMRRI1234R',
                bank: { name: 'HDFC Bank Ltd', ifsc: 'HDFC0000060', account: '50100567890123' },
            },
            {
                firstName: 'Amitabh',
                lastName: 'Sen',
                email: 'amitabh.s@example.com',
                role: 'employee',
                code: `OIAMSE20240012`,
                dept: 'FIN',
                position: 'Senior Payroll Accountant',
                location: 'Mumbai HQ - Nesco IT Park',
                wage: '80000.00',
                joiningDate: '2024-03-15',
                gender: 'male',
                address: 'Flat 603, Kalpataru Estate, JVLR, Andheri (East), Mumbai 400093',
                phone: '+91 98198 76543',
                pan: 'MNPAS5678S',
                bank: { name: 'ICICI Bank Ltd', ifsc: 'ICIC0000011', account: '001101567894' },
            },
            {
                firstName: 'Tanvi',
                lastName: 'Kapoor',
                email: 'tanvi.k@example.com',
                role: 'employee',
                code: `OITAKA20240013`,
                dept: 'SALES',
                position: 'Enterprise Account Executive',
                location: 'Mumbai HQ - Nesco IT Park',
                wage: '115000.00',
                joiningDate: '2024-08-01',
                gender: 'female',
                address: '7B, Sunswept Apartments, Lokhandwala, Andheri (West), Mumbai 400053',
                phone: '+91 98209 11223',
                pan: 'NOPTI9012T',
                bank: { name: 'HDFC Bank Ltd', ifsc: 'HDFC0000240', account: '50100678901234' },
            },
            {
                firstName: 'Siddharth',
                lastName: 'Malhotra',
                email: 'siddharth.m@example.com',
                role: 'employee',
                code: `OISIMA20250014`,
                dept: 'MKTG',
                position: 'Digital Marketing Manager',
                location: 'Pune Development Hub - EON Free Zone',
                wage: '90000.00',
                joiningDate: '2025-02-01',
                gender: 'male',
                address: '402, Clover Highlands, NIBM Road, Kondhwa, Pune 411048',
                phone: '+91 98909 88776',
                pan: 'PQRSS3456U',
                bank: { name: 'Axis Bank Ltd', ifsc: 'UTIB0000037', account: '919010067890123' },
            },
            {
                firstName: 'Neha',
                lastName: 'Joshi',
                email: 'neha.j@example.com',
                role: 'employee',
                code: `OINEJO20250015`,
                dept: 'OPS',
                position: 'Customer Success Manager',
                location: 'Pune Development Hub - EON Free Zone',
                wage: '75000.00',
                joiningDate: '2025-04-10',
                gender: 'female',
                address: 'Flat 901, Amanora Park Town, Sector R2, Hadapsar, Pune 411028',
                phone: '+91 98811 22334',
                pan: 'QRSNJ7890V',
                bank: { name: 'State Bank of India', ifsc: 'SBIN0011500', account: '30567890123' },
            },
        ];

        const seededEmployees = [];

        for (const item of indianEmployees) {
            console.log(
                `👤 Processing Employee [${item.code}]: ${item.firstName} ${item.lastName} (${item.email})...`,
            );
            let [user] = await db.select().from(users).where(eq(users.email, item.email)).limit(1);

            if (!user) {
                [user] = await db
                    .insert(users)
                    .values({
                        organizationId: org.id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        email: item.email,
                        password: passwordHash,
                        role: item.role,
                        emailVerified: true,
                        isActive: true,
                        isDeleted: false,
                        mustChangePassword: false,
                    })
                    .returning();
            } else {
                [user] = await db
                    .update(users)
                    .set({
                        organizationId: org.id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        role: item.role,
                        password: passwordHash,
                        isActive: true,
                        isDeleted: false,
                    })
                    .where(eq(users.id, user.id))
                    .returning();
            }

            const dept = deptMap[item.dept] || deptMap['ENG'];
            const pos = positionMap[item.position] || positionMap['Software Engineer'];
            const loc = locationMap[item.location] || locationMap['Mumbai HQ - Nesco IT Park'];

            let [emp] = await db
                .select()
                .from(employees)
                .where(eq(employees.userId, user.id))
                .limit(1);

            if (!emp) {
                [emp] = await db
                    .insert(employees)
                    .values({
                        organizationId: org.id,
                        userId: user.id,
                        employeeCode: item.code,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        displayName: `${item.firstName} ${item.lastName}`,
                        workEmail: item.email,
                        phone: item.phone,
                        departmentId: dept?.id,
                        jobPositionId: pos?.id,
                        locationId: loc?.id,
                        joiningDate: item.joiningDate,
                        gender: item.gender,
                        employmentStatus: 'active',
                        employmentType: 'full_time',
                    })
                    .returning();
            }

            seededEmployees.push({ emp, user, item });

            // Assign standard schedule
            const [existingSched] = await db
                .select()
                .from(employeeScheduleAssignments)
                .where(eq(employeeScheduleAssignments.employeeId, emp.id))
                .limit(1);

            if (!existingSched && standardSchedule) {
                await db.insert(employeeScheduleAssignments).values({
                    employeeId: emp.id,
                    scheduleId: standardSchedule.id,
                    effectiveFrom: item.joiningDate,
                });
            }

            // Private Info
            const [existingPriv] = await db
                .select()
                .from(employeePrivateInfo)
                .where(eq(employeePrivateInfo.employeeId, emp.id))
                .limit(1);

            if (!existingPriv) {
                await db.insert(employeePrivateInfo).values({
                    employeeId: emp.id,
                    residentialAddress: item.address,
                    personalEmail: item.email.replace('@example.com', '@gmail.com'),
                    nationality: 'Indian',
                    maritalStatus: item.gender === 'male' ? 'married' : 'single',
                    emergencyContactName: `${item.firstName}'s Family Contact`,
                    emergencyContactPhone: '+91 99220 99887',
                });
            }

            // Bank Account
            const [existingBank] = await db
                .select()
                .from(employeeBankAccounts)
                .where(eq(employeeBankAccounts.employeeId, emp.id))
                .limit(1);

            if (!existingBank) {
                await db.insert(employeeBankAccounts).values({
                    employeeId: emp.id,
                    accountHolderName: `${item.firstName} ${item.lastName}`,
                    accountNumberEncrypted: Buffer.from(item.bank.account),
                    bankName: item.bank.name,
                    ifscCode: item.bank.ifsc,
                    isPrimary: true,
                });
            }

            // Leave Allocations
            for (const [, ltype] of Object.entries(leaveTypeMap)) {
                if (ltype.defaultDays > 0) {
                    const [existingAlloc] = await db
                        .select()
                        .from(leaveAllocations)
                        .where(
                            and(
                                eq(leaveAllocations.employeeId, emp.id),
                                eq(leaveAllocations.leaveTypeId, ltype.id),
                                eq(leaveAllocations.periodStart, `${currentYear}-01-01`),
                            ),
                        )
                        .limit(1);

                    if (!existingAlloc) {
                        await db.insert(leaveAllocations).values({
                            employeeId: emp.id,
                            leaveTypeId: ltype.id,
                            periodStart: `${currentYear}-01-01`,
                            periodEnd: `${currentYear}-12-31`,
                            allocatedDays: ltype.defaultDays.toString(),
                            carriedForwardDays: '0',
                            createdBy: user.id,
                        });
                    }
                }
            }

            // Salary Structure
            let [salaryStructure] = await db
                .select()
                .from(salaryStructures)
                .where(eq(salaryStructures.employeeId, emp.id))
                .limit(1);

            if (!salaryStructure) {
                [salaryStructure] = await db
                    .insert(salaryStructures)
                    .values({
                        employeeId: emp.id,
                        monthlyWage: item.wage,
                        wageType: 'fixed',
                        effectiveFrom: item.joiningDate,
                        status: 'ACTIVE',
                        createdBy: user.id,
                    })
                    .returning();

                // Calculate & Insert Components
                const wage = parseFloat(item.wage);
                const basic = wage * 0.5;
                const hra = basic * 0.5;
                const standard = 4167.0;
                const bonus = basic * 0.0833;
                const lta = basic * 0.0833;
                const subtotal = basic + hra + standard + bonus + lta;
                const fixed = Math.max(0, wage - subtotal);

                const structureComponents = [
                    {
                        comp: componentDefMap['BASIC'],
                        calcType: 'percentage_of_wage',
                        base: 'GROSS_WAGE',
                        pct: '50.000',
                        amount: basic.toFixed(2),
                    },
                    {
                        comp: componentDefMap['HRA'],
                        calcType: 'percentage_of_component',
                        base: 'BASIC',
                        pct: '50.000',
                        amount: hra.toFixed(2),
                    },
                    {
                        comp: componentDefMap['STANDARD_ALLOWANCE'],
                        calcType: 'fixed',
                        base: null,
                        pct: null,
                        amount: standard.toFixed(2),
                    },
                    {
                        comp: componentDefMap['PERFORMANCE_BONUS'],
                        calcType: 'percentage_of_component',
                        base: 'BASIC',
                        pct: '8.330',
                        amount: bonus.toFixed(2),
                    },
                    {
                        comp: componentDefMap['LTA'],
                        calcType: 'percentage_of_component',
                        base: 'BASIC',
                        pct: '8.330',
                        amount: lta.toFixed(2),
                    },
                    {
                        comp: componentDefMap['FIXED_ALLOWANCE'],
                        calcType: 'residual',
                        base: null,
                        pct: null,
                        amount: fixed.toFixed(2),
                        isResidual: true,
                    },
                    {
                        comp: componentDefMap['EMPLOYEE_PF'],
                        calcType: 'percentage_of_component',
                        base: 'BASIC',
                        pct: '12.000',
                        amount: (basic * 0.12).toFixed(2),
                    },
                    {
                        comp: componentDefMap['EMPLOYER_PF'],
                        calcType: 'percentage_of_component',
                        base: 'BASIC',
                        pct: '12.000',
                        amount: (basic * 0.12).toFixed(2),
                    },
                    {
                        comp: componentDefMap['PROFESSIONAL_TAX'],
                        calcType: 'fixed',
                        base: null,
                        pct: null,
                        amount: '200.00',
                    },
                ];

                for (let i = 0; i < structureComponents.length; i++) {
                    const sc = structureComponents[i];
                    if (sc.comp?.id) {
                        const [existingSC] = await db
                            .select()
                            .from(salaryStructureComponents)
                            .where(
                                and(
                                    eq(
                                        salaryStructureComponents.salaryStructureId,
                                        salaryStructure.id,
                                    ),
                                    eq(salaryStructureComponents.componentDefinitionId, sc.comp.id),
                                ),
                            )
                            .limit(1);

                        if (!existingSC) {
                            await db.insert(salaryStructureComponents).values({
                                salaryStructureId: salaryStructure.id,
                                componentDefinitionId: sc.comp.id,
                                calculationType: sc.calcType,
                                calculationBase: sc.base,
                                percentage: sc.pct,
                                fixedAmount: sc.amount,
                                sequence: i + 1,
                                isResidual: sc.isResidual || false,
                            });
                        }
                    }
                }
            }
        }
        console.log(
            `✅ Seeded ${seededEmployees.length} Indian Employees with Schedules, Private Info, Bank Details, & Salary Structures`,
        );

        // 11. Sample Leave Requests (Approved & Pending)
        const clType = leaveTypeMap['CL'];
        const slType = leaveTypeMap['SL'];
        const plType = leaveTypeMap['PL'];

        if (seededEmployees.length >= 5) {
            // Aman Yadav - Approved Leave (Past)
            const aman = seededEmployees.find((e) => e.user.email === 'employee@example.com')?.emp;
            if (aman && clType) {
                const [existing] = await db
                    .select()
                    .from(leaveRequests)
                    .where(
                        and(
                            eq(leaveRequests.employeeId, aman.id),
                            eq(leaveRequests.startDate, '2026-08-10'),
                        ),
                    )
                    .limit(1);

                if (!existing) {
                    await db.insert(leaveRequests).values({
                        employeeId: aman.id,
                        leaveTypeId: clType.id,
                        startDate: '2026-08-10',
                        endDate: '2026-08-11',
                        requestedDays: '2.0',
                        reason: 'Family function in Lucknow',
                        status: 'approved',
                        submittedAt: new Date('2026-08-01T10:00:00Z'),
                        approvedAt: new Date('2026-08-02T14:30:00Z'),
                    });
                }
            }

            // Sneha Kulkarni - Pending Leave
            const sneha = seededEmployees.find((e) => e.item.firstName === 'Sneha')?.emp;
            if (sneha && plType) {
                const [existing] = await db
                    .select()
                    .from(leaveRequests)
                    .where(
                        and(
                            eq(leaveRequests.employeeId, sneha.id),
                            eq(leaveRequests.startDate, '2026-08-25'),
                        ),
                    )
                    .limit(1);

                if (!existing) {
                    await db.insert(leaveRequests).values({
                        employeeId: sneha.id,
                        leaveTypeId: plType.id,
                        startDate: '2026-08-25',
                        endDate: '2026-08-28',
                        requestedDays: '4.0',
                        reason: 'Vacation with family to Goa',
                        status: 'pending',
                        submittedAt: new Date('2026-08-18T09:15:00Z'),
                    });
                }
            }

            // Vikramaditya Roy - Pending Sick Leave
            const vikram = seededEmployees.find((e) => e.item.firstName === 'Vikramaditya')?.emp;
            if (vikram && slType) {
                const [existing] = await db
                    .select()
                    .from(leaveRequests)
                    .where(
                        and(
                            eq(leaveRequests.employeeId, vikram.id),
                            eq(leaveRequests.startDate, '2026-08-21'),
                        ),
                    )
                    .limit(1);

                if (!existing) {
                    await db.insert(leaveRequests).values({
                        employeeId: vikram.id,
                        leaveTypeId: slType.id,
                        startDate: '2026-08-21',
                        endDate: '2026-08-21',
                        requestedDays: '1.0',
                        reason: 'Viral fever and doctor rest recommendation',
                        status: 'pending',
                        submittedAt: new Date('2026-08-21T08:00:00Z'),
                    });
                }
            }
        }
        console.log(`✅ Seeded Sample Approved & Pending Leave Requests for Workflow Validation`);

        // 12. Sample Past 7 Days Attendance Records
        const today = new Date();
        for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
            const dateObj = new Date(today);
            dateObj.setDate(today.getDate() - dayOffset);
            const dateStr = dateObj.toISOString().split('T')[0];
            const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday

            if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

            for (const { emp } of seededEmployees.slice(0, 10)) {
                const isLate = Math.random() < 0.2;
                const status = isLate ? 'present' : Math.random() < 0.9 ? 'present' : 'absent';
                const workMins = status === 'present' ? (isLate ? 510 : 540) : 0;
                const lateMins = isLate ? 30 : 0;

                let [rec] = await db
                    .select()
                    .from(attendanceRecords)
                    .where(
                        and(
                            eq(attendanceRecords.employeeId, emp.id),
                            eq(attendanceRecords.attendanceDate, dateStr),
                        ),
                    )
                    .limit(1);

                if (!rec) {
                    [rec] = await db
                        .insert(attendanceRecords)
                        .values({
                            employeeId: emp.id,
                            attendanceDate: dateStr,
                            status: status,
                            totalWorkMinutes: workMins,
                            scheduledWorkMinutes: 540,
                            overtimeMinutes: workMins > 540 ? workMins - 540 : 0,
                            lateMinutes: lateMins,
                            remarks: isLate ? 'Late arrival due to traffic' : null,
                            source: 'system',
                        })
                        .returning();

                    if (rec && status === 'present') {
                        const checkInHour = isLate ? '10:00:00' : '09:30:00';
                        const checkOutHour = isLate ? '19:00:00' : '18:30:00';

                        const isToday = dayOffset === 0;
                        await db.insert(attendanceSessions).values({
                            attendanceRecordId: rec.id,
                            checkInAt: new Date(`${dateStr}T${checkInHour}+05:30`),
                            checkOutAt: isToday
                                ? new Date(`${dateStr}T17:00:00+05:30`)
                                : new Date(`${dateStr}T${checkOutHour}+05:30`),
                            workedMinutes: workMins,
                            breakMinutes: 60,
                        });
                    }
                }
            }
        }
        console.log(`✅ Seeded Past 7-Day Attendance Logs & Check-In Sessions for Employees`);

        // 13. Sample Finalized Payroll Period (July 2026) & Payslips
        const adminUser = seededEmployees.find((e) => e.user.role === 'admin')?.user;
        let [julyPayroll] = await db
            .select()
            .from(payrollPeriods)
            .where(
                and(
                    eq(payrollPeriods.organizationId, org.id),
                    eq(payrollPeriods.periodStart, '2026-07-01'),
                    eq(payrollPeriods.periodEnd, '2026-07-31'),
                ),
            )
            .limit(1);

        if (!julyPayroll && adminUser) {
            [julyPayroll] = await db
                .insert(payrollPeriods)
                .values({
                    organizationId: org.id,
                    periodStart: '2026-07-01',
                    periodEnd: '2026-07-31',
                    status: 'finalized',
                    processedAt: new Date('2026-07-31T18:00:00Z'),
                    finalizedAt: new Date('2026-07-31T20:00:00Z'),
                    createdBy: adminUser.id,
                })
                .returning();

            // Create payslips for employees
            for (const { emp, item } of seededEmployees) {
                const [struct] = await db
                    .select()
                    .from(salaryStructures)
                    .where(eq(salaryStructures.employeeId, emp.id))
                    .limit(1);

                if (struct) {
                    const monthlyWage = parseFloat(item.wage);
                    const basic = monthlyWage * 0.5;
                    const hra = basic * 0.5;
                    const employeePf = basic * 0.12;
                    const profTax = 200.0;
                    const totalDeductions = employeePf + profTax;
                    const netPay = monthlyWage - totalDeductions;

                    const [slip] = await db
                        .insert(payslips)
                        .values({
                            payrollPeriodId: julyPayroll.id,
                            employeeId: emp.id,
                            salaryStructureId: struct.id,
                            monthlyWage: item.wage,
                            workingDays: '22.00',
                            payableDays: '22.00',
                            paidLeaveDays: '0.00',
                            unpaidLeaveDays: '0.00',
                            absentDays: '0.00',
                            grossEarnings: item.wage,
                            totalEmployeeDeductions: totalDeductions.toFixed(2),
                            employerContributions: employeePf.toFixed(2),
                            unpaidDeduction: '0.00',
                            netPay: netPay.toFixed(2),
                            status: 'finalized',
                            generatedAt: new Date('2026-07-31T18:30:00Z'),
                            finalizedAt: new Date('2026-07-31T20:00:00Z'),
                        })
                        .returning();

                    // Payslip Lines
                    const lines = [
                        {
                            code: 'BASIC',
                            name: 'Basic Salary',
                            type: 'earning',
                            calcType: 'percentage_of_wage',
                            amount: basic.toFixed(2),
                            seq: 1,
                        },
                        {
                            code: 'HRA',
                            name: 'House Rent Allowance (HRA)',
                            type: 'earning',
                            calcType: 'percentage_of_component',
                            amount: hra.toFixed(2),
                            seq: 2,
                        },
                        {
                            code: 'SPECIAL_ALLOWANCE',
                            name: 'Special Allowance',
                            type: 'earning',
                            calcType: 'fixed',
                            amount: (monthlyWage - basic - hra).toFixed(2),
                            seq: 3,
                        },
                        {
                            code: 'EMPLOYEE_PF',
                            name: 'Provident Fund (Employee)',
                            type: 'employee_deduction',
                            calcType: 'percentage_of_component',
                            amount: employeePf.toFixed(2),
                            seq: 4,
                        },
                        {
                            code: 'PROFESSIONAL_TAX',
                            name: 'Professional Tax (PT)',
                            type: 'employee_deduction',
                            calcType: 'fixed',
                            amount: profTax.toFixed(2),
                            seq: 5,
                        },
                    ];

                    for (const l of lines) {
                        await db.insert(payslipLines).values({
                            payslipId: slip.id,
                            componentCode: l.code,
                            componentName: l.name,
                            componentType: l.type,
                            calculationType: l.calcType,
                            amount: l.amount,
                            sequence: l.seq,
                        });
                    }
                }
            }
        }
        console.log(
            `✅ Seeded July 2026 Finalized Payroll Run with Payslip Snapshots and Itemized Lines`,
        );

        // 14. Sample In-App Notifications
        const sampleNotifications = [
            {
                title: 'Company All-Hands Meeting',
                message:
                    'Quarterly All-Hands meeting scheduled for Friday at 4:00 PM IST in the Main Town Hall.',
                type: 'general',
            },
            {
                title: 'July 2026 Payslips Published',
                message:
                    'Your salary payslip for July 2026 is now available for view and download.',
                type: 'payslip_finalized',
            },
            {
                title: 'Tax Declaration Window Open',
                message:
                    'Please upload your Section 80C and medical insurance investment proofs before month-end.',
                type: 'system_alert',
            },
        ];

        for (const { user } of seededEmployees) {
            for (const notif of sampleNotifications) {
                const [existingNotif] = await db
                    .select()
                    .from(notifications)
                    .where(
                        and(
                            eq(notifications.userId, user.id),
                            eq(notifications.title, notif.title),
                        ),
                    )
                    .limit(1);

                if (!existingNotif) {
                    await db.insert(notifications).values({
                        userId: user.id,
                        type: notif.type,
                        title: notif.title,
                        message: notif.message,
                        referenceType: 'SYSTEM_BROADCAST',
                        isRead: false,
                    });
                }
            }
        }
        console.log(`✅ Seeded Broadcast & System Notifications across Employees`);

        // 15. Sample Audit Logs
        if (adminUser) {
            const auditEvents = [
                { action: 'UPDATE_PAYROLL_SETTINGS', entityType: 'ORGANIZATION', entityId: org.id },
                {
                    action: 'CREATE_LOCATION',
                    entityType: 'LOCATION',
                    entityId: locationMap['Bengaluru Tech Center - Manyata Park'].id,
                },
                {
                    action: 'CREATE_WORK_SCHEDULE',
                    entityType: 'WORK_SCHEDULE',
                    entityId: standardSchedule.id,
                },
            ];

            for (const event of auditEvents) {
                await db.insert(auditLogs).values({
                    organizationId: org.id,
                    actorUserId: adminUser.id,
                    action: event.action,
                    entityType: event.entityType,
                    entityId: event.entityId,
                    newData: { status: 'SUCCESS' },
                    ipAddress: '127.0.0.1',
                    userAgent: 'Dayflow Admin Console v1.0',
                });
            }
        }
        console.log(`✅ Seeded Representative Audit Trail Records`);

        console.log('\n===============================================================');
        console.log('🎉 REALISTIC INDIAN HRMS DATA SEEDING COMPLETE!');
        console.log('===============================================================');
        console.log('🏢 Company:       Dayflow Technologies India Pvt. Ltd. (OI)');
        console.log('👥 Employees:     15 Indian Profiles across Exec, Eng, HR, Fin, Sales, Mktg');
        console.log('📅 Attendance:    Past 7 Days Logs & Real Check-In Sessions');
        console.log('🌴 Leaves:        CL, SL, PL + Approved & Pending Requests');
        console.log('💰 Payroll:       July 2026 Run with Itemized Payslips & PF/PT');
        console.log('---------------------------------------------------------------');
        console.log('🔑 TEST LOGIN CREDENTIALS (Password for all: Admin@123):');
        console.log('   1. ADMIN:    admin@example.com    (Aarav Sharma - CTO)');
        console.log('   2. HR:       hr@example.com       (Priya Nair - Head of HR)');
        console.log('   3. HR:       ananya.d@example.com (Ananya Deshmukh - HR Ops)');
        console.log('   4. EMPLOYEE: employee@example.com (Aman Yadav - Sr. Full Stack)');
        console.log('   5. EMPLOYEE: vikram.roy@example.com (Vikramaditya Roy - Lead)');
        console.log('===============================================================\n');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seed().catch((err) => {
    console.error('Fatal seed failure:', err);
    process.exit(1);
});
