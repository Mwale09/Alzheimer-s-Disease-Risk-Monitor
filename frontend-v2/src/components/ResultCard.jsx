import React from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';

const ResultCard = ({ result }) => {
    const { risk_score, risk_category, top_contributing_factors } = result;

    const getCategoryColor = () => {
        if (risk_category === 'Low') return 'var(--success)';
        if (risk_category === 'Moderate') return 'var(--warning)';
        return 'var(--danger)';
    };

    const scorePercentage = (risk_score * 100).toFixed(1);

    return (
        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                        {risk_category === 'High' && <AlertTriangle color="var(--danger)" />}
                        {risk_category === 'Low' && <CheckCircle color="var(--success)" />}
                        {risk_category === 'Moderate' && <Info color="var(--warning)" />}
                        <h2 style={{ fontSize: '1.75rem' }}>{risk_category} Risk</h2>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
                        Based on the clinical history and genetic markers provided, the patient currently exhibits a {risk_category.toLowerCase()} risk profile for Alzheimer's Disease.
                    </p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Key Risk Drivers
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
                                    <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Value: {factor.value}</span>
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
