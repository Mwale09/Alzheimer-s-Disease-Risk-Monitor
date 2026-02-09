import React, { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const ModelSelection = ({ onSelect }) => {
    const [selectedModel, setSelectedModel] = useState('XGBoost');

    const models = [
        {
            name: 'Random Forest',
            description: 'Ensemble method using multiple decision trees for robust predictions',
            metrics: { accuracy: '92.0%', auc: '94.0%', precision: '89%', recall: '88%', f1: '88%', time: '2.3s', specificity: '91%' }
        },
        {
            name: 'XGBoost',
            description: 'Gradient boosting algorithm optimized for speed and performance',
            metrics: { accuracy: '94.0%', auc: '96.0%', precision: '92%', recall: '90%', f1: '91%', time: '3.1s', specificity: '93%' }
        },
        {
            name: 'Deep Neural Network',
            description: 'Multi-layer perceptron with dropout regularization',
            metrics: { accuracy: '90.0%', auc: '93.0%', precision: '88%', recall: '87%', f1: '87%', time: '1.2s', specificity: '89%' }
        },
        {
            name: 'Support Vector Machine',
            description: 'SVM with RBF kernel for non-linear classification',
            metrics: { accuracy: '88.0%', auc: '91.0%', precision: '86%', recall: '85%', f1: '85%', time: '0.8s', specificity: '87%' }
        }
    ];

    return (
        <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Select Machine Learning Model</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                Choose a model for Alzheimer's disease risk prediction. Review performance metrics to make an informed decision.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
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
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{model.name}</h3>
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

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => onSelect(selectedModel)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 48px', background: '#00A19D' }}
                >
                    Confirm Model & Run Analysis <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default ModelSelection;
