import React, { useState } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';

const RiskForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: 'John Smith',
        age: 65,
        gender: 'Male',
        education_level: 12,
        family_history: false,
        variants: [{ variant_id: 'rs429358', gene: 'APOE', genotype: 'e4/e4', allele_frequency: 0.14 }]
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
        }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = field === 'allele_frequency' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { variant_id: `V-00${prev.variants.length + 1} `, gene: '', genotype: '', allele_frequency: 0.0 }]
        }));
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="fade-in">
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Patient Name *</label>
                <input
                    type="text"
                    name="name"
                    placeholder="e.g., John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', opacity: 0.8 }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', opacity: 0.8 }}
                    />
                </div>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Education Level (Years)</label>
                    <input
                        type="number"
                        name="education_level"
                        value={formData.education_level}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', opacity: 0.8 }}
                    />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '28px' }}>
                    <input
                        type="checkbox"
                        name="family_history"
                        checked={formData.family_history}
                        onChange={handleChange}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Family History of Alzheimer's</label>
                </div>
            </div>

            <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Genetic Variants</h3>
                    <button
                        type="button"
                        onClick={addVariant}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--primary)', borderRadius: '6px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        <Plus size={16} /> Add Variant
                    </button>
                </div>

                {formData.variants.map((v, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <input placeholder="ID" value={v.variant_id} onChange={(e) => handleVariantChange(index, 'variant_id', e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '4px' }} />
                        <input placeholder="Gene" value={v.gene} onChange={(e) => handleVariantChange(index, 'gene', e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '4px' }} />
                        <input placeholder="Genotype" value={v.genotype} onChange={(e) => handleVariantChange(index, 'genotype', e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '4px' }} />
                        <input type="number" step="0.01" placeholder="Freq" value={v.allele_frequency} onChange={(e) => handleVariantChange(index, 'allele_frequency', e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '4px' }} />
                        <button type="button" onClick={() => removeVariant(index)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                ))}
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
