import { useState } from 'react';
import Button from '@/components/Shared/Buttons/Button/Button';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { Moon, Sun, Monitor } from 'lucide-react';
import './GeneralSettings.scss';

export default function GeneralSettings() {
    const { success } = useToast();

    // Local settings states
    const [theme, setTheme] = useState('light');

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
                            onClick={() => setTheme('light')}
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
                            onClick={() => setTheme('dark')}
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
                            onClick={() => setTheme('system')}
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
