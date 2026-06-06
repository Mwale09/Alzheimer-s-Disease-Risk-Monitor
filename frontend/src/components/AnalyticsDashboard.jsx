import React, { useEffect, useState } from 'react';
import { getHistory, getHistoryDetail } from '../api';
import { Users, Activity, BrainCircuit, TrendingUp, AlertTriangle, Eye, PieChart as PieIcon, BarChart3, TrendingUp as TrendsIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import ResultCard from './ResultCard';

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        highRiskCount: 0,
        avgRiskScore: 0,
        recentActivity: [],
        ageData: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [showHighRiskOnly, setShowHighRiskOnly] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            const history = await getHistory();
            if (history) {
                const total = history.length;
                const highRisk = history.filter(h => h.risk === 'High' || h.risk === 'Very High').length;
                const avgScore = total > 0
                    ? (history.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / total).toFixed(1)
                    : 0;

                // Process Age Data
                const ageBins = { '40-50': 0, '51-60': 0, '61-70': 0, '71-80': 0, '81+': 0 };
                history.forEach(h => {
                    const age = parseInt(h.age);
                    if (age <= 50) ageBins['40-50']++;
                    else if (age <= 60) ageBins['51-60']++;
                    else if (age <= 70) ageBins['61-70']++;
                    else if (age <= 80) ageBins['71-80']++;
                    else ageBins['81+']++;
                });
                const ageData = Object.keys(ageBins).map(key => ({ range: key, count: ageBins[key] }));

                setStats({
                    totalPatients: total,
                    highRiskCount: highRisk,
                    avgRiskScore: avgScore,
                    recentActivity: history.slice().reverse().map(h => ({
                        ...h,
                        scoreValue: parseFloat(h.score) || 0
                    })),
                    ageData
                });
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const viewPatientDetails = async (id) => {
        setLoadingDetail(true);
        try {
            const detail = await getHistoryDetail(id);
            setSelectedReport(detail);
        } catch (error) {
            console.error("Failed to load patient detail", error);
        } finally {
            setLoadingDetail(false);
        }
    };

    if (selectedReport) {
        return (
            <div className="fade-in">
                <button
                    onClick={() => setSelectedReport(null)}
                    style={{
                        marginBottom: '24px',
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <BrainCircuit size={18} /> Back to Cohort Overview
                </button>
                <ResultCard result={selectedReport} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="fade-in">
            {/* KPI Header Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                        <Users size={80} color="var(--primary)" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Patient Cohort</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{loading ? '...' : stats.totalPatients}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'var(--primary)', fontSize: '0.85rem' }}>
                        <TrendingUp size={14} /> Active monitoring enabled
                    </div>
                </div>

                <div
                    className="glass-card"
                    onClick={() => setShowHighRiskOnly(!showHighRiskOnly)}
                    style={{
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: showHighRiskOnly ? '2px solid var(--danger)' : '1px solid var(--glass-border)',
                        boxShadow: showHighRiskOnly ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none',
                        transition: 'all 0.2s ease',
                        background: showHighRiskOnly ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-card)'
                    }}
                >
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                        <AlertTriangle size={80} color="var(--danger)" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>High Risk Identifications</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--danger)' }}>{loading ? '...' : stats.highRiskCount}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'var(--danger)', fontSize: '0.85rem' }}>
                        {showHighRiskOnly ? 'Filtering feed...' : 'Click to filter feed'}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                        <Activity size={80} color="var(--accent)" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Average Risk Score</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--accent)' }}>{loading ? '...' : stats.avgRiskScore + '%'}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'var(--accent)', fontSize: '0.85rem' }}>
                        Within predicted variance
                    </div>
                </div>
            </div>

            {/* Visual Analytics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
                {/* Risk Distribution */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PieIcon size={20} color="var(--primary)" /> Risk Distribution
                        </h4>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Low/Medium Risk', value: stats.totalPatients - stats.highRiskCount },
                                        { name: 'High/Very High', value: stats.highRiskCount }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    <Cell fill="var(--success)" opacity={0.8} />
                                    <Cell fill="var(--danger)" opacity={0.8} />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Patient Risk Progression - Promoted Position */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendsIcon size={20} color="var(--success)" /> Patient Risk Progression
                        </h4>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.recentActivity.slice(0, 10).reverse()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="patient_name" hide />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="scoreValue" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={25} animationDuration={1500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Age Demographics */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart3 size={20} color="var(--accent-blue)" /> Age Demographics
                        </h4>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.ageData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="range" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Comprehensive Patient Feed */}
            <div className="glass-card" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Cohort Patient Feed</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '0.9rem' }}>Real-time analysis results for all cohort members</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    paddingRight: '36px',
                                    background: 'var(--bg-dark)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    width: '250px',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                            <Activity size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                        </div>
                        <button
                            onClick={() => setShowHighRiskOnly(!showHighRiskOnly)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid ' + (showHighRiskOnly ? 'var(--danger)' : 'var(--glass-border)'),
                                background: showHighRiskOnly ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                color: showHighRiskOnly ? 'var(--danger)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                outline: 'none'
                            }}
                        >
                            <AlertTriangle size={16} color={showHighRiskOnly ? 'var(--danger)' : 'var(--text-secondary)'} />
                            {showHighRiskOnly ? 'Show All' : 'High Risk Only'}
                        </button>
                        <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Showing:</span> {stats.recentActivity.filter(i => {
                                const matchesSearch = i.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toString().includes(searchTerm);
                                const matchesFilter = showHighRiskOnly ? (i.risk === 'High' || i.risk === 'Very High') : true;
                                return matchesSearch && matchesFilter;
                            }).length} Records
                        </div>
                    </div>
                </div>

                {loading || loadingDetail ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <Activity className="spin" size={40} color="var(--primary)" />
                        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Synchronizing cohort data...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 100px',
                            padding: '12px 24px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            <span>Patient Profile</span>
                            <span>Demographics</span>
                            <span>Analysis Score</span>
                            <span>Time Series</span>
                            <span style={{ textAlign: 'right' }}>Action</span>
                        </div>
                        {stats.recentActivity
                            .filter(item => {
                                const matchesSearch = item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toString().includes(searchTerm);
                                const matchesFilter = showHighRiskOnly ? (item.risk === 'High' || item.risk === 'Very High') : true;
                                return matchesSearch && matchesFilter;
                            })
                            .map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 100px',
                                    alignItems: 'center',
                                    padding: '20px 24px',
                                    background: 'rgba(255,255,255,0.01)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                    className="feed-item"
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                                >
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: item.risk === 'High' || item.risk === 'Very High' ? 'var(--danger)' : 'var(--success)' }}></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                                            <Users size={20} color="var(--text-secondary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{item.patient_name}</h4>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CASE_ID: {item.id}</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>{item.age}y</span> • <span style={{ color: 'var(--text-secondary)' }}>{item.gender}</span>
                                    </div>
                                    <div>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            background: item.risk === 'High' || item.risk === 'Very High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: item.risk === 'High' || item.risk === 'Very High' ? 'var(--danger)' : 'var(--success)',
                                            border: `1px solid ${item.risk === 'High' || item.risk === 'Very High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                        }}>
                                            {item.score}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.date}</div>
                                    <button
                                        onClick={() => viewPatientDetails(item.id)}
                                        style={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            border: '1px solid rgba(59, 130, 246, 0.2)',
                                            color: 'var(--primary)',
                                            cursor: 'pointer',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            marginLeft: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <Eye size={14} /> Profile
                                    </button>
                                </div>
                            ))}
                        {stats.recentActivity.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
                                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>No analysis history yet in database.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
