import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, FileText, Shield, Zap, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { getHistory } from '../api';

const DashboardContent = ({ onStartAnalysis }) => {
    const [stats, setStats] = useState({
        total: 0,
        avgRisk: '--',
        recent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const history = await getHistory();
                if (history && history.length > 0) {
                    const total = history.length;
                    // Calculate average risk from scores (formatted as percentage strings like "71.1%")
                    const avg = (history.reduce((acc, curr) => {
                        const score = parseFloat(curr.score);
                        return acc + (isNaN(score) ? 0 : score);
                    }, 0) / total).toFixed(1) + '%';

                    setStats({
                        total,
                        avgRisk: avg,
                        recent: total // Total reports available
                    });
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="fade-in">
            {/* Hero Section - Simplified */}
            <section className="glass-card" style={{
                padding: '40px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(168, 85, 247, 0.08))',
                borderLeft: '4px solid var(--primary)'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                    color: 'var(--text-primary)'
                }}>
                    Welcome to AD Risk Prediction
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '24px',
                    maxWidth: '700px'
                }}>
                    AI-powered genetic risk assessment for Alzheimer's disease with explainable predictions
                </p>

                <button
                    onClick={onStartAnalysis}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '14px 28px',
                        fontSize: '1rem'
                    }}
                >
                    <Zap size={20} />
                    Start New Analysis
                    <ArrowRight size={18} />
                </button>
            </section>

            {/* Quick Stats */}
            <section>
                <h2 style={{
                    fontSize: '1.3rem',
                    marginBottom: '20px',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                }}>
                    Quick Overview
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                }}>
                    <div className="glass-card" style={{
                        padding: '24px',
                        borderLeft: '3px solid var(--primary)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px'
                        }}>
                            <Activity size={24} color="var(--primary)" />
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                Total Analyses
                            </h3>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {loading ? <Loader2 className="spin" size={24} /> : stats.total}
                        </p>
                    </div>

                    <div className="glass-card" style={{
                        padding: '24px',
                        borderLeft: '3px solid var(--success)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px'
                        }}>
                            <TrendingUp size={24} color="var(--success)" />
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                Avg Risk Score
                            </h3>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {loading ? <Loader2 className="spin" size={24} /> : stats.avgRisk}
                        </p>
                    </div>

                    <div className="glass-card" style={{
                        padding: '24px',
                        borderLeft: '3px solid var(--accent)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px'
                        }}>
                            <FileText size={24} color="var(--accent)" />
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                Total Reports
                            </h3>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {loading ? <Loader2 className="spin" size={24} /> : stats.recent}
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section>
                <h2 style={{
                    fontSize: '1.3rem',
                    marginBottom: '20px',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                }}>
                    Quick Actions
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    <div
                        className="glass-card"
                        style={{
                            padding: '28px',
                            cursor: 'pointer',
                            borderLeft: '3px solid var(--primary)'
                        }}
                        onClick={onStartAnalysis}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(56, 189, 248, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <Zap size={24} color="var(--primary)" />
                        </div>
                        <h3 style={{
                            fontSize: '1.1rem',
                            marginBottom: '8px',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            New Analysis
                        </h3>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Upload patient data and run AI-powered risk predictions
                        </p>
                    </div>

                    <div
                        className="glass-card"
                        style={{
                            padding: '28px',
                            opacity: 0.7,
                            borderLeft: '3px solid var(--success)'
                        }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <TrendingUp size={24} color="var(--success)" />
                        </div>
                        <h3 style={{
                            fontSize: '1.1rem',
                            marginBottom: '8px',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            View Analytics
                        </h3>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Explore cohort trends and risk distribution insights
                        </p>
                    </div>

                    <div
                        className="glass-card"
                        style={{
                            padding: '28px',
                            opacity: 0.7,
                            borderLeft: '3px solid var(--accent)'
                        }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(168, 85, 247, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <FileText size={24} color="var(--accent)" />
                        </div>
                        <h3 style={{
                            fontSize: '1.1rem',
                            marginBottom: '8px',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            Recent Results
                        </h3>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Access your previous analysis reports and predictions
                        </p>
                    </div>
                </div>
            </section>

            {/* System Status - Compact */}
            <section>
                <h2 style={{
                    fontSize: '1.3rem',
                    marginBottom: '20px',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                }}>
                    System Status
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    <div className="glass-card" style={{
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        borderLeft: '3px solid var(--success)'
                    }}>
                        <CheckCircle size={32} color="var(--success)" />
                        <div>
                            <h4 style={{
                                fontSize: '1rem',
                                marginBottom: '4px',
                                fontWeight: 600,
                                color: 'var(--text-primary)'
                            }}>
                                Models Active
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                4 ML models ready (XGBoost, RF, DNN, SVM)
                            </p>
                        </div>
                    </div>

                    <div className="glass-card" style={{
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        borderLeft: '3px solid var(--primary)'
                    }}>
                        <Shield size={32} color="var(--primary)" />
                        <div>
                            <h4 style={{
                                fontSize: '1rem',
                                marginBottom: '4px',
                                fontWeight: 600,
                                color: 'var(--text-primary)'
                            }}>
                                Data Security
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                All patient data encrypted and secure
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardContent;
