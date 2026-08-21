import { useState, useMemo } from 'react';
import Button from '@/components/Shared/Buttons/Button/Button';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import ToastNotification from '@/components/Shared/Feedback/ToastNotification/ToastNotification';
import { Save } from 'lucide-react';
import './SalaryStructureEditor.scss';

export default function SalaryStructureEditor({ initialData, onSave, loading }) {
    const [monthlyWage, setMonthlyWage] = useState(initialData?.monthlyWage || 50000);
    const [basicPct, setBasicPct] = useState(initialData?.basicPercentage || 50);
    const [hraPct, setHraPct] = useState(initialData?.hraPercentage || 50);
    const [standardAllowance, setStandardAllowance] = useState(
        initialData?.standardAllowance || 4167,
    );
    const [bonusPct, setBonusPct] = useState(initialData?.bonusPercentage || 8.33);
    const [ltaPct, setLtaPct] = useState(initialData?.ltaPercentage || 8.33);
    const [professionalTax, setProfessionalTax] = useState(initialData?.professionalTax || 200);

    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');

    const wage = Number(monthlyWage) || 0;

    // Computed breakdown
    const math = useMemo(() => {
        const basic = Math.round((wage * (Number(basicPct) || 0)) / 100);
        const hra = Math.round((basic * (Number(hraPct) || 0)) / 100);
        const standard = Number(standardAllowance) || 0;
        const bonus = Math.round((basic * (Number(bonusPct) || 0)) / 100);
        const lta = Math.round((basic * (Number(ltaPct) || 0)) / 100);

        const specifiedSum = basic + hra + standard + bonus + lta;
        const residualFixed = Math.max(0, wage - specifiedSum);
        const grossEarnings = basic + hra + standard + bonus + lta + residualFixed;

        // Deductions
        const employeePf = Math.round(basic * 0.12);
        const employerPf = Math.round(basic * 0.12);
        const pt = Number(professionalTax) || 0;
        const totalDeductions = employeePf + pt;
        const netTakeHome = grossEarnings - totalDeductions;

        return {
            basic,
            hra,
            standard,
            bonus,
            lta,
            residualFixed,
            grossEarnings,
            employeePf,
            employerPf,
            pt,
            totalDeductions,
            netTakeHome,
        };
    }, [wage, basicPct, hraPct, standardAllowance, bonusPct, ltaPct, professionalTax]);

    const formatInr = (num) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaveError('');
        setSaveSuccess(false);

        try {
            if (onSave) {
                await onSave({
                    monthlyWage: wage,
                    yearlyCtc: wage * 12,
                    basicSalary: math.basic,
                    hra: math.hra,
                    standardAllowance: math.standard,
                    performanceBonus: math.bonus,
                    lta: math.lta,
                    fixedAllowance: math.residualFixed,
                    employeePf: math.employeePf,
                    employerPf: math.employerPf,
                    professionalTax: math.pt,
                    netSalary: math.netTakeHome,
                });
                setSaveSuccess(true);
            }
        } catch (err) {
            setSaveError(
                err.response?.data?.message || err.message || 'Failed to save salary configuration',
            );
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="salary-structure-editor">
            {saveSuccess && (
                <ToastNotification
                    variant="success"
                    title="Salary Structure Saved"
                    message="The residual balancing compensation model has been updated."
                    onClose={() => setSaveSuccess(false)}
                />
            )}
            {saveError && (
                <ToastNotification
                    variant="error"
                    title="Save Failed"
                    message={saveError}
                    onClose={() => setSaveError('')}
                />
            )}

            <div className="salary-hero-summary">
                <div className="salary-hero-card">
                    <span className="label">Monthly Base Wage</span>
                    <span className="val">{formatInr(wage)}</span>
                    <span className="sub">Annual CTC: {formatInr(wage * 12)}</span>
                </div>
                <div className="salary-hero-card salary-hero-card--residual">
                    <div className="flex-between">
                        <span className="label">Fixed Allowance (Residual)</span>
                        <Badge variant="info" size="sm">
                            Auto-Balanced
                        </Badge>
                    </div>
                    <span className="val">{formatInr(math.residualFixed)}</span>
                    <span className="sub">Reconciled to 100% of wage</span>
                </div>
                <div className="salary-hero-card salary-hero-card--net">
                    <span className="label">Net Take-Home Salary</span>
                    <span className="val">{formatInr(math.netTakeHome)}</span>
                    <span className="sub">After ₹{math.totalDeductions} PF & Tax</span>
                </div>
            </div>

            <div className="salary-form-grid">
                <div className="salary-input-panel">
                    <h3 className="panel-title">Contractual Wage & Parameters</h3>

                    <div className="input-group-vertical">
                        <InputField
                            label="Monthly Gross Wage (₹) *"
                            type="number"
                            value={monthlyWage}
                            onChange={(e) => setMonthlyWage(e.target.value)}
                            required
                        />

                        <div className="grid-2-col">
                            <InputField
                                label="Basic (% of Wage)"
                                type="number"
                                step="0.1"
                                value={basicPct}
                                onChange={(e) => setBasicPct(e.target.value)}
                            />
                            <InputField
                                label="HRA (% of Basic)"
                                type="number"
                                step="0.1"
                                value={hraPct}
                                onChange={(e) => setHraPct(e.target.value)}
                            />
                        </div>

                        <div className="grid-2-col">
                            <InputField
                                label="Standard Allowance (Fixed ₹)"
                                type="number"
                                value={standardAllowance}
                                onChange={(e) => setStandardAllowance(e.target.value)}
                            />
                            <InputField
                                label="Professional Tax (₹/mo)"
                                type="number"
                                value={professionalTax}
                                onChange={(e) => setProfessionalTax(e.target.value)}
                            />
                        </div>

                        <div className="grid-2-col">
                            <InputField
                                label="Bonus (% of Basic)"
                                type="number"
                                step="0.01"
                                value={bonusPct}
                                onChange={(e) => setBonusPct(e.target.value)}
                            />
                            <InputField
                                label="LTA (% of Basic)"
                                type="number"
                                step="0.01"
                                value={ltaPct}
                                onChange={(e) => setLtaPct(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="salary-breakdown-panel">
                    <h3 className="panel-title">Real-Time Mathematical Breakdown</h3>

                    <div className="table-wrapper">
                        <table className="breakdown-table">
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Formula</th>
                                    <th className="text-right">Monthly (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Basic Salary</strong>
                                    </td>
                                    <td>{basicPct}% of Wage</td>
                                    <td className="text-right font-mono">
                                        {formatInr(math.basic)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>HRA</strong>
                                    </td>
                                    <td>{hraPct}% of Basic</td>
                                    <td className="text-right font-mono">{formatInr(math.hra)}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Standard Allowance</strong>
                                    </td>
                                    <td>Fixed</td>
                                    <td className="text-right font-mono">
                                        {formatInr(math.standard)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Bonus</strong>
                                    </td>
                                    <td>{bonusPct}% of Basic</td>
                                    <td className="text-right font-mono">
                                        {formatInr(math.bonus)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>LTA</strong>
                                    </td>
                                    <td>{ltaPct}% of Basic</td>
                                    <td className="text-right font-mono">{formatInr(math.lta)}</td>
                                </tr>
                                <tr className="residual-row">
                                    <td>
                                        <strong>Fixed Allowance (Residual)</strong>
                                    </td>
                                    <td>Wage − Σ(Other Earnings)</td>
                                    <td className="text-right font-mono font-bold text-primary">
                                        {formatInr(math.residualFixed)}
                                    </td>
                                </tr>
                                <tr className="gross-row">
                                    <td>
                                        <strong>Total Gross Earnings</strong>
                                    </td>
                                    <td>100% Reconciled</td>
                                    <td className="text-right font-mono font-bold">
                                        {formatInr(math.grossEarnings)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-danger">Employee PF (12%)</td>
                                    <td>Deduction</td>
                                    <td className="text-right font-mono text-danger">
                                        −{formatInr(math.employeePf)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-danger">Professional Tax (PT)</td>
                                    <td>Deduction</td>
                                    <td className="text-right font-mono text-danger">
                                        −{formatInr(math.pt)}
                                    </td>
                                </tr>
                                <tr className="net-row">
                                    <td>
                                        <strong>Net Take-Home Salary</strong>
                                    </td>
                                    <td>Gross − Deductions</td>
                                    <td className="text-right font-mono font-bold text-success">
                                        {formatInr(math.netTakeHome)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="salary-actions">
                <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    loading={loading}
                    disabled={loading}
                >
                    Save & Apply Salary Structure
                </Button>
            </div>
        </form>
    );
}
