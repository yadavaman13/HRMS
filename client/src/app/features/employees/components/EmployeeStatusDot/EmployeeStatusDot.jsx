import './EmployeeStatusDot.scss';

/**
 * EmployeeStatusDot Component
 * Renders live presence status indicator
 * @param {'PRESENT' | 'ON_LEAVE' | 'ABSENT' | 'HALF_DAY'} status
 * @param {boolean} showLabel
 */
export default function EmployeeStatusDot({ status = 'ABSENT', showLabel = false }) {
    const normalizedStatus = (status || 'ABSENT').toUpperCase();

    const getStatusConfig = () => {
        switch (normalizedStatus) {
            case 'PRESENT':
                return { label: 'Present', className: 'employee-status-dot--present' };
            case 'ON_LEAVE':
            case 'LEAVE':
                return { label: 'On Leave', className: 'employee-status-dot--leave' };
            case 'HALF_DAY':
                return { label: 'Half Day', className: 'employee-status-dot--half-day' };
            case 'ABSENT':
            default:
                return { label: 'Absent', className: 'employee-status-dot--absent' };
        }
    };

    const config = getStatusConfig();

    return (
        <span className="employee-status-dot-container" title={`Status: ${config.label}`}>
            <span className={`employee-status-dot ${config.className}`} />
            {showLabel && <span className="employee-status-dot__label">{config.label}</span>}
        </span>
    );
}
