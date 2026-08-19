import './StatCard.scss';

function StatCard({ title, value, trend, isPositive, icon, className = '' }) {
    return (
        <div className={`stat-card-container ${className}`}>
            <div className="stat-icon-wrapper">{icon}</div>
            <div className="stat-details">
                <span className="stat-title">{title}</span>
                <div className="stat-value-row">
                    <span className="stat-value">{value}</span>
                    {trend && (
                        <span className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
                            <span className="trend-arrow">
                                {isPositive ? (
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="19" x2="12" y2="5" />
                                        <polyline points="5 12 12 5 19 12" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <polyline points="19 12 12 19 5 12" />
                                    </svg>
                                )}
                            </span>
                            <span className="trend-text">{trend}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StatCard;
