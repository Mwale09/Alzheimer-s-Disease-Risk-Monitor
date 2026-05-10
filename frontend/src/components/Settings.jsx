import React, { useState } from 'react';
import { User, Lock, Bell, Moon, Sun, Monitor, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { updatePassword } from '../api';

const Settings = ({ darkMode, toggleTheme, userName, setUserName }) => {
    const [notifications, setNotifications] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            setStatus({ type: 'error', message: 'Please fill in both password fields.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            await updatePassword(newPassword);
            setStatus({ type: 'success', message: 'Password updated successfully!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.detail || 'Failed to update password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Monitor size={28} color="var(--accent-blue)" /> Settings
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Manage your account preferences and system configuration.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Account Information */}
                <section>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={20} color="var(--success)" /> Account Information
                    </h3>
                    <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Username</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Role</label>
                                <input type="text" value="System Administrator" disabled style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-secondary)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email</label>
                                <input type="text" value="admin@neuro-predict.com" disabled style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-secondary)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Last Login</label>
                                <input type="text" value="Today, 10:45 AM" disabled style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security */}
                <section>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={20} color="var(--warning)" /> Security
                    </h3>
                    <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
                        {status.message && (
                            <div style={{
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
                                border: `1px solid ${status.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                                fontSize: '0.875rem'
                            }}>
                                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                {status.message}
                            </div>
                        )}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white' }}
                            />
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleUpdatePassword}
                            disabled={loading}
                            style={{
                                padding: '8px 16px',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading && <Loader2 size={16} className="spin" />}
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </section>

                {/* Preferences */}
                <section>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shield size={20} color="var(--accent-purple)" /> Preferences
                    </h3>
                    <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Bell size={18} color="var(--text-secondary)" />
                                <div>
                                    <p style={{ fontWeight: 500 }}>Email Notifications</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Receive alerts for high-risk analyses</p>
                                </div>
                            </div>
                            <label className="switch">
                                <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {darkMode ? <Moon size={18} color="var(--text-secondary)" /> : <Sun size={18} color="var(--text-secondary)" />}
                                <div>
                                    <p style={{ fontWeight: 500 }}>System Theme</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Toggle dark/light mode appearance</p>
                                </div>
                            </div>
                            <label className="switch">
                                <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </section>
            </div>

            <style>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 48px;
                    height: 24px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(255,255,255,0.1);
                    transition: .4s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: var(--accent-blue);
                }
                input:checked + .slider:before {
                    transform: translateX(24px);
                }
            `}</style>
        </div>
    );
};

export default Settings;
