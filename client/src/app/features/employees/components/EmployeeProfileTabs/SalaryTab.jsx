import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import { IndianRupee, PieChart, ShieldCheck } from 'lucide-react';
import './ProfileTabs.scss';

export default function SalaryTab({ salaryStructure, isAdmin = false }) {
    if (!isAdmin) {
        return (
            <div className="profile-tab-content">
                <div className="profile-section-card profile-section-card--empty">
                    <ShieldCheck size={32} className="icon-warning" />
                    <h4>Salary Information Restricted</h4>
                    <p>
                        Only authorized HR and Admin personnel can view structural compensation
                        packages.
                    </p>
                </div>
            </div>
        );
    }

    const wage = Number(salaryStructure?.monthlyWage || salaryStructure?.wage || 50000);
    const basic = Number(salaryStructure?.basic || wage * 0.5);
    const hra = Number(salaryStructure?.hra || basic * 0.5);
    const standard = Number(salaryStructure?.standardAllowance || 4167);
    const bonus = Number(salaryStructure?.performanceBonus || basic * 0.0833);
    const lta = Number(salaryStructure?.lta || basic * 0.0833);

    // Residual balancing formula
    const specifiedEarnings = basic + hra + standard + bonus + lta;
    const residualFixed = Math.max(0, wage - specifiedEarnings);
    const totalGross = basic + hra + standard + bonus + lta + residualFixed;

    // Deductions
    const employeePf = basic * 0.12;
    const pt = Number(salaryStructure?.professionalTax || 200);
    const netTakeHome = totalGross - employeePf - pt;

    const formatCurrency = (amt) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amt);
    };

    return (
        <div className="profile-tab-content">
            <div className="profile-salary-hero">
                <div className="profile-salary-hero__card">
                    <span className="profile-salary-hero__label">Monthly Base Wage</span>
                    <span className="profile-salary-hero__value">{formatCurrency(wage)}</span>
                    <span className="profile-salary-hero__sub">
                        CTC: {formatCurrency(wage * 12)} / year
                    </span>
                </div>
                <div className="profile-salary-hero__card profile-salary-hero__card--net">
                    <span className="profile-salary-hero__label">Estimated Net Take-Home</span>
                    <span className="profile-salary-hero__value">
                        {formatCurrency(netTakeHome)}
                    </span>
                    <span className="profile-salary-hero__sub">After PF & Professional Tax</span>
                </div>
            </div>

            <div className="profile-section-card">
                <div className="profile-section-card__header">
                    <PieChart size={18} className="profile-section-card__icon" />
                    <h4 className="profile-section-card__title">
                        Earnings Breakdown (Residual Model)
                    </h4>
                </div>
                <div className="profile-salary-table-wrap">
                    <table className="profile-salary-table">
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Calculation Base</th>
                                <th className="text-right">Monthly Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Basic Salary</strong>
                                </td>
                                <td>50% of Wage</td>
                                <td className="text-right font-mono">{formatCurrency(basic)}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>House Rent Allowance (HRA)</strong>
                                </td>
                                <td>50% of Basic</td>
                                <td className="text-right font-mono">{formatCurrency(hra)}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Standard Allowance</strong>
                                </td>
                                <td>Fixed amount</td>
                                <td className="text-right font-mono">{formatCurrency(standard)}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Performance Bonus</strong>
                                </td>
                                <td>8.33% of Basic</td>
                                <td className="text-right font-mono">{formatCurrency(bonus)}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Leave Travel Allowance (LTA)</strong>
                                </td>
                                <td>8.33% of Basic</td>
                                <td className="text-right font-mono">{formatCurrency(lta)}</td>
                            </tr>
                            <tr className="profile-salary-table__residual-row">
                                <td>
                                    <strong>Fixed Allowance (Residual)</strong>
                                    <Badge variant="info" size="sm" className="ml-2">
                                        Auto-Balanced
                                    </Badge>
                                </td>
                                <td>Wage − Sum(Other components)</td>
                                <td className="text-right font-mono font-bold text-primary">
                                    {formatCurrency(residualFixed)}
                                </td>
                            </tr>
                            <tr className="profile-salary-table__total-row">
                                <td>
                                    <strong>Total Gross Earnings</strong>
                                </td>
                                <td>Reconciled 100%</td>
                                <td className="text-right font-mono font-bold">
                                    {formatCurrency(totalGross)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="profile-section-card">
                <div className="profile-section-card__header">
                    <IndianRupee size={18} className="profile-section-card__icon" />
                    <h4 className="profile-section-card__title">Statutory Deductions</h4>
                </div>
                <div className="profile-salary-table-wrap">
                    <table className="profile-salary-table">
                        <thead>
                            <tr>
                                <th>Deduction</th>
                                <th>Rate / Base</th>
                                <th className="text-right">Monthly Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Employee Provident Fund (PF)</strong>
                                </td>
                                <td>12% of Basic Salary</td>
                                <td className="text-right font-mono text-danger">
                                    −{formatCurrency(employeePf)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Professional Tax (PT)</strong>
                                </td>
                                <td>Statutory State Tax</td>
                                <td className="text-right font-mono text-danger">
                                    −{formatCurrency(pt)}
                                </td>
                            </tr>
                            <tr className="profile-salary-table__total-row">
                                <td>
                                    <strong>Total Deductions</strong>
                                </td>
                                <td></td>
                                <td className="text-right font-mono font-bold text-danger">
                                    −{formatCurrency(employeePf + pt)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
