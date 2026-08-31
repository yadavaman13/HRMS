import { tool } from 'langchain';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { getAdminDashboardOverview } from '../../../../dao/dashboard.dao.js';

export function createGetHrDashboardTool(hrmsContext) {
    return tool(
        async () => {
            if (hrmsContext.role === 'employee' || hrmsContext.role === 'user')
                return toolError('FORBIDDEN', 'HR dashboard restricted to HR and Admin.');
            const overview = await getAdminDashboardOverview(hrmsContext.organizationId);
            return toolSuccess(overview);
        },
        {
            name: 'get_hr_dashboard',
            description:
                'Aggregated HR KPIs: headcount, attendance, pending leaves, payroll summary. No arguments. HR/Admin only.',
        },
    );
}
