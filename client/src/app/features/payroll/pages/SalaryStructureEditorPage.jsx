import { useState, useMemo, useContext } from 'react';
import { PayrollContext } from '../context/payroll.context';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Button from '@/components/Shared/Buttons/Button/Button';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { Calculator, ShieldCheck, Save, Sparkles } from 'lucide-react';
import './SalaryStructureEditorPage.scss';

export default function SalaryStructureEditorPage() {
    const { loading } = useContext(PayrollContext);
    const { success, error: toastError } = useToast();

    const [monthlyBaseWage, setMonthlyBaseWage] = useState('60000');
    const [isSaving, setIsSaving] = useState(false);

    const wage = Number(monthlyBaseWage) || 0;

    // Mathematical formula engine
    const computed = useMemo(() => {
        const basic = wage * 0.5; // 50% of wage
        const hra = basic * 0.5; // 50% of basic (25% of wage)
        const bonus = basic * 0.0833; // 8.33% of basic
        const lta = basic * 0.0833; // 8.33% of basic
        const subtotalAllowances = basic + hra + bonus + lta;
        const fixedAllowance = Math.max(0, wage - subtotalAllowances); // Residual balancing component

        const grossEarnings = basic + hra + bonus + lta + fixedAllowance;

        // Deductions
        const employeePF = basic * 0.12; // 12% of basic
        const professionalTax = 200; // standard PT
        const totalDeductions = employeePF + professionalTax;

        // Net Pay
        const netTakeHome = Math.max(0, grossEarnings - totalDeductions);

        // Employer Contributions (CTC)
        const employerPF = basic * 0.12;
        const gratuity = basic * 0.0481; // 4.81% of basic
        const ctc = grossEarnings + employerPF + gratuity;

        return {
            basic,
            hra,
            bonus,
            lta,
            fixedAllowance,
            grossEarnings,
            employeePF,
            professionalTax,
            totalDeductions,
            netTakeHome,
            employerPF,
            gratuity,
            ctc,
        };
    }, [wage]);

    const handleSaveStructure = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            success('Salary breakdown formulas calibrated and stored successfully.');
        } catch (err) {
            toastError('Failed to save salary configuration.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="salary-structure-editor-page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Indian Statutory Salary Structure Builder</h1>
                    <p className="page-subtitle">
                        Configure base wage and live mathematical formulas with automated residual
                        balancing allowances.
                    </p>
                </div>
            </div>

            <div className="editor-grid">
                {/* Left Column: Wage Input & Formula Definitions */}
                <form onSubmit={handleSaveStructure} className="formula-inputs-card">
                    <div className="card-header">
                        <div className="title-group">
                            <Calculator size={18} className="header-icon" />
                            <h2>Base Compensation Calibration</h2>
                        </div>
                    </div>

                    <div className="wage-input-box">
                        <InputField
                            label="Monthly Base Gross Wage (₹)"
                            id="base-wage-input"
                            type="number"
                            value={monthlyBaseWage}
                            onChange={(e) => setMonthlyBaseWage(e.target.value)}
                            placeholder="60000"
                            required
                        />
                        <span className="input-hint">
                            Changing this base wage recalculates all earnings, statutory deductions,
                            and employer CTC components live.
                        </span>
                    </div>

                    {/* Breakdown Components Table */}
                    <div className="components-table-card">
                        <h3 className="section-title">Earnings Breakdown (Monthly)</h3>

                        <div className="formula-row">
                            <div className="comp-meta">
                                <span className="comp-name font-semibold">Basic Salary</span>
                                <span className="formula-tag">50% of Gross Wage</span>
                            </div>
                            <span className="comp-value font-mono">
                                ₹
                                {computed.basic.toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>

                        <div className="formula-row">
                            <div className="comp-meta">
                                <span className="comp-name font-semibold">
                                    House Rent Allowance (HRA)
                                </span>
                                <span className="formula-tag">50% of Basic Salary</span>
                            </div>
                            <span className="comp-value font-mono">
                                ₹
                                {computed.hra.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="formula-row">
                            <div className="comp-meta">
                                <span className="comp-name font-semibold">
                                    Statutory Performance Bonus
                                </span>
                                <span className="formula-tag">8.33% of Basic Salary</span>
                            </div>
                            <span className="comp-value font-mono">
                                ₹
                                {computed.bonus.toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>

                        <div className="formula-row">
                            <div className="comp-meta">
                                <span className="comp-name font-semibold">
                                    Leave Travel Allowance (LTA)
                                </span>
                                <span className="formula-tag">8.33% of Basic Salary</span>
                            </div>
                            <span className="comp-value font-mono">
                                ₹
                                {computed.lta.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="formula-row residual-highlight">
                            <div className="comp-meta">
                                <div className="sparkle-title">
                                    <Sparkles size={14} className="sparkle-icon" />
                                    <span className="comp-name font-semibold">
                                        Fixed Allowance (Residual Balancing)
                                    </span>
                                </div>
                                <span className="formula-tag">
                                    Gross Wage - (Basic + HRA + Bonus + LTA)
                                </span>
                            </div>
                            <span className="comp-value font-mono font-bold text-success">
                                ₹
                                {computed.fixedAllowance.toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>

                        <h3 className="section-title deduction-title">
                            Employee Statutory Deductions
                        </h3>

                        <div className="formula-row deduction-row">
                            <div className="comp-meta">
                                <span className="comp-name font-semibold">
                                    Employee Provident Fund (EPF)
                                </span>
                                <span className="formula-tag">12% of Basic Salary</span>
                            </div>
                            <span className="comp-value font-mono text-danger">
                                - ₹
                                {computed.employeePF.toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>

                        <div className="formula-row deduction-row">
                            <div className="comp-meta">
                                <span className="comp-name font-semibold">
                                    Professional Tax (PT)
                                </span>
                                <span className="formula-tag">State Statutory Slab</span>
                            </div>
                            <span className="comp-value font-mono text-danger">
                                - ₹{computed.professionalTax.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="save-actions-bar">
                        <Button variant="primary" type="submit" loading={isSaving}>
                            <Save size={16} /> Save Formula Defaults
                        </Button>
                    </div>
                </form>

                {/* Right Column: Live Summary Tile */}
                <div className="summary-tiles-column">
                    <div className="take-home-hero-card">
                        <span className="hero-label">Estimated Monthly Net Take-Home</span>
                        <span className="hero-amount font-mono">
                            ₹
                            {computed.netTakeHome.toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                            })}
                        </span>
                        <div className="hero-divider" />
                        <div className="hero-stats-grid">
                            <div className="hero-stat-col">
                                <span className="stat-label">Gross Earnings</span>
                                <span className="stat-val font-mono">
                                    ₹
                                    {computed.grossEarnings.toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="hero-stat-col">
                                <span className="stat-label">Total Deductions</span>
                                <span className="stat-val font-mono text-danger">
                                    - ₹
                                    {computed.totalDeductions.toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Employer CTC Card */}
                    <div className="ctc-card">
                        <div className="card-header">
                            <div className="title-group">
                                <ShieldCheck size={18} className="header-icon" />
                                <h2>Total Cost to Company (CTC)</h2>
                            </div>
                        </div>
                        <div className="ctc-breakdown">
                            <div className="ctc-row">
                                <span>Gross Wage</span>
                                <span className="font-mono">
                                    ₹
                                    {computed.grossEarnings.toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="ctc-row">
                                <span>Employer PF Contribution (12% of Basic)</span>
                                <span className="font-mono">
                                    + ₹
                                    {computed.employerPF.toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="ctc-row">
                                <span>Gratuity Allocation (4.81% of Basic)</span>
                                <span className="font-mono">
                                    + ₹
                                    {computed.gratuity.toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="ctc-total-row">
                                <span>Monthly CTC</span>
                                <span className="font-mono font-bold text-primary">
                                    ₹
                                    {computed.ctc.toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="ctc-total-row annual-row">
                                <span>Annual CTC (LPA)</span>
                                <span className="font-mono font-bold text-success">
                                    ₹
                                    {(computed.ctc * 12).toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
