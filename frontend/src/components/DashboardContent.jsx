import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, FileText, Shield, Zap, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { getHistory } from '../api';

const DashboardContent = ({ onStartAnalysis, onReportClick, setActiveTab }) => {
    const [stats, setStats] = useState({
        total: 0,
        avgRisk: '--',
        recent: 0
    });
    const [rawHistory, setRawHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const history = await getHistory();
                if (history && history.length > 0) {
                    const sortedHistory = [...history].sort((a, b) => (b.id || 0) - (a.id || 0));
                    setRawHistory(sortedHistory);
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

    const filteredHistory = rawHistory.filter(h =>
        h.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    AD Risk Prediction Engine
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0',
                    maxWidth: '700px'
                }}>
                    AI-powered genetic risk assessment for Alzheimer's disease with explainable predictions. Accurate, secure, and fast.
                </p>
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

                </div>
            </section>

            {/* Searchable Reports List - New Section */}
            <section className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        Recent Patient Reports
                    </h2>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'white',
                                width: '250px'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}><Loader2 className="spin" /></div>
                    ) : filteredHistory.length > 0 ? (
                        <>
                            {filteredHistory.slice(0, showAll ? undefined : 5).map((report, idx) => (
                                <div
                                    key={idx}
                                    className="glass-card"
                                    style={{
                                        padding: '12px 20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.02)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onClick={() => onReportClick && onReportClick(report)}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                >
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '40px',
                                            borderRadius: '4px',
                                            background: report.risk === 'High' || report.risk === 'Very High' ? 'var(--danger)' : 'var(--success)'
                                        }} />
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{report.patient_name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                Age: {report.age} | {report.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            color: report.risk === 'High' || report.risk === 'Very High' ? 'var(--danger)' : 'var(--success)'
                                        }}>
                                            {report.score}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{report.risk} Risk</div>
                                    </div>
                                </div>
                            ))}
                            {filteredHistory.length > 5 && (
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--primary)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        marginTop: '10px'
                                    }}
                                >
                                    {showAll ? 'View Less' : `View All (${filteredHistory.length})`}
                                </button>
                            )}
                        </>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '10px' }}>
                            {searchTerm ? "No patients found matching your search." : "No reports available yet."}
                        </p>
                    )}
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
                            cursor: 'pointer',
                            borderLeft: '3px solid var(--success)'
                        }}
                        onClick={() => setActiveTab('Cohort Analytics')}
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
                                Analysis Engine
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                XGBoost Predictor active and optimized
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
