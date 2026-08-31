import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { getAuditLogs, getAuditLogsByEntity } from '../../../../dao/audit.dao.js';

export function createGetAuditHistoryTool(hrmsContext) {
    return tool(
        async ({ entityType, entityId, actorUserId, startDate, endDate, limit = 20 }) => {
            if (hrmsContext.role === 'employee' || hrmsContext.role === 'user')
                return toolError('FORBIDDEN', 'Audit history restricted to HR and Admin.');
            if (entityId && entityType) {
                const logs = await getAuditLogsByEntity(entityType, entityId, Math.min(limit, 50));
                return toolSuccess({ logs, total: logs.length });
            }
            const result = await getAuditLogs({
                organizationId: hrmsContext.organizationId,
                entityType,
                actorUserId,
                startDate,
                endDate,
                limit: Math.min(limit, 50),
            });
            return toolSuccess(result);
        },
        {
            name: 'get_audit_history',
            description:
                'Audit log trail for sensitive HRMS actions (salary changes, payroll locks, approvals). HR/Admin only.',
            schema: z.object({
                entityType: z.string().optional(),
                entityId: z.string().uuid().optional(),
                actorUserId: z.string().uuid().optional(),
                startDate: z.string().optional(),
                endDate: z.string().optional(),
                limit: z.number().int().min(1).max(50).default(20).optional(),
            }),
        },
    );
}
