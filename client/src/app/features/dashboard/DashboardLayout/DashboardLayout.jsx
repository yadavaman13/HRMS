import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Sidebar from '@/components/Shared/Navigation/Sidebar/Sidebar';
import MainContent from './MainContent/MainContent';
import Topbar from '@/components/Shared/Navigation/Topbar/Topbar';
import Dialog from '@/components/Shared/Feedback/Dialog';
import { Drawer, NotificationFeed } from '@/components/Shared/Feedback/Drawer';
import { AuthContext } from '../../auth/context/AuthContext';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDerivedProfile } from '../../auth/hooks/useDerivedProfile';
import {
    NotificationsProvider,
    NotificationsContext,
} from '../../notifications/context/notifications.context';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import {
    Home as HomeIcon,
    Users as UsersIcon,
    Clock as ClockIcon,
    CalendarOff as LeaveIcon,
    DollarSign as PayrollIcon,
    Settings as SettingsIcon,
    ShieldAlert as AuditIcon,
    Bot as BotIcon,
    User as ProfileIcon,
} from 'lucide-react';
import './DashboardLayout.scss';

function DashboardLayoutInner({ onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const { handleLogout } = useAuth();
    const derivedProfile = useDerivedProfile();

    const { unreadCount } = useContext(NotificationsContext);
    const { loadUnreadCount, loadNotifications } = useNotifications();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true';
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1200,
    );
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

    useEffect(() => {
        loadUnreadCount();
        loadNotifications();
    }, [loadUnreadCount, loadNotifications]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isVisuallyCollapsed =
        windowWidth <= 600 ? false : windowWidth <= 900 ? true : isSidebarCollapsed;

    const userRole = (user?.role || '').toLowerCase();
    const isAdminOrHr = userRole === 'admin' || userRole === 'hr';
    const roleSegment = isAdminOrHr ? 'admin' : 'user';

    const sidebarNavItems = isAdminOrHr
        ? [
              {
                  label: 'Home',
                  path: '/dashboard/admin/home',
                  icon: <HomeIcon size={18} />,
                  roles: ['admin', 'hr'],
              },
              {
                  label: 'Employees',
                  path: '/dashboard/admin/employees',
                  icon: <UsersIcon size={18} />,
                  roles: ['admin', 'hr'],
              },
              {
                  label: 'Attendance',
                  path: '/dashboard/admin/attendance',
                  icon: <ClockIcon size={18} />,
                  roles: ['admin', 'hr'],
              },
              {
                  label: 'Leave Approvals',
                  path: '/dashboard/admin/leave-approvals',
                  icon: <LeaveIcon size={18} />,
                  roles: ['admin', 'hr'],
              },
              {
                  label: 'Payroll',
                  path: '/dashboard/admin/payroll',
                  subTabs: ['Processing', 'Salary Structure'],
                  icon: <PayrollIcon size={18} />,
                  roles: ['admin', 'hr'],
              },
              {
                  label: 'Settings',
                  path: '/dashboard/admin/settings',
                  subTabs: ['General', 'Schedules', 'Policies'],
                  icon: <SettingsIcon size={18} />,
                  roles: ['admin', 'hr'],
              },
              {
                  label: 'Audit Trail',
                  path: '/dashboard/admin/audit',
                  icon: <AuditIcon size={18} />,
                  roles: ['admin'],
              },
              {
                  label: 'AI Copilot',
                  path: '/dashboard/admin/ai',
                  icon: <BotIcon size={18} />,
                  roles: ['admin', 'hr'],
              },
          ]
        : [
              {
                  label: 'Home',
                  path: '/dashboard/user/home',
                  icon: <HomeIcon size={18} />,
                  roles: ['employee', 'user'],
              },
              {
                  label: 'My Attendance',
                  path: '/dashboard/user/attendance',
                  icon: <ClockIcon size={18} />,
                  roles: ['employee', 'user'],
              },
              {
                  label: 'Time Off',
                  path: '/dashboard/user/leave',
                  icon: <LeaveIcon size={18} />,
                  roles: ['employee', 'user'],
              },
              {
                  label: 'My Payslips',
                  path: '/dashboard/user/payslips',
                  icon: <PayrollIcon size={18} />,
                  roles: ['employee', 'user'],
              },
              {
                  label: 'My Profile',
                  path: '/dashboard/user/profile',
                  icon: <ProfileIcon size={18} />,
                  roles: ['employee', 'user'],
              },
              {
                  label: 'AI Copilot',
                  path: '/dashboard/user/ai',
                  icon: <BotIcon size={18} />,
                  roles: ['employee', 'user'],
              },
          ];

    const handleSubItemClick = (parentLabel, subTab) => {
        const sub = subTab.toLowerCase().replace(/\s+/g, '-');
        if (parentLabel === 'Settings') {
            if (sub === 'general') navigate('/dashboard/admin/settings');
            else if (sub === 'schedules') navigate('/dashboard/admin/settings/schedules');
            else if (sub === 'policies') navigate('/dashboard/admin/settings/policies');
        } else if (parentLabel === 'Payroll') {
            if (sub === 'salary-structure') navigate('/dashboard/admin/payroll/salary-structure');
            else navigate('/dashboard/admin/payroll');
        }
    };

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem('sidebar-collapsed', String(next));
            return next;
        });
    };

    const handleLogoutTrigger = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = async () => {
        setShowLogoutModal(false);
        try {
            await handleLogout();
        } catch (err) {
            console.error('Logout error:', err);
        }
        if (onLogout) {
            onLogout();
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="dashboard-layout-container">
            <div
                className={`sidebar-mobile-backdrop ${isMobileMenuOpen ? 'visible' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />
            <Sidebar
                isCollapsed={isVisuallyCollapsed}
                onToggleCollapse={handleToggleSidebar}
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
                onLogoutRequest={handleLogoutTrigger}
                navItems={sidebarNavItems}
                userRole={user?.role}
                profile={derivedProfile}
                onSubItemClick={handleSubItemClick}
                onNavigateGeneral={() => navigate(`/dashboard/${roleSegment}/settings/general`)}
                onNavigateAccount={() => navigate(`/dashboard/${roleSegment}/settings/account`)}
            />

            <div className="dashboard-right-pane">
                <Topbar
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    unreadNotificationCount={unreadCount}
                    onNotificationClick={() => setIsNotificationDrawerOpen(true)}
                />

                <MainContent />
            </div>

            {/* Shared Modular Drawer for Notifications Feed */}
            <Drawer
                isOpen={isNotificationDrawerOpen}
                onClose={() => setIsNotificationDrawerOpen(false)}
                title="Feed"
                position="right"
                size="md"
                showOverlay={true}
                closeOnOverlayClick={true}
                closeOnEsc={true}
            >
                <NotificationFeed
                    onNotificationClick={(item) => console.log('Notification clicked:', item)}
                />
            </Drawer>

            <Dialog
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Confirm Logout"
                variant="danger"
                size="sm"
                confirmText="Yes"
                cancelText="No"
                onConfirm={handleConfirmLogout}
            >
                <p>
                    Are you sure you want to log out of your account? Any unsaved changes may be
                    lost.
                </p>
            </Dialog>
        </div>
    );
}

export default function DashboardLayout(props) {
    return (
        <NotificationsProvider>
            <DashboardLayoutInner {...props} />
        </NotificationsProvider>
    );
}
