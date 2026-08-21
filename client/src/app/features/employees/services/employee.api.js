import axios from 'axios';

const employeeApiInstance = axios.create({
    baseURL: '/api/employees',
    withCredentials: true,
});

const profileApiInstance = axios.create({
    baseURL: '/api/profile',
    withCredentials: true,
});

export async function listEmployees(params = {}) {
    const response = await employeeApiInstance.get('/', { params });
    return response.data;
}

export async function getEmployeeById(employeeId) {
    const response = await employeeApiInstance.get(`/${employeeId}`);
    return response.data;
}

export async function createEmployee(data) {
    const response = await employeeApiInstance.post('/', data);
    return response.data;
}

export async function updateEmployee(employeeId, data) {
    const response = await employeeApiInstance.patch(`/${employeeId}`, data);
    return response.data;
}

export async function deleteEmployee(employeeId) {
    const response = await employeeApiInstance.delete(`/${employeeId}`);
    return response.data;
}

export async function activateAccount(employeeId) {
    const response = await employeeApiInstance.post(`/${employeeId}/activate`);
    return response.data;
}

export async function deactivateAccount(employeeId) {
    const response = await employeeApiInstance.post(`/${employeeId}/deactivate`);
    return response.data;
}

export async function resetEmployeePassword(employeeId) {
    const response = await employeeApiInstance.post(`/${employeeId}/reset-password`);
    return response.data;
}

export async function getEmployeeProfile(employeeId) {
    const response = await employeeApiInstance.get(`/${employeeId}/profile`);
    return response.data;
}

export async function getPrivateInfo(employeeId) {
    const response = await employeeApiInstance.get(`/${employeeId}/private-info`);
    return response.data;
}

export async function updatePrivateInfo(employeeId, data) {
    const response = await employeeApiInstance.patch(`/${employeeId}/private-info`, data);
    return response.data;
}

export async function updateBankAccount(employeeId, data) {
    const response = await employeeApiInstance.patch(`/${employeeId}/bank-account`, data);
    return response.data;
}

export async function updateIdentifiers(employeeId, data) {
    const response = await employeeApiInstance.patch(`/${employeeId}/identifiers`, data);
    return response.data;
}

export async function getMyProfile() {
    const response = await profileApiInstance.get('/me');
    return response.data;
}

export async function updateMyProfile(data) {
    const response = await profileApiInstance.patch('/me', data);
    return response.data;
}

export async function getMyPrivateInfo() {
    const response = await profileApiInstance.get('/me/private-info');
    return response.data;
}

export async function updateMyPrivateInfo(data) {
    const response = await profileApiInstance.patch('/me/private-info', data);
    return response.data;
}

export async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await profileApiInstance.post('/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}
