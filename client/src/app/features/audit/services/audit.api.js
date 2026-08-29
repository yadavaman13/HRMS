import axios from 'axios';

const auditApiInstance = axios.create({
    baseURL: '/api/audit-logs',
    withCredentials: true,
});

export async function fetchAuditLogs(params = {}) {
    const response = await auditApiInstance.get('/', { params });
    return response.data;
}

export async function fetchAuditStats() {
    const response = await auditApiInstance.get('/stats');
    return response.data;
}
