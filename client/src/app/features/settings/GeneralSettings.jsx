import { useState, useEffect } from 'react';
import Button from '@/components/Shared/Buttons/Button/Button';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { Moon, Sun, Monitor } from 'lucide-react';
import './GeneralSettings.scss';

export default function GeneralSettings() {
    const { success } = useToast();

    // Local settings states
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'system';
    });

    useEffect(() => {
        const saved = localStorage.getItem('app-theme') || 'system';
        setTheme(saved);
        if (saved === 'dark' || saved === 'light') {
            document.documentElement.setAttribute('data-theme', saved);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, []);

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
        if (selectedTheme === 'system') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('app-theme', 'system');
        } else {
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('app-theme', selectedTheme);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        success('General application settings updated!');
    };

    return (
        <div className="general-settings-container">
            <div className="settings-card-header">
                <h2 className="settings-card-title">General Settings</h2>
                <p className="settings-card-subtitle">
                    Personalize your application theme, localization, and notifications
                </p>
            </div>

            <form onSubmit={handleSubmit} className="general-settings-form">
                {/* Theme Section */}
                <div className="preference-section">
                    <label className="section-label">Appearance Theme</label>
                    <div className="theme-toggle-grid">
                        <button
                            type="button"
                            className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            <Sun size={20} />
                            <div className="theme-info">
                                <span className="theme-name">Light</span>
                                <span className="theme-desc">Crisp white canvas</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                        >
                            <Moon size={20} />
                            <div className="theme-info">
                                <span className="theme-name">Dark</span>
                                <span className="theme-desc">Comfortable night mode</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`theme-card ${theme === 'system' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('system')}
                        >
                            <Monitor size={20} />
                            <div className="theme-info">
                                <span className="theme-name">System</span>
                                <span className="theme-desc">Sync with OS style</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="settings-footer-actions">
                    <Button type="submit" variant="primary">
                        Save Preferences
                    </Button>
                </div>
            </form>
        </div>
    );
}
