import React, { useState } from 'react';
import { BrainCircuit, Lock, User, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'password') {
            onLogin();
        } else {
            alert('Invalid credentials (Try admin/password)');
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
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Enter credentials to access AD Predictor</p>

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

                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}>
                        Sign In <ArrowRight size={18} />
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
