import axios from 'axios';

const leaveApiInstance = axios.create({
    baseURL: '/api/leave',
    withCredentials: true,
});

export async function getLeaveTypes() {
    const response = await leaveApiInstance.get('/types');
    return response.data;
}

export async function getMyBalances() {
    const response = await leaveApiInstance.get('/balances/me');
    return response.data;
}

export async function getEmployeeBalances(employeeId) {
    const response = await leaveApiInstance.get(`/balances/employee/${employeeId}`);
    return response.data;
}

export async function applyLeave(data) {
    const response = await leaveApiInstance.post('/requests', data);
    return response.data;
}

export async function getMyRequests(params = {}) {
    const response = await leaveApiInstance.get('/requests/me', { params });
    return response.data;
}

export async function cancelLeaveRequest(requestId) {
    const response = await leaveApiInstance.patch(`/requests/${requestId}/cancel`);
    return response.data;
}

export async function getAllRequests(params = {}) {
    const response = await leaveApiInstance.get('/requests', { params });
    return response.data;
}

export async function approveRequest(requestId, data = {}) {
    const response = await leaveApiInstance.post(`/requests/${requestId}/approve`, data);
    return response.data;
}

export async function rejectRequest(requestId, data = {}) {
    const response = await leaveApiInstance.post(`/requests/${requestId}/reject`, data);
    return response.data;
}

export async function getMyTransactions() {
    const response = await leaveApiInstance.get('/transactions/me');
    return response.data;
}
