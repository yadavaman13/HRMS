import axios from 'axios';

const dashboardApiInstance = axios.create({
    baseURL: '/api/dashboard',
    withCredentials: true,
});

export async function fetchDashboardOverview() {
    const response = await dashboardApiInstance.get('/');
    return response.data;
}

export async function fetchAdminDashboard() {
    const response = await dashboardApiInstance.get('/admin');
    return response.data;
}

export async function fetchEmployeeDashboard() {
    const response = await dashboardApiInstance.get('/employee');
    return response.data;
}
