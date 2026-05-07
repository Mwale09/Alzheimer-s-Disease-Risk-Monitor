import React, { useState } from 'react';
import { BrainCircuit, Lock, User, ArrowRight } from 'lucide-react';
import { login, registerUser } from '../api';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        try {
            if (isRegistering) {
                await registerUser(username, password);
                await login(username, password);
                onLogin(username);
            } else {
                await login(username, password);
                onLogin(username);
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.detail || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.1), transparent)'
        }}>
            <div className="glass-card" style={{ padding: '48px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <BrainCircuit color="white" size={32} />
                </div>

                <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>AD Predictor</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    {isRegistering ? 'Create anomalous dataset profile' : 'Enter credentials to access System'}
                </p>

                {errorMsg && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '12px', color: 'var(--danger)', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Sign In')} <ArrowRight size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
                        style={{ marginTop: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                        {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    System Version 2.1.0-React
                </p>
            </div>
        </div>
    );
};

export default Login;
