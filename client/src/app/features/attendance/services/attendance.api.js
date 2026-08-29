import axios from 'axios';

const attendanceApiInstance = axios.create({
    baseURL: '/api/attendance',
    withCredentials: true,
});

export async function checkIn(notes = '') {
    const response = await attendanceApiInstance.post('/check-in', { notes });
    return response.data;
}

export async function checkOut(notes = '') {
    const response = await attendanceApiInstance.post('/check-out', { notes });
    return response.data;
}

export async function fetchMyAttendance(params = {}) {
    const response = await attendanceApiInstance.get('/me', { params });
    return response.data;
}

export async function fetchMySummary() {
    const response = await attendanceApiInstance.get('/me/summary');
    return response.data;
}

export async function fetchCompanyAttendance(params = {}) {
    const response = await attendanceApiInstance.get('/', { params });
    return response.data;
}

export async function fetchCompanySummary() {
    const response = await attendanceApiInstance.get('/summary');
    return response.data;
}

export async function requestAdjustment(attendanceId, data) {
    const response = await attendanceApiInstance.post(`/${attendanceId}/adjust`, data);
    return response.data;
}

export async function fetchMyAdjustments() {
    const response = await attendanceApiInstance.get('/adjustments/me');
    return response.data;
}

export async function fetchAdjustments(params = {}) {
    const response = await attendanceApiInstance.get('/adjustments', { params });
    return response.data;
}

export async function reviewAdjustment(adjustmentId, data) {
    const response = await attendanceApiInstance.patch(`/adjustments/${adjustmentId}`, data);
    return response.data;
}

export async function updateAttendanceRecord(attendanceId, data) {
    const response = await attendanceApiInstance.patch(`/${attendanceId}`, data);
    return response.data;
}
