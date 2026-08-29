import axios from 'axios';

const settingsApiInstance = axios.create({
    baseURL: '/api/settings',
    withCredentials: true,
});

const companiesApiInstance = axios.create({
    baseURL: '/api/companies',
    withCredentials: true,
});

// ── Company Master ──────────────────────────────────────────────────────────
export async function fetchCompanyProfile() {
    const response = await companiesApiInstance.get('/current');
    return response.data;
}

export async function updateCompanyProfile(data) {
    const response = await companiesApiInstance.patch('/current', data);
    return response.data;
}

// ── Work Schedules / Shifts ────────────────────────────────────────────────
export async function fetchWorkSchedules() {
    const response = await settingsApiInstance.get('/schedules');
    return response.data;
}

export async function createWorkSchedule(data) {
    const response = await settingsApiInstance.post('/schedules', data);
    return response.data;
}

export async function updateWorkSchedule(scheduleId, data) {
    const response = await settingsApiInstance.patch(`/schedules/${scheduleId}`, data);
    return response.data;
}

export async function deleteWorkSchedule(scheduleId) {
    const response = await settingsApiInstance.delete(`/schedules/${scheduleId}`);
    return response.data;
}

// ── Leave Policies ─────────────────────────────────────────────────────────
export async function fetchLeavePolicies() {
    const response = await settingsApiInstance.get('/leave-types');
    return response.data;
}

export async function createLeavePolicy(data) {
    const response = await settingsApiInstance.post('/leave-types', data);
    return response.data;
}

export async function updateLeavePolicy(policyId, data) {
    const response = await settingsApiInstance.patch(`/leave-types/${policyId}`, data);
    return response.data;
}

export async function deleteLeavePolicy(policyId) {
    const response = await settingsApiInstance.delete(`/leave-types/${policyId}`);
    return response.data;
}

// ── Public Holidays ────────────────────────────────────────────────────────
export async function fetchPublicHolidays(params = {}) {
    const response = await settingsApiInstance.get('/holidays', { params });
    return response.data;
}

export async function createPublicHoliday(data) {
    const response = await settingsApiInstance.post('/holidays', data);
    return response.data;
}

export async function deletePublicHoliday(holidayId) {
    const response = await settingsApiInstance.delete(`/holidays/${holidayId}`);
    return response.data;
}
