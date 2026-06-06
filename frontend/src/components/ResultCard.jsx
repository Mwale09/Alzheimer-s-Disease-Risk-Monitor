import React from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ResultCard = ({ result, onBack }) => {
    const { risk_score, risk_category, top_contributing_factors, patient_name, age, gender, model_metrics } = result;

    const getCategoryColor = () => {
        if (risk_category === 'Low') return 'var(--success)';
        if (risk_category === 'Moderate') return 'var(--warning)';
        return 'var(--danger)';
    };

    const scorePercentage = (risk_score * 100).toFixed(1);

    // Data for Demographic Pie Chart (Visualizing the weight of non-genetic factors)
    // In a real app these weights would come from the model
    const demographicData = [
        { name: 'Age', value: age },
        { name: 'Education', value: result.education_level || 12 },
        { name: 'Family History', value: result.family_history ? 20 : 5 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Data for Genetic Variants Bar Chart
    const geneticData = top_contributing_factors.map(f => ({
        name: f.feature.length > 10 ? f.feature.substring(0, 10) + '...' : f.feature,
        fullName: f.feature,
        contribution: Math.abs(parseFloat(f.shap_value) * 100).toFixed(2),
        type: f.shap_value > 0 ? 'Increase' : 'Decrease'
    }));

    return (
        <div style={{ marginTop: '0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {onBack && (
                <button
                    onClick={onBack}
                    style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Back to Analysis
                </button>
            )}

            <div className="glass-card" style={{ padding: '32px', borderLeft: `6px solid ${getCategoryColor()}`, display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle
                            cx="60" cy="60" r="54" fill="none"
                            stroke={getCategoryColor()}
                            strokeWidth="8"
                            strokeDasharray="339.29"
                            strokeDashoffset={339.29 * (1 - risk_score)}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                        />
                    </svg>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{scorePercentage}%</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Score</p>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        {(risk_category === 'High' || risk_category === 'Very High') && <AlertTriangle color="var(--danger)" />}
                        {risk_category === 'Low' && <CheckCircle color="var(--success)" />}
                        {risk_category === 'Moderate' && <Info color="var(--warning)" />}
                        <h2 style={{ fontSize: '1.75rem' }}>{risk_category} Risk</h2>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
                        Patient: <strong>{patient_name}</strong>. Based on clinical history and genetic markers, the patient exhibits a {risk_category.toLowerCase()} risk profile for Alzheimer's Disease.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Pie Chart for Factor Distribution */}
                <div className="glass-card" style={{ padding: '24px', height: '350px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Relative Risk Contribution (Demographics)</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie
                                data={demographicData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {demographicData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart for Genetic Impacts */}
                <div className="glass-card" style={{ padding: '24px', height: '350px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: 'var(--primary)' }}>Variant Contribution Weight</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={geneticData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                            <XAxis dataKey="name" fontSize={10} stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                            <YAxis fontSize={10} stroke="var(--text-secondary)" tickLine={false} axisLine={false} unit="%" />
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                            <Bar dataKey="contribution" fill="var(--primary)" radius={[4, 4, 0, 0]} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>



            <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Explainable AI: Key Risk Drivers
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {top_contributing_factors.map((factor, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '10px' }}>
                            <div style={{
                                background: factor.shap_value > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: factor.shap_value > 0 ? 'var(--danger)' : 'var(--success)',
                                padding: '8px',
                                borderRadius: '8px'
                            }}>
                                {factor.shap_value > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 600 }}>{factor.feature}</span>
                                    <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Individual Value: {factor.value}</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(100, Math.abs(factor.shap_value) * 100)}%`,
                                        background: factor.shap_value > 0 ? 'var(--danger)' : 'var(--success)',
                                        transition: 'width 1s ease-out'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
