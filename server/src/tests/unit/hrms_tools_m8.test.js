import { jest } from '@jest/globals';

const mockListLeaveTypes = jest.fn();
const mockGetEmployeeLeaveBalances = jest.fn();
const mockCheckLeaveOverlap = jest.fn();
const mockCreateLeaveRequest = jest.fn();
const mockCreateAuditLog = jest.fn();

const actualLeaveDao = await import('../../dao/leave.dao.js');
jest.unstable_mockModule('../../dao/leave.dao.js', async () => ({
    ...actualLeaveDao,
    listLeaveTypes: mockListLeaveTypes,
    getEmployeeLeaveBalances: mockGetEmployeeLeaveBalances,
    checkLeaveOverlap: mockCheckLeaveOverlap,
    createLeaveRequest: mockCreateLeaveRequest,
}));

const actualAuditDao = await import('../../dao/audit.dao.js');
jest.unstable_mockModule('../../dao/audit.dao.js', async () => ({
    ...actualAuditDao,
    createAuditLog: mockCreateAuditLog,
}));

const { createHrmsTools } = await import('../../services/ai/hrms-tools/index.js');
const { createCreateLeaveRequestTool } =
    await import('../../services/ai/hrms-tools/leave/create_leave_request.tool.js');
const redisClient = (await import('../../config/cache.config.js')).default;

describe('Milestone 8 - HRMS Tools & Safe Leave Mutation', () => {
    const mockOrgId = '11111111-1111-4111-a111-111111111111';
    const mockEmpId = '22222222-2222-4222-a222-222222222222';
    const mockUserId = '33333333-3333-4333-a333-333333333333';
    const mockLeaveTypeId = '44444444-4444-4444-a444-444444444444';

    describe('createHrmsTools registry factory', () => {
        it('should register exactly 18 approved tools with correct names', () => {
            const context = {
                organizationId: mockOrgId,
                employeeId: mockEmpId,
                userId: mockUserId,
                role: 'hr',
            };
            const tools = createHrmsTools(context);

            expect(tools).toHaveLength(18);

            const toolNames = tools.map((t) => t.name);
            const expectedTools = [
                'search_employees',
                'get_employee_profile',
                'search_employee_skills',
                'get_employee_schedule',
                'get_attendance',
                'analyze_attendance',
                'get_attendance_anomalies',
                'get_attendance_adjustment_history',
                'get_leave_balance',
                'search_leave_requests',
                'get_team_availability',
                'create_leave_request',
                'get_payslip',
                'compare_payslips',
                'analyze_payroll',
                'get_payroll_status',
                'get_hr_dashboard',
                'get_audit_history',
            ];

            expect(toolNames).toEqual(expectedTools);
            for (const tool of tools) {
                expect(tool.name).toBeDefined();
                expect(tool.description).toBeDefined();
                expect(typeof tool.invoke).toBe('function');
            }
        });
    });

    describe('create_leave_request two-phase mutation tool', () => {
        beforeEach(() => {
            mockListLeaveTypes.mockReset().mockResolvedValue([
                {
                    id: mockLeaveTypeId,
                    name: 'Casual Leave',
                    code: 'CL',
                    isActive: true,
                    requiresAllocation: true,
                },
            ]);

            mockGetEmployeeLeaveBalances.mockReset().mockResolvedValue([
                {
                    leaveTypeId: mockLeaveTypeId,
                    name: 'Casual Leave',
                    remaining: 10,
                    availableBalance: 10,
                },
            ]);

            mockCheckLeaveOverlap.mockReset().mockResolvedValue(null);
            mockCreateLeaveRequest.mockReset().mockResolvedValue({ id: 'leave-req-1' });
            mockCreateAuditLog.mockReset().mockResolvedValue({ id: 'audit-1' });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should deny role=user with FORBIDDEN', async () => {
            const tool = createCreateLeaveRequestTool({
                organizationId: mockOrgId,
                userId: mockUserId,
                role: 'user',
            });

            const result = JSON.parse(
                await tool.invoke({
                    confirmed: false,
                    leaveTypeId: mockLeaveTypeId,
                    startDate: '2026-09-01',
                    endDate: '2026-09-02',
                }),
            );

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('FORBIDDEN');
        });

        it('should reject employee role with no employeeId record', async () => {
            const tool = createCreateLeaveRequestTool({
                organizationId: mockOrgId,
                userId: mockUserId,
                role: 'employee',
                employeeId: null,
            });

            const result = JSON.parse(
                await tool.invoke({
                    confirmed: false,
                    leaveTypeId: mockLeaveTypeId,
                    startDate: '2026-09-01',
                    endDate: '2026-09-02',
                }),
            );

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('NOT_AN_EMPLOYEE');
        });

        it('should validate invalid date ranges (start > end)', async () => {
            const tool = createCreateLeaveRequestTool({
                organizationId: mockOrgId,
                userId: mockUserId,
                role: 'employee',
                employeeId: mockEmpId,
            });

            const result = JSON.parse(
                await tool.invoke({
                    confirmed: false,
                    leaveTypeId: mockLeaveTypeId,
                    startDate: '2026-09-05',
                    endDate: '2026-09-01',
                }),
            );

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('INVALID_DATE_RANGE');
        });

        it('should reject when leave type is not found', async () => {
            const tool = createCreateLeaveRequestTool({
                organizationId: mockOrgId,
                userId: mockUserId,
                role: 'employee',
                employeeId: mockEmpId,
            });

            mockListLeaveTypes.mockResolvedValue([]);

            const result = JSON.parse(
                await tool.invoke({
                    confirmed: false,
                    leaveTypeId: mockLeaveTypeId,
                    startDate: '2026-09-01',
                    endDate: '2026-09-02',
                }),
            );

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('NOT_FOUND');
        });

        it('should reject overlapping leaves with OVERLAPPING_LEAVE', async () => {
            const tool = createCreateLeaveRequestTool({
                organizationId: mockOrgId,
                userId: mockUserId,
                role: 'employee',
                employeeId: mockEmpId,
            });

            mockCheckLeaveOverlap.mockResolvedValue({
                id: 'req-existing',
                status: 'approved',
                startDate: '2026-09-01',
                endDate: '2026-09-03',
            });

            const result = JSON.parse(
                await tool.invoke({
                    confirmed: false,
                    leaveTypeId: mockLeaveTypeId,
                    startDate: '2026-09-01',
                    endDate: '2026-09-02',
                }),
            );

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('OVERLAPPING_LEAVE');
        });

        it('should reject insufficient leave balance with INSUFFICIENT_BALANCE', async () => {
            const tool = createCreateLeaveRequestTool({
                organizationId: mockOrgId,
                userId: mockUserId,
                role: 'employee',
                employeeId: mockEmpId,
            });

            mockGetEmployeeLeaveBalances.mockResolvedValue([
                {
                    leaveTypeId: mockLeaveTypeId,
                    name: 'Casual Leave',
                    remaining: 1,
                    availableBalance: 1,
                },
            ]);

            const result = JSON.parse(
                await tool.invoke({
                    confirmed: false,
                    leaveTypeId: mockLeaveTypeId,
                    startDate: '2026-09-01',
                    endDate: '2026-09-05', // 5 days requested > 1 remaining
                }),
            );

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('INSUFFICIENT_BALANCE');
        });

        it('should generate preview in Phase 1 and allow atomic confirmation in Phase 2', async () => {
            const tool = createCreateLeaveRequestTool({
                organizationId: mockOrgId,
                userId: mockUserId,
                role: 'employee',
                employeeId: mockEmpId,
            });

            // Phase 1: Preview
            const previewRes = JSON.parse(
                await tool.invoke({
                    confirmed: false,
                    leaveTypeId: mockLeaveTypeId,
                    startDate: '2026-09-01',
                    endDate: '2026-09-03',
                    reason: 'Family trip',
                }),
            );

            expect(previewRes.success).toBe(true);
            expect(previewRes.data.previewId).toBeDefined();
            const { previewId, preview } = previewRes.data;
            expect(preview.requestedDays).toBe(3);
            expect(preview.balanceBefore).toBe(10);
            expect(preview.balanceAfter).toBe(7);
            expect(preview.leaveTypeName).toBe('Casual Leave');

            // Check redis key
            const rawStored = await redisClient.get(`hrms:leave_preview:${previewId}`);
            expect(rawStored).toBeTruthy();

            // Phase 2: Confirm
            const confirmRes = JSON.parse(
                await tool.invoke({
                    confirmed: true,
                    previewId,
                }),
            );

            expect(confirmRes.success).toBe(true);
            expect(confirmRes.data.message).toBe('Leave request submitted successfully.');
            expect(mockCreateLeaveRequest).toHaveBeenCalledTimes(1);
            expect(mockCreateAuditLog).toHaveBeenCalledTimes(1);

            // Verify idempotency: key deleted from Redis
            const postConfirmKey = await redisClient.get(`hrms:leave_preview:${previewId}`);
            expect(postConfirmKey).toBeNull();

            // Re-attempting confirmation gets ALREADY_PROCESSED
            const reconfirmRes = JSON.parse(
                await tool.invoke({
                    confirmed: true,
                    previewId,
                }),
            );
            expect(reconfirmRes.success).toBe(false);
            expect(reconfirmRes.error.code).toBe('ALREADY_PROCESSED');
        });

        it('should reject confirm if preview belongs to different organization', async () => {
            const previewId = '55555555-5555-4555-a555-555555555555';
            const fakePreview = {
                previewId,
                organizationId: 'other-org-id',
                employeeId: mockEmpId,
                leaveTypeId: mockLeaveTypeId,
                startDate: '2026-09-01',
                endDate: '2026-09-02',
                requestedDays: 2,
            };

            await redisClient.setex(
                `hrms:leave_preview:${previewId}`,
                300,
                JSON.stringify(fakePreview),
            );

            const tool = createCreateLeaveRequestTool({
                organizationId: mockOrgId,
                userId: mockUserId,
                role: 'hr',
            });

            const result = JSON.parse(
                await tool.invoke({
                    confirmed: true,
                    previewId,
                }),
            );

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('FORBIDDEN');

            await redisClient.del(`hrms:leave_preview:${previewId}`);
        });
    });
});
