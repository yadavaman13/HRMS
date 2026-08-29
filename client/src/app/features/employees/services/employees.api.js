import axios from 'axios';

const employeesApiInstance = axios.create({
    baseURL: '/api/employees',
    withCredentials: true,
});

const profileApiInstance = axios.create({
    baseURL: '/api/profile',
    withCredentials: true,
});

// ── Directory & CRUD ────────────────────────────────────────────────────────
export async function fetchEmployees(params = {}) {
    const response = await employeesApiInstance.get('/', { params });
    return response.data;
}

export async function fetchEmployeeById(employeeId) {
    const response = await employeesApiInstance.get(`/${employeeId}`);
    return response.data;
}

export async function createEmployee(data) {
    const response = await employeesApiInstance.post('/', data);
    return response.data;
}

export async function updateEmployee(employeeId, data) {
    const response = await employeesApiInstance.patch(`/${employeeId}`, data);
    return response.data;
}

export async function deleteEmployee(employeeId) {
    const response = await employeesApiInstance.delete(`/${employeeId}`);
    return response.data;
}

// ── Account Lifecycle (Admin/HR) ────────────────────────────────────────────
export async function activateEmployee(employeeId) {
    const response = await employeesApiInstance.post(`/${employeeId}/activate`);
    return response.data;
}

export async function deactivateEmployee(employeeId) {
    const response = await employeesApiInstance.post(`/${employeeId}/deactivate`);
    return response.data;
}

export async function resetEmployeePassword(employeeId) {
    const response = await employeesApiInstance.post(`/${employeeId}/reset-password`);
    return response.data;
}

// ── Profile & Private Info (Admin/HR View) ──────────────────────────────────
export async function fetchEmployeeProfile(employeeId) {
    const response = await employeesApiInstance.get(`/${employeeId}/profile`);
    return response.data;
}

export async function updateEmployeeProfile(employeeId, data) {
    const response = await employeesApiInstance.patch(`/${employeeId}/profile`, data);
    return response.data;
}

export async function fetchPrivateInfo(employeeId) {
    const response = await employeesApiInstance.get(`/${employeeId}/private-info`);
    return response.data;
}

export async function updatePrivateInfo(employeeId, data) {
    const response = await employeesApiInstance.patch(`/${employeeId}/private-info`, data);
    return response.data;
}

export async function updateBankAccount(employeeId, data) {
    const response = await employeesApiInstance.patch(`/${employeeId}/bank-account`, data);
    return response.data;
}

export async function updateIdentifiers(employeeId, data) {
    const response = await employeesApiInstance.patch(`/${employeeId}/identifiers`, data);
    return response.data;
}

// ── Self-Service Profile (/api/profile/me) ─────────────────────────────────
export async function fetchMyProfile() {
    const response = await profileApiInstance.get('/me');
    return response.data;
}

export async function updateMyProfile(data) {
    const response = await profileApiInstance.patch('/me', data);
    return response.data;
}

export async function uploadMyAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await profileApiInstance.post('/me/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function deleteMyAvatar() {
    const response = await profileApiInstance.delete('/me/avatar');
    return response.data;
}

export async function fetchMyPrivateInfo() {
    const response = await profileApiInstance.get('/me/private-info');
    return response.data;
}

export async function updateMyPrivateInfo(data) {
    const response = await profileApiInstance.patch('/me/private-info', data);
    return response.data;
}
