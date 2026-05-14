import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const RiskForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: 'John Smith',
        age: 65,
        gender: 'Male',
        education_level: 12,
        genotype: 'e4/e4',
        allele_frequency: 0.14,
        snp_id: 'rs429358',
        risk_allele: 'C',
        gene: 'APOE',
        pvalue: 0.001,
        risk_frequency: 0.12,
        beta: 1.2
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!formData.name || formData.name.trim() === '') {
            setError('Patient Name is required.');
            return;
        }

        const age = parseInt(formData.age);
        if (isNaN(age) || age < 0 || age > 150) {
            setError('Please enter a valid age between 0 and 150.');
            return;
        }

        if (!formData.snp_id || formData.snp_id.trim() === '') {
            setError('SNP ID is required.');
            return;
        }

        // Map to backend schema
        const payload = {
            name: formData.name,
            age: age,
            gender: formData.gender,
            education_level: parseInt(formData.education_level) || 0,
            family_history: false, // Legacy field fallback
            variants: [{
                snp_id: formData.snp_id,
                gene: formData.gene,
                genotype: formData.genotype,
                allele_frequency: parseFloat(formData.allele_frequency) || 0.0,
                risk_allele: formData.risk_allele,
                pvalue: parseFloat(formData.pvalue) || 0.0,
                risk_frequency: parseFloat(formData.risk_frequency) || 0.0,
                beta: parseFloat(formData.beta) || 0.0
            }]
        };

        onSubmit(payload);
    };

    const renderInput = (label, name, type = "text", step = null) => (
        <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</label>
            <input
                type={type}
                name={name}
                step={step}
                value={formData[name]}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', opacity: 0.8 }}
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="fade-in">
            {error && (
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', border: '1px solid var(--danger)', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {renderInput('Patient Name', 'name')}
                {renderInput('Age', 'age', 'number')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', opacity: 0.8 }}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {renderInput('Education Level (Years)', 'education_level', 'number')}
            </div>

            <hr style={{ borderTop: '1px solid var(--glass-border)', margin: '8px 0' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '-8px' }}>Genomic Profile</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                {renderInput('SNP ID', 'snp_id')}
                {renderInput('Gene', 'gene')}
                {renderInput('Genotype', 'genotype')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                {renderInput('Risk Allele', 'risk_allele')}
                {renderInput('Allele Frequency', 'allele_frequency', 'number', '0.01')}
                {renderInput('Risk Frequency', 'risk_frequency', 'number', '0.01')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {renderInput('P-Value', 'pvalue', 'number', 'any')}
                {renderInput('Beta', 'beta', 'number', '0.01')}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '50px' }}
            >
                {loading ? 'Running Neuro-Analysis...' : (
                    <>
                        <Zap size={20} fill="white" /> Run Analysis
                    </>
                )}
            </button>
        </form>
    );
};

export default RiskForm;
