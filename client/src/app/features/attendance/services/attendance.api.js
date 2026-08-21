import axios from 'axios';

const attendanceApiInstance = axios.create({
    baseURL: '/api/attendance',
    withCredentials: true,
});

export async function checkIn(data = {}) {
    const response = await attendanceApiInstance.post('/check-in', data);
    return response.data;
}

export async function checkOut(data = {}) {
    const response = await attendanceApiInstance.post('/check-out', data);
    return response.data;
}

export async function getMyAttendance(params = {}) {
    const response = await attendanceApiInstance.get('/me', { params });
    return response.data;
}

export async function getMySummary() {
    const response = await attendanceApiInstance.get('/me/summary');
    return response.data;
}

export async function getCompanySummary() {
    const response = await attendanceApiInstance.get('/summary');
    return response.data;
}

export async function getAttendanceRecords(params = {}) {
    const response = await attendanceApiInstance.get('/', { params });
    return response.data;
}

export async function getEmployeeAttendance(employeeId, params = {}) {
    const response = await attendanceApiInstance.get(`/employee/${employeeId}`, { params });
    return response.data;
}

export async function requestAdjustment(attendanceId, data) {
    const response = await attendanceApiInstance.post(`/${attendanceId}/adjust`, data);
    return response.data;
}

export async function getMyAdjustments() {
    const response = await attendanceApiInstance.get('/adjustments/me');
    return response.data;
}

export async function getAdjustments(params = {}) {
    const response = await attendanceApiInstance.get('/adjustments', { params });
    return response.data;
}

export async function reviewAdjustment(adjustmentId, data) {
    const response = await attendanceApiInstance.patch(`/adjustments/${adjustmentId}`, data);
    return response.data;
}
