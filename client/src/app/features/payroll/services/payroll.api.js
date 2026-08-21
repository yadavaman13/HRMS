import axios from 'axios';

const payrollApiInstance = axios.create({
    baseURL: '/api/payroll',
    withCredentials: true,
});

export async function getPayrollSettings() {
    const response = await payrollApiInstance.get('/settings');
    return response.data;
}

export async function updatePayrollSettings(data) {
    const response = await payrollApiInstance.post('/settings', data);
    return response.data;
}

export async function listComponents() {
    const response = await payrollApiInstance.get('/components');
    return response.data;
}

export async function createComponent(data) {
    const response = await payrollApiInstance.post('/components', data);
    return response.data;
}

export async function getSalaryStructure(employeeId) {
    const response = await payrollApiInstance.get(`/salary/${employeeId}`);
    return response.data;
}

export async function setSalaryStructure(employeeId, data) {
    const response = await payrollApiInstance.post(`/salary/${employeeId}`, data);
    return response.data;
}

export async function listPeriods() {
    const response = await payrollApiInstance.get('/periods');
    return response.data;
}

export async function createPeriod(data) {
    const response = await payrollApiInstance.post('/periods', data);
    return response.data;
}

export async function processPeriod(periodId) {
    const response = await payrollApiInstance.post(`/periods/${periodId}/process`);
    return response.data;
}

export async function finalizePeriod(periodId) {
    const response = await payrollApiInstance.post(`/periods/${periodId}/finalize`);
    return response.data;
}

export async function listPayslips(params = {}) {
    const response = await payrollApiInstance.get('/payslips', { params });
    return response.data;
}

export async function getPayslipDetails(payslipId) {
    const response = await payrollApiInstance.get(`/payslips/${payslipId}`);
    return response.data;
}

export async function downloadPayslipPdf(payslipId) {
    const response = await payrollApiInstance.get(`/payslips/${payslipId}/download`, {
        responseType: 'blob',
    });
    return response.data;
}
