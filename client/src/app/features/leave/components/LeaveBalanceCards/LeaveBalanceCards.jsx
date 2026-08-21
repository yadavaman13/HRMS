import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import { Palmtree, HeartPulse, Coffee, AlertCircle } from 'lucide-react';
import './LeaveBalanceCards.scss';

export default function LeaveBalanceCards({ balances = [] }) {
    const safeBalances = Array.isArray(balances) ? balances : [];

    const defaultTypes = [
        {
            code: 'PTO',
            name: 'Paid Time Off',
            total: 18,
            used: 4,
            available: 14,
            icon: Palmtree,
            color: 'blue',
        },
        {
            code: 'SICK',
            name: 'Sick Leave',
            total: 12,
            used: 1,
            available: 11,
            icon: HeartPulse,
            color: 'danger',
        },
        {
            code: 'CASUAL',
            name: 'Casual Leave',
            total: 6,
            used: 2,
            available: 4,
            icon: Coffee,
            color: 'purple',
        },
        {
            code: 'LWP',
            name: 'Unpaid Leave (LWP)',
            total: 0,
            used: 0,
            available: 'Uncapped',
            icon: AlertCircle,
            color: 'neutral',
        },
    ];

    // Merge API balances if present
    const displayCards = defaultTypes.map((item) => {
        const found = safeBalances.find(
            (b) => b?.leaveType?.code === item.code || b?.code === item.code,
        );
        if (found) {
            return {
                ...item,
                total: found.allocatedDays ?? found.total ?? item.total,
                used: found.usedDays ?? found.used ?? item.used,
                available: found.availableDays ?? found.available ?? item.available,
            };
        }
        return item;
    });

    return (
        <div className="leave-balance-cards-grid">
            {displayCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                    <div
                        key={card.code || idx}
                        className={`leave-balance-card leave-balance-card--${card.color}`}
                    >
                        <div className="leave-balance-card__top">
                            <div className="leave-balance-card__icon-box">
                                <IconComponent size={20} />
                            </div>
                            <Badge
                                variant={
                                    card.color === 'danger'
                                        ? 'danger'
                                        : card.color === 'purple'
                                          ? 'primary'
                                          : 'neutral'
                                }
                                size="sm"
                            >
                                {card.code}
                            </Badge>
                        </div>

                        <div className="leave-balance-card__main">
                            <span className="leave-balance-card__available">{card.available}</span>
                            <span className="leave-balance-card__label">
                                {typeof card.available === 'number'
                                    ? 'Days Available'
                                    : 'Leave Type'}
                            </span>
                        </div>

                        <div className="leave-balance-card__footer">
                            <span className="leave-balance-card__title">{card.name}</span>
                            {typeof card.total === 'number' && card.total > 0 && (
                                <span className="leave-balance-card__stats font-mono">
                                    {card.used} Used / {card.total} Total
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
