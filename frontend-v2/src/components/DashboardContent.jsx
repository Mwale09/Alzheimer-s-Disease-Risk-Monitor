import React from 'react';
import { Shield, Cpu, Zap, Microscope, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

const DashboardContent = ({ onStartAnalysis }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Hero Section */}
            <section className="glass-card" style={{ padding: '48px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid var(--glass-border)' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Welcome to AD Risk Prediction System
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: '1.6', marginBottom: '32px' }}>
                    An explainable AI platform for predicting Alzheimer's disease risk based on genotype-level data
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Zap size={20} color="var(--success)" /> Start New Analysis
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                            Upload genotype data and run predictions for new patients
                        </p>
                        <button
                            onClick={onStartAnalysis}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                        >
                            Begin analysis <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="glass-card" style={{ padding: '32px', opacity: 0.7 }}>
                        <h3 style={{ marginBottom: '12px' }}>Previous Results</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            No previous results available. Start a new analysis first.
                        </p>
                    </div>
                </div>
            </section>

            {/* System Information */}
            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={24} color="var(--accent-blue)" /> System Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '10px', color: 'var(--accent-blue)' }}>Data Privacy</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            All patient data is processed securely. This system is designed for research and clinical decision support only.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '10px', color: 'var(--accent-purple)' }}>Model Ensemble</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Uses multiple ML algorithms (Random Forest, Gradient Boosting, Neural Networks) for robust predictions.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '10px', color: 'var(--success)' }}>Explainable AI</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Every prediction includes detailed explanations of which genetic variants contribute most to the risk assessment.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '10px', color: 'var(--warning)' }}>Clinical Validation</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Models are validated against established AD cohorts and incorporate known genetic risk factors from literature.
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Terminology */}
            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BookOpen size={24} color="var(--accent-purple)" /> Key Terminology
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '20px', borderLeft: '3px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '0 12px 12px 0' }}>
                        <h4 style={{ marginBottom: '8px' }}>APOE Gene</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Apolipoprotein E - The strongest genetic risk factor for late-onset Alzheimer's disease. APOE ε4 allele significantly increases risk.
                        </p>
                    </div>
                    <div style={{ padding: '20px', borderLeft: '3px solid var(--accent-purple)', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '0 12px 12px 0' }}>
                        <h4 style={{ marginBottom: '8px' }}>SHAP Values</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            SHapley Additive exPlanations - A method to explain individual predictions by computing feature importance.
                        </p>
                    </div>
                    <div style={{ padding: '20px', borderLeft: '3px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0 12px 12px 0' }}>
                        <h4 style={{ marginBottom: '8px' }}>Risk Categories</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Classification system for AD risk: Low (&lt;30%), Moderate (30-50%), High (50-70%), Very High (&gt;70%).
                        </p>
                    </div>
                    <div style={{ padding: '20px', borderLeft: '3px solid var(--warning)', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0 12px 12px 0' }}>
                        <h4 style={{ marginBottom: '8px' }}>Genotype Encoding</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Process of converting genetic variants (e.g., A/A, G/T) into numerical format for machine learning models.
                        </p>
                    </div>
                </div>
            </section>

            {/* Important Notes */}
            <section className="glass-card" style={{ padding: '32px', border: '1px solid rgba(239, 68, 68, 0.1)', background: 'rgba(239, 68, 68, 0.02)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)' }}>
                    <AlertCircle size={24} /> Important Notes for Clinicians
                </h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem', paddingLeft: '20px' }}>
                    <li>This system provides risk assessments based on genetic data and should be used as a clinical decision support tool, not as a sole diagnostic criterion.</li>
                    <li>Risk predictions incorporate multiple genetic variants beyond APOE, providing a more comprehensive assessment than single-gene testing.</li>
                    <li>SHAP values indicate feature importance - higher absolute values mean greater contribution to the prediction.</li>
                    <li>Results should be interpreted in conjunction with clinical assessment, family history, and other biomarkers.</li>
                    <li>This platform is intended for research purposes and clinical decision support in compliance with institutional guidelines.</li>
                </ul>
            </section>
        </div>
    );
};

export default DashboardContent;
