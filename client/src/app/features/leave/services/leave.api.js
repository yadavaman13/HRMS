import axios from 'axios';

const leaveApiInstance = axios.create({
    baseURL: '/api/leave',
    withCredentials: true,
});

export async function fetchLeaveTypes() {
    const response = await leaveApiInstance.get('/types');
    return response.data;
}

export async function fetchMyLeaveBalances() {
    const response = await leaveApiInstance.get('/balances');
    return response.data;
}

export async function fetchMyLeaveRequests(params = {}) {
    const response = await leaveApiInstance.get('/requests/me', { params });
    return response.data;
}

export async function applyLeaveRequest(data) {
    const response = await leaveApiInstance.post('/requests', data);
    return response.data;
}

export async function cancelMyLeaveRequest(leaveRequestId) {
    const response = await leaveApiInstance.delete(`/requests/${leaveRequestId}`);
    return response.data;
}

export async function fetchLeaveApprovalQueue(params = {}) {
    const response = await leaveApiInstance.get('/requests', { params });
    return response.data;
}

export async function reviewLeaveRequest(leaveRequestId, data) {
    const response = await leaveApiInstance.patch(`/requests/${leaveRequestId}`, data);
    return response.data;
}

export async function fetchLeaveDistribution(params = {}) {
    const response = await leaveApiInstance.get('/distribution', { params });
    return response.data;
}
