import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Zap } from 'lucide-react';

const ModelSelection = ({ onSelect, onBack }) => {
    const [selectedModel, setSelectedModel] = useState('XGBoost');

    const models = [
        {
            name: 'XGBoost',
            description: 'Optimized gradient boosting algorithm. Primary engine for AD Predictor.',
            metrics: { accuracy: '94.0%', auc: '96.0%', precision: '92%', recall: '90%', f1: '91%', time: '3.1s', specificity: '93%' }
        }
    ];

    return (
        <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Select Analysis Engine</h2>
                <button
                    onClick={onBack}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Back to Preview
                </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                XGBoost is the recommended engine for this dataset based on latest benchmarks.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 600px)', justifyContent: 'center', gap: '32px' }}>
                {models.map((model) => (
                    <div
                        key={model.name}
                        onClick={() => setSelectedModel(model.name)}
                        style={{
                            padding: '32px',
                            borderRadius: '16px',
                            border: `2px solid ${selectedModel === model.name ? 'var(--success)' : 'var(--glass-border)'}`,
                            background: selectedModel === model.name ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255, 255, 255, 0.01)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{model.name}</h3>
                            <Zap color="var(--success)" fill="var(--success)" size={24} />
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>{model.description}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Accuracy</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{model.metrics.accuracy}</p>
                            </div>
                            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AUC-ROC</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{model.metrics.auc}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                            <span>Precision: {model.metrics.precision}</span>
                            <span>Recall: {model.metrics.recall}</span>
                            <span>F1-Score: {model.metrics.f1}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={() => onSelect(selectedModel)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 48px', background: '#00A19D' }}
                >
                    Confirm Engine & Run Analysis <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default ModelSelection;
