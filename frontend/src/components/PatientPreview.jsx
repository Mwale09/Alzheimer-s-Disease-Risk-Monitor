import React from 'react';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

const PatientPreview = ({ patients, onBack, onProceed }) => {
    return (
        <div className="glass-card" style={{ padding: '32px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ background: 'var(--success)', padding: '8px', borderRadius: '50%', color: 'white' }}>
                    <Zap size={20} fill="white" />
                </div>
                <div>
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>File loaded: manual_entry_data</span>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{patients.length} patient(s) ready for analysis</p>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '16px', color: 'var(--text-primary)' }}>Name</th>
                            <th style={{ padding: '16px', color: 'var(--text-primary)' }}>Age</th>
                            <th style={{ padding: '16px', color: 'var(--text-primary)' }}>Gender</th>
                            <th style={{ padding: '16px', color: 'var(--text-primary)' }}>Variant ID</th>
                            <th style={{ padding: '16px', color: 'var(--text-primary)' }}>Gene</th>
                            <th style={{ padding: '16px', color: 'var(--text-primary)' }}>Genotype</th>
                            <th style={{ padding: '16px', color: 'var(--text-primary)' }}>Allele Freq</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p, pIdx) => (
                            <React.Fragment key={pIdx}>
                                {p.variants.map((v, vIdx) => (
                                    <tr key={`${pIdx}-${vIdx}`} style={{ borderBottom: vIdx === p.variants.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                                        {vIdx === 0 && (
                                            <>
                                                <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 500 }} rowSpan={p.variants.length}>{p.name}</td>
                                                <td style={{ padding: '16px' }} rowSpan={p.variants.length}>{p.age}</td>
                                                <td style={{ padding: '16px' }} rowSpan={p.variants.length}>{p.gender}</td>
                                            </>
                                        )}
                                        <td style={{ padding: '16px' }}>{v.variant_id}</td>
                                        <td style={{ padding: '16px', color: 'var(--success)', fontWeight: 600 }}>{v.gene}</td>
                                        <td style={{ padding: '16px' }}>{v.genotype}</td>
                                        <td style={{ padding: '16px' }}>{v.allele_frequency}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Back to Selection
                </button>
                <button
                    onClick={onProceed}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', background: '#00A19D' }}
                >
                    Proceed to Preprocessing <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default PatientPreview;
