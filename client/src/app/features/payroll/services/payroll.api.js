import axios from 'axios';

const payrollApiInstance = axios.create({
    baseURL: '/api/payroll',
    withCredentials: true,
});

// ── Salary Structure ────────────────────────────────────────────────────────
export async function fetchSalaryStructure(employeeId) {
    const response = await payrollApiInstance.get(`/salary-structure/${employeeId}`);
    return response.data;
}

export async function updateSalaryStructure(employeeId, data) {
    const response = await payrollApiInstance.put(`/salary-structure/${employeeId}`, data);
    return response.data;
}

// ── Payroll Periods & Calculation ───────────────────────────────────────────
export async function fetchPayrollPeriods() {
    const response = await payrollApiInstance.get('/periods');
    return response.data;
}

export async function createPayrollPeriod(data) {
    const response = await payrollApiInstance.post('/periods', data);
    return response.data;
}

export async function calculatePayroll(periodId) {
    const response = await payrollApiInstance.post(`/periods/${periodId}/calculate`);
    return response.data;
}

export async function lockPayroll(periodId) {
    const response = await payrollApiInstance.post(`/periods/${periodId}/lock`);
    return response.data;
}

export async function unlockPayroll(periodId) {
    const response = await payrollApiInstance.post(`/periods/${periodId}/unlock`);
    return response.data;
}

export async function markPayrollPaid(periodId) {
    const response = await payrollApiInstance.post(`/periods/${periodId}/mark-paid`);
    return response.data;
}

export async function fetchPayrollBatches(periodId) {
    const response = await payrollApiInstance.get(`/periods/${periodId}/batches`);
    return response.data;
}

// ── Payslips ────────────────────────────────────────────────────────────────
export async function fetchMyPayslips() {
    const response = await payrollApiInstance.get('/payslips/me');
    return response.data;
}

export async function fetchPayslipById(payslipId) {
    const response = await payrollApiInstance.get(`/payslips/${payslipId}`);
    return response.data;
}

export async function downloadPayslipPDF(payslipId) {
    const response = await payrollApiInstance.get(`/payslips/${payslipId}/pdf`, {
        responseType: 'blob',
    });
    return response.data;
}
