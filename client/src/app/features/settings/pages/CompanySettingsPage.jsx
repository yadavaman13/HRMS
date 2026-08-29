import { useState, useEffect, useContext } from 'react';
import { SettingsContext } from '../context/settings.context';
import { useSettings } from '../hooks/useSettings';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { Building2, Save, Sun, Moon, Monitor, Palette } from 'lucide-react';
import './CompanySettingsPage.scss';

export default function CompanySettingsPage() {
    const { company, loading } = useContext(SettingsContext);
    const { loadCompanyProfile, handleUpdateCompany } = useSettings();
    const { success, error: toastError } = useToast();

    // Theme state
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'system';
    });

    const [name, setName] = useState('');
    const [codePrefix, setCodePrefix] = useState('OI');
    const [cin, setCin] = useState('');
    const [pan, setPan] = useState('');
    const [gstin, setGstin] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
        if (selectedTheme === 'system') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('app-theme', 'system');
        } else {
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('app-theme', selectedTheme);
        }
        success(`Theme updated to ${selectedTheme} mode`);
    };

    useEffect(() => {
        loadCompanyProfile().then((data) => {
            if (data) {
                setName(data.name || '');
                setCodePrefix(data.codePrefix || data.prefix || 'OI');
                setCin(data.cin || '');
                setPan(data.pan || '');
                setGstin(data.gstin || '');
                setAddress(data.address || '');
                setWebsite(data.website || '');
                setContactEmail(data.contactEmail || data.email || '');
            }
        });
    }, [loadCompanyProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await handleUpdateCompany({
                name: name.trim(),
                codePrefix: codePrefix.trim().toUpperCase(),
                cin: cin.trim(),
                pan: pan.trim(),
                gstin: gstin.trim(),
                address: address.trim(),
                website: website.trim(),
                contactEmail: contactEmail.trim(),
            });
            success('Company master settings saved successfully.');
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || 'Failed to update company master';
            toastError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && !company) {
        return <Spinner label="Loading company settings..." />;
    }

    return (
        <div className="company-settings-page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Company Master Configuration</h1>
                    <p className="page-subtitle">
                        Manage corporate identity, employee ID prefix sequences, statutory
                        identifiers, and registered office addresses.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="settings-form-card">
                <div className="card-header">
                    <div className="title-group">
                        <Building2 size={18} className="header-icon" />
                        <h2>Corporate Organization Profile</h2>
                    </div>
                </div>

                <div className="form-fields-grid">
                    <InputField
                        label="Company Legal Name"
                        id="comp-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dayflow Technologies Pvt. Ltd."
                        required
                    />

                    <div className="prefix-field-container">
                        <InputField
                            label="Employee ID Prefix (2-3 Chars)"
                            id="comp-prefix"
                            value={codePrefix}
                            onChange={(e) => setCodePrefix(e.target.value.toUpperCase())}
                            placeholder="OI"
                            maxLength={4}
                            required
                        />
                        <span className="prefix-hint">
                            Used in atomic ID generator:{' '}
                            <strong>{codePrefix || 'OI'}JODO20260001</strong>
                        </span>
                    </div>

                    <InputField
                        label="Corporate Identity Number (CIN)"
                        id="comp-cin"
                        value={cin}
                        onChange={(e) => setCin(e.target.value)}
                        placeholder="U72200KA2020PTC123456"
                    />

                    <InputField
                        label="Company PAN"
                        id="comp-pan"
                        value={pan}
                        onChange={(e) => setPan(e.target.value)}
                        placeholder="AAACD1234F"
                    />

                    <InputField
                        label="GSTIN"
                        id="comp-gstin"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="29AAACD1234F1Z5"
                    />

                    <InputField
                        label="Official Work Email"
                        id="comp-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="hr@dayflow.in"
                    />

                    <div className="full-width-input">
                        <InputField
                            label="Company Website URL"
                            id="comp-web"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://dayflow.in"
                        />
                    </div>

                    <div className="full-width-input">
                        <InputField
                            label="Registered Corporate Address"
                            id="comp-addr"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Tower 3, Global Tech Park, Bangalore, Karnataka 560103"
                        />
                    </div>
                </div>

                <div className="settings-footer">
                    <Button variant="primary" type="submit" loading={isSaving}>
                        <Save size={16} /> Save Company Settings
                    </Button>
                </div>
            </form>

            {/* Appearance & Theme Section */}
            <div className="settings-form-card theme-settings-card">
                <div className="card-header">
                    <div className="title-group">
                        <Palette size={18} className="header-icon" />
                        <h2>Appearance & Theme Preferences</h2>
                    </div>
                </div>

                <div className="preference-section">
                    <p className="section-desc">
                        Personalize your Dayflow workspace appearance across light, dark, and system
                        themes.
                    </p>
                    <div className="theme-toggle-grid">
                        <button
                            type="button"
                            className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            <Sun size={20} />
                            <div className="theme-info">
                                <span className="theme-name">Light</span>
                                <span className="theme-desc">Crisp white workspace</span>
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
            </div>
        </div>
    );
}
