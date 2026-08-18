import SidebarLogo from './SidebarLogo/SidebarLogo';
import SidebarNav from './SidebarNav/SidebarNav';
import ProfileCard from './ProfileCard/ProfileCard';
import './Sidebar.scss';

function Sidebar({
    isCollapsed,
    onToggleCollapse,
    isMobileOpen,
    onMobileClose,
    onLogoutRequest,
    pinnedTabs,
    onPinToggle,
    navItems,
}) {
    return (
        <aside
            className={`sidebar-container ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        >
            <SidebarLogo
                isCollapsed={isCollapsed}
                onToggleCollapse={onToggleCollapse}
                isMobileOpen={isMobileOpen}
                onMobileClose={onMobileClose}
            />
            <SidebarNav
                isCollapsed={isCollapsed}
                pinnedTabs={pinnedTabs}
                onPinToggle={onPinToggle}
                navItems={navItems}
            />
            <ProfileCard isCollapsed={isCollapsed} onLogoutRequest={onLogoutRequest} />
        </aside>
    );
}

export default Sidebar;
