import React, { useEffect, useState } from 'react';
import { getHistory } from '../api';
import { Users, Activity, BrainCircuit, TrendingUp, AlertTriangle } from 'lucide-react';

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        highRiskCount: 0,
        avgRiskScore: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const history = await getHistory();
            if (history) {
                const total = history.length;
                const highRisk = history.filter(h => h.risk === 'High').length;
                const avgScore = total > 0
                    ? (history.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / total).toFixed(1)
                    : 0;

                setStats({
                    totalPatients: total,
                    highRiskCount: highRisk,
                    avgRiskScore: avgScore,
                    recentActivity: history.slice(-5).reverse()
                });
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* KPI Cards */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px' }}>
                    <Users size={32} color="var(--primary)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{loading ? '-' : stats.totalPatients}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Patients Processed</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                    <AlertTriangle size={32} color="var(--danger)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{loading ? '-' : stats.highRiskCount}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Identified High Risk</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px' }}>
                    <Activity size={32} color="var(--accent)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{loading ? '-' : stats.avgRiskScore + '%'}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Average Cohort Risk</p>
                </div>
            </div>

            {/* Recent Analysis Feed */}
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '32px' }}>
                <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <TrendingUp size={24} color="var(--success)" /> Recent Analysis Feed
                </h3>
                {loading ? (
                    <p>Loading cohort data...</p>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {stats.recentActivity.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '8px',
                                borderLeft: `3px solid ${item.risk === 'High' ? 'var(--danger)' : 'var(--success)'}`
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{item.patient_name}</h4>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.date}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        background: item.risk === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: item.risk === 'High' ? 'var(--danger)' : 'var(--success)'
                                    }}>
                                        {item.risk} ({item.score})
                                    </span>
                                </div>
                            </div>
                        ))}
                        {stats.recentActivity.length === 0 && (
                            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No analysis history yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
