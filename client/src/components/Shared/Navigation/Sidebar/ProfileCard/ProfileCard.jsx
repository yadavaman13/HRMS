import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import { useDerivedProfile } from '@/app/features/auth/hooks/useDerivedProfile';
import {
    Settings as SettingsIcon,
    LogOut as LogoutIcon,
    Sliders as GeneralIcon,
    User as AccountIcon,
} from 'lucide-react';
import './ProfileCard.scss';

function ProfileCard({ isCollapsed, onLogoutRequest }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { name, role, username, avatarUrl, initials } = useDerivedProfile();

    const displayRole = role || username || 'Admin';
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const cardRef = useRef(null);

    useClickOutside(cardRef, () => setIsSettingsOpen(false), { enabled: isSettingsOpen });

    const avatarEl = (
        <CircularAvatar src={avatarUrl} text={initials} size={36} showStatus={false} />
    );

    const handleOpenGeneral = (e) => {
        e.stopPropagation();
        setIsSettingsOpen(false);
        const role = user?.role?.toLowerCase() || 'user';
        const rolePath = role === 'admin' ? 'admin' : 'user';
        navigate(`/dashboard/${rolePath}/settings/general`);
    };

    const handleOpenAccount = (e) => {
        e.stopPropagation();
        setIsSettingsOpen(false);
        const role = user?.role?.toLowerCase() || 'user';
        const rolePath = role === 'admin' ? 'admin' : 'user';
        navigate(`/dashboard/${rolePath}/settings/account`);
    };

    const handleLogout = (e) => {
        e.stopPropagation();
        setIsSettingsOpen(false);
        if (onLogoutRequest) onLogoutRequest();
    };

    const settingsPopover = isSettingsOpen && (
        <div className={`profile-settings-popover ${isCollapsed ? 'collapsed-popover' : ''}`}>
            <div className="popover-header">
                <span className="popover-title">Settings</span>
            </div>
            <div className="popover-menu">
                <button type="button" className="popover-item" onClick={handleOpenGeneral}>
                    <GeneralIcon size={16} />
                    <span>General Settings</span>
                </button>
                <button type="button" className="popover-item" onClick={handleOpenAccount}>
                    <AccountIcon size={16} />
                    <span>Account Settings</span>
                </button>
                <div className="popover-divider" />
                <button type="button" className="popover-item logout-option" onClick={handleLogout}>
                    <LogoutIcon size={16} />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );

    if (isCollapsed) {
        return (
            <div
                ref={cardRef}
                className="profile-card-container collapsed"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <Tooltip content="Settings" position="right">
                    <button
                        type="button"
                        className={`profile-avatar-btn-collapsed ${isSettingsOpen ? 'active' : ''}`}
                        onClick={() => setIsSettingsOpen((prev) => !prev)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {avatarEl}
                    </button>
                </Tooltip>
                {settingsPopover}
            </div>
        );
    }

    return (
        <div ref={cardRef} className="profile-card-container">
            {avatarEl}

            <div className="profile-info">
                <span className="profile-name">{name}</span>
                <span className="profile-role">{displayRole}</span>
            </div>

            {/* Settings icon button inside profile card wrapped with Tooltip */}
            <Tooltip content="Settings" position="top">
                <button
                    type="button"
                    className={`profile-settings-btn ${isSettingsOpen ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsSettingsOpen((prev) => !prev);
                    }}
                >
                    <SettingsIcon size="18" strokeWidth={2.2} />
                </button>
            </Tooltip>

            {settingsPopover}
        </div>
    );
}

export default ProfileCard;
