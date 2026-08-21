import * as payrollDao from '../../../dao/payroll.dao.js';
import * as employeeDao from '../../../dao/employee.dao.js';
import * as payrollService from '../../../services/payroll.service.js';
import { sendResponse, sendPdfResponse } from '../../../utils/response.utlis.js';
import { db } from '../../../config/database.config.js';

// ── Payroll Settings Controllers ─────────────────────────────────────────────

export async function getSettings(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        let settings = await payrollDao.getPayrollSettings(organizationId);
        if (!settings) {
            // Return empty settings or defaults
            settings = {
                organizationId,
                payrollFrequency: 'MONTHLY',
                payrollCurrency: 'INR',
                payDay: 1,
                workingDaysBasis: 22,
                pfEnabled: true,
                employeePfRate: 12.0,
                employerPfRate: 12.0,
                professionalTaxEnabled: true,
                professionalTaxAmount: 200.0,
            };
        }
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payroll settings retrieved successfully',
            success: true,
            data: { settings },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateSettings(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        const existing = await payrollDao.getPayrollSettings(organizationId);

        let settings;
        if (existing) {
            settings = await payrollDao.updatePayrollSettings(organizationId, req.body);
        } else {
            settings = await payrollDao.createPayrollSettings({
                ...req.body,
                organizationId,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payroll settings updated successfully',
            success: true,
            data: { settings },
        });
    } catch (error) {
        next(error);
    }
}

// ── Salary Component Definition Controllers ──────────────────────────────────

export async function listComponents(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        const components = await payrollDao.listComponentDefinitions(organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Component definitions retrieved successfully',
            success: true,
            data: { components },
        });
    } catch (error) {
        next(error);
    }
}

export async function createComponent(req, res, next) {
    try {
        const organizationId = req.user.organizationId;

        // Check if component code already exists
        const existing = await payrollDao.getComponentDefinitionByCode(
            organizationId,
            req.body.code,
        );
        if (existing) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Component definition with code ${req.body.code} already exists`,
                success: false,
            });
        }

        const component = await payrollDao.createComponentDefinition({
            ...req.body,
            organizationId,
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Component definition created successfully',
            success: true,
            data: { component },
        });
    } catch (error) {
        next(error);
    }
}

// ── Salary Structure Controllers ─────────────────────────────────────────────

export async function getSalaryStructure(req, res, next) {
    try {
        const { employeeId } = req.params;

        // 1. Fetch employee to verify ownership/access
        const employee = await employeeDao.getEmployeeById(employeeId);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        // 2. Validate role access
        if (req.user.role !== 'admin' && req.user.role !== 'hr') {
            if (req.user.id !== employee.userId) {
                return sendResponse({
                    res,
                    statusCode: 403,
                    message: 'You do not have permission to view this salary structure',
                    success: false,
                });
            }
        }

        const structure = await payrollDao.getSalaryStructureByEmployeeId(employeeId);
        if (!structure) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'No active salary structure found for this employee',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Salary structure retrieved successfully',
            success: true,
            data: { structure },
        });
    } catch (error) {
        next(error);
    }
}

export async function setSalaryStructure(req, res, next) {
    try {
        const { employeeId } = req.params;
        const { monthlyWage, wageType, effectiveFrom, components } = req.body;

        const employee = await employeeDao.getEmployeeById(employeeId);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        // Validate components math: sum of earnings shouldn't exceed monthly wage
        const wage = Number(monthlyWage);
        let earningsSum = 0;

        for (const comp of components) {
            // Retrieve component definition to check details
            const def = await payrollDao.getComponentDefinitionById(comp.componentDefinitionId);
            if (!def) {
                return sendResponse({
                    res,
                    statusCode: 400,
                    message: `Invalid componentDefinitionId: ${comp.componentDefinitionId}`,
                    success: false,
                });
            }

            if (def.componentType === 'earning') {
                if (!comp.isResidual) {
                    let amount = 0;
                    if (comp.calculationType === 'fixed') {
                        amount = Number(comp.fixedAmount) || 0;
                    } else if (comp.calculationType === 'percentage_of_wage') {
                        amount = wage * (Number(comp.percentage) / 100);
                    }
                    earningsSum += amount;
                }
            }
        }

        if (earningsSum > wage) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Sum of earnings components (${earningsSum}) exceeds the monthly wage (${wage})`,
                success: false,
            });
        }

        // Save structure in a transaction to preserve history
        await db.transaction(async (tx) => {
            // Deactivate existing active structure
            const active = await payrollDao.getSalaryStructureByEmployeeId(employeeId, tx);
            if (active) {
                await payrollDao.updateSalaryStructure(
                    active.id,
                    {
                        status: 'INACTIVE',
                        effectiveTo: effectiveFrom,
                    },
                    tx,
                );
            }

            // Create new structure
            const structure = await payrollDao.createSalaryStructure(
                {
                    employeeId,
                    monthlyWage: String(monthlyWage),
                    wageType: wageType || 'fixed',
                    effectiveFrom,
                    status: 'ACTIVE',
                    createdBy: req.user.id,
                },
                tx,
            );

            // Add components
            const componentsData = components.map((comp, idx) => ({
                salaryStructureId: structure.id,
                componentDefinitionId: comp.componentDefinitionId,
                calculationType: comp.calculationType,
                calculationBase: comp.calculationBase || null,
                percentage: comp.percentage ? String(comp.percentage) : null,
                fixedAmount: comp.fixedAmount ? String(comp.fixedAmount) : '0.00',
                sequence: comp.sequence ?? idx,
                isResidual: !!comp.isResidual,
            }));

            await payrollDao.createSalaryStructureComponents(componentsData, tx);
            return structure;
        });

        const fullStructure = await payrollDao.getSalaryStructureByEmployeeId(employeeId);

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Salary structure updated successfully',
            success: true,
            data: { structure: fullStructure },
        });
    } catch (error) {
        next(error);
    }
}

// ── Payroll Period Controllers ───────────────────────────────────────────────

export async function listPeriods(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        const periods = await payrollDao.listPayrollPeriods(organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payroll periods retrieved successfully',
            success: true,
            data: { periods },
        });
    } catch (error) {
        next(error);
    }
}

export async function createPeriod(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        const { periodStart, periodEnd } = req.body;

        const period = await payrollDao.createPayrollPeriod({
            organizationId,
            periodStart,
            periodEnd,
            status: 'draft',
            createdBy: req.user.id,
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Payroll period created successfully',
            success: true,
            data: { period },
        });
    } catch (error) {
        next(error);
    }
}

export async function processPeriod(req, res, next) {
    try {
        const { id } = req.params;
        const period = await payrollService.processPayrollPeriod(id, req.user.id);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payroll period processed and payslips calculated successfully',
            success: true,
            data: { period },
        });
    } catch (error) {
        next(error);
    }
}

export async function finalizePeriod(req, res, next) {
    try {
        const { id } = req.params;
        const period = await payrollService.finalizePayrollPeriod(id, req.user.id);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payroll period finalized successfully',
            success: true,
            data: { period },
        });
    } catch (error) {
        next(error);
    }
}

// ── Payslip Controllers ──────────────────────────────────────────────────────

export async function listPayslips(req, res, next) {
    try {
        const { payrollPeriodId, employeeId } = req.query;

        if (req.user.role !== 'admin' && req.user.role !== 'hr') {
            // Find current user's employee record
            const employee = await employeeDao.getEmployeeByUserId(req.user.id);
            if (!employee) {
                return sendResponse({
                    res,
                    statusCode: 404,
                    message: 'No employee record linked to this user account',
                    success: false,
                });
            }
            const payslipsList = await payrollDao.listPayslipsByEmployee(employee.id);
            return sendResponse({
                res,
                statusCode: 200,
                message: 'My payslips retrieved successfully',
                success: true,
                data: { payslips: payslipsList },
            });
        }

        // Admin / HR can list by period or employee
        let payslipsList = [];
        if (payrollPeriodId) {
            payslipsList = await payrollDao.listPayslipsByPeriod(payrollPeriodId);
        } else if (employeeId) {
            payslipsList = await payrollDao.listPayslipsByEmployee(employeeId);
        } else {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Please provide either payrollPeriodId or employeeId query parameter',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payslips retrieved successfully',
            success: true,
            data: { payslips: payslipsList },
        });
    } catch (error) {
        next(error);
    }
}

export async function getPayslipDetails(req, res, next) {
    try {
        const { id } = req.params;

        const payslip = await payrollDao.getPayslipById(id);
        if (!payslip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Payslip not found',
                success: false,
            });
        }

        // Auth check
        if (req.user.role !== 'admin' && req.user.role !== 'hr') {
            const employee = await employeeDao.getEmployeeByUserId(req.user.id);
            if (!employee || employee.id !== payslip.employeeId) {
                return sendResponse({
                    res,
                    statusCode: 403,
                    message: 'You do not have permission to view this payslip',
                    success: false,
                });
            }
        }

        const lines = await payrollDao.getPayslipLines(id);
        const attendanceSummary = await payrollDao.getPayslipAttendanceSummary(id);
        const employee = await employeeDao.getEmployeeById(payslip.employeeId, true);
        const period = await payrollDao.getPayrollPeriodById(payslip.payrollPeriodId);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payslip details retrieved successfully',
            success: true,
            data: {
                payslip,
                lines,
                attendanceSummary,
                employee: {
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    employeeCode: employee.employeeCode,
                    departmentName: employee.departmentName,
                    jobPositionName: employee.jobPositionName,
                },
                period,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function downloadPayslipPdf(req, res, next) {
    try {
        const { id } = req.params;

        const payslip = await payrollDao.getPayslipById(id);
        if (!payslip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Payslip not found',
                success: false,
            });
        }

        // Auth check
        if (req.user.role !== 'admin' && req.user.role !== 'hr') {
            const employee = await employeeDao.getEmployeeByUserId(req.user.id);
            if (!employee || employee.id !== payslip.employeeId) {
                return sendResponse({
                    res,
                    statusCode: 403,
                    message: 'You do not have permission to download this payslip',
                    success: false,
                });
            }
        }

        const pdfBuffer = await payrollService.getPayslipPdfBuffer(id);
        const isInline = req.query.inline === 'true';

        return sendPdfResponse({
            res,
            pdfBuffer,
            filename: `payslip-${id}.pdf`,
            isInline,
        });
    } catch (error) {
        next(error);
    }
}
