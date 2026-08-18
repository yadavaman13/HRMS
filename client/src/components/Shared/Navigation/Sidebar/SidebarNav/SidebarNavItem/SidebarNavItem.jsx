import { Plus as PlusIcon, Pin as PinIcon } from 'lucide-react';
import './SidebarNavItem.scss';

function SidebarNavItem({
    label,
    icon,
    isActive,
    onClick,
    showAdd,
    onAddClick,
    isPinned,
    onPinClick,
}) {
    const handleAddClick = (e) => {
        e.stopPropagation(); // Prevent selecting the nav item when clicking the "+" button
        if (onAddClick) onAddClick();
    };

    const handlePinClick = (e) => {
        e.stopPropagation(); // Prevent selecting the nav item when clicking the pin button
        if (onPinClick) onPinClick();
    };

    return (
        <div
            className={`sidebar-nav-item ${isActive ? 'active' : ''} ${isPinned ? 'is-pinned' : ''}`}
            onClick={onClick}
        >
            <div className="nav-item-left">
                <span className="nav-icon">{icon}</span>
                <span className="nav-label">{label}</span>
            </div>
            <div className="nav-item-actions">
                {onPinClick && (
                    // <Tooltip content={isPinned ? 'Unpin' : 'Pin'} position="top">
                    <button
                        type="button"
                        className={`nav-pin-btn ${isPinned ? 'pinned' : ''}`}
                        onClick={handlePinClick}
                        aria-label={isPinned ? `Unpin ${label}` : `Pin ${label}`}
                    >
                        <PinIcon size={16} strokeWidth={1.2} />
                    </button>
                    // </Tooltip>
                )}
                {showAdd && (
                    <button
                        type="button"
                        className="nav-add-btn"
                        onClick={handleAddClick}
                        title={`Add ${label}`}
                    >
                        <PlusIcon size={14} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default SidebarNavItem;
