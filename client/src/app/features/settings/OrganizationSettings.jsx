import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@/components/Shared/Buttons/Button/Button';
import InputField from '@/components/Shared/Form/InputField/InputField';
import ToastNotification from '@/components/Shared/Feedback/ToastNotification/ToastNotification';
import { Building, Clock, Shield, Save } from 'lucide-react';
import './OrganizationSettings.scss';

export default function OrganizationSettings() {
    const [companyName, setCompanyName] = useState('Dayflow Technologies Pvt Ltd');
    const [companyCode, setCompanyCode] = useState('OI');
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [currency, setCurrency] = useState('INR');

    // Work schedule / shift parameters
    const [shiftStartTime, setShiftStartTime] = useState('09:00');
    const [shiftEndTime, setShiftEndTime] = useState('18:00');
    const [breakDurationMinutes, setBreakDurationMinutes] = useState('60');
    const [weeklyWorkingDays, setWeeklyWorkingDays] = useState('5');

    // Leave & statutory defaults
    const [defaultAnnualPto, setDefaultAnnualPto] = useState('18');
    const [defaultSickLeave, setDefaultSickLeave] = useState('12');
    const [professionalTaxMonthly, setProfessionalTaxMonthly] = useState('200');

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchOrgSettings = async () => {
            try {
                const res = await axios.get('/api/settings', { withCredentials: true });
                if (res.data?.data) {
                    const d = res.data.data;
                    if (d.companyName) setCompanyName(d.companyName);
                    if (d.companyCode) setCompanyCode(d.companyCode);
                    if (d.shiftStartTime) setShiftStartTime(d.shiftStartTime);
                    if (d.shiftEndTime) setShiftEndTime(d.shiftEndTime);
                    if (d.breakDurationMinutes)
                        setBreakDurationMinutes(String(d.breakDurationMinutes));
                }
            } catch (err) {
                // fallback to sensible defaults
            }
        };
        fetchOrgSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);

        try {
            await axios.post(
                '/api/settings',
                {
                    companyName,
                    companyCode,
                    timezone,
                    currency,
                    shiftStartTime,
                    shiftEndTime,
                    breakDurationMinutes: Number(breakDurationMinutes),
                    weeklyWorkingDays: Number(weeklyWorkingDays),
                    defaultAnnualPto: Number(defaultAnnualPto),
                    defaultSickLeave: Number(defaultSickLeave),
                    professionalTaxMonthly: Number(professionalTaxMonthly),
                },
                { withCredentials: true },
            );
            setToast({
                variant: 'success',
                message: 'Organization master settings updated successfully.',
            });
        } catch (err) {
            setToast({
                variant: 'error',
                message:
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to update organization settings',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="organization-settings-container">
            <div className="settings-card-header">
                <div className="flex-center-gap">
                    <Building size={22} className="icon-primary" />
                    <div>
                        <h2 className="settings-card-title">Organization Master Settings</h2>
                        <p className="settings-card-subtitle">
                            Configure company-wide shift parameters, working schedules, leave
                            policies, and statutory tax parameters.
                        </p>
                    </div>
                </div>
            </div>

            {toast && (
                <ToastNotification
                    variant={toast.variant}
                    title={toast.variant === 'success' ? 'Settings Saved' : 'Update Notice'}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <form onSubmit={handleSave} className="organization-settings-form">
                <div className="org-settings-section">
                    <h3 className="section-title">
                        <Building size={16} /> Company Identity & Code
                    </h3>
                    <div className="form-grid-2">
                        <InputField
                            label="Organization / Company Name *"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                        <InputField
                            label="Company Prefix Code (Atomic ID Generation) *"
                            value={companyCode}
                            onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                            required
                            helperText="Used in Employee Codes (e.g., OIJODO20260001)"
                        />
                    </div>
                    <div className="form-grid-2">
                        <InputField
                            label="Timezone"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            disabled
                        />
                        <InputField
                            label="Operating Currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            disabled
                        />
                    </div>
                </div>

                <div className="org-settings-section">
                    <h3 className="section-title">
                        <Clock size={16} /> Shift Timings & Work Schedules
                    </h3>
                    <div className="form-grid-2">
                        <InputField
                            label="Standard Shift Start Time"
                            type="time"
                            value={shiftStartTime}
                            onChange={(e) => setShiftStartTime(e.target.value)}
                        />
                        <InputField
                            label="Standard Shift End Time"
                            type="time"
                            value={shiftEndTime}
                            onChange={(e) => setShiftEndTime(e.target.value)}
                        />
                    </div>
                    <div className="form-grid-2">
                        <InputField
                            label="Break Duration (Minutes)"
                            type="number"
                            value={breakDurationMinutes}
                            onChange={(e) => setBreakDurationMinutes(e.target.value)}
                            helperText="Auto-deducted from gross work hours"
                        />
                        <InputField
                            label="Standard Working Days / Week"
                            type="number"
                            value={weeklyWorkingDays}
                            onChange={(e) => setWeeklyWorkingDays(e.target.value)}
                        />
                    </div>
                </div>

                <div className="org-settings-section">
                    <h3 className="section-title">
                        <Shield size={16} /> Leave Allocation & Statutory Taxes
                    </h3>
                    <div className="form-grid-2">
                        <InputField
                            label="Annual Paid Time Off Quota (Days)"
                            type="number"
                            value={defaultAnnualPto}
                            onChange={(e) => setDefaultAnnualPto(e.target.value)}
                        />
                        <InputField
                            label="Annual Sick Leave Quota (Days)"
                            type="number"
                            value={defaultSickLeave}
                            onChange={(e) => setDefaultSickLeave(e.target.value)}
                        />
                    </div>
                    <div className="form-grid-2">
                        <InputField
                            label="Monthly Professional Tax Deduction (₹)"
                            type="number"
                            value={professionalTaxMonthly}
                            onChange={(e) => setProfessionalTaxMonthly(e.target.value)}
                        />
                    </div>
                </div>

                <div className="settings-footer-actions">
                    <Button
                        type="submit"
                        variant="primary"
                        icon={Save}
                        loading={loading}
                        disabled={loading}
                    >
                        Save Organization Settings
                    </Button>
                </div>
            </form>
        </div>
    );
}
