import React from 'react';
import { ArrowLeft, ArrowRight, Zap, Loader2 } from 'lucide-react';

const PatientPreview = ({ patients, onBack, onProceed }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showAll, setShowAll] = React.useState(false);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.variants.some(v => v.gene.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const displayedPatients = showAll ? filteredPatients : filteredPatients.slice(0, 5);

    const [processingStep, setProcessingStep] = React.useState(0);

    React.useEffect(() => {
        const timer1 = setTimeout(() => setProcessingStep(1), 800);
        const timer2 = setTimeout(() => setProcessingStep(2), 1600);
        const timer3 = setTimeout(() => setProcessingStep(3), 2400);
        return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }, []);

    return (
        <div className="glass-card" style={{ padding: '32px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid var(--success)', opacity: 0.9, flex: 1, marginRight: '20px' }}>
                    <div style={{ background: 'var(--success)', padding: '8px', borderRadius: '50%', color: 'white' }}>
                        <Zap size={20} fill="white" />
                    </div>
                    <div>
                        <span style={{ fontWeight: 600, color: 'var(--success)' }}>Data Source: {patients.length > 1 ? 'CSV Upload' : 'Manual Entry'}</span>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{patients.length} patient(s) ready for analysis</p>
                    </div>
                </div>

                <div style={{ position: 'relative', width: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search patient or gene..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'white'
                        }}
                    />
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
                        {displayedPatients.map((p, pIdx) => (
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
                        {displayedPatients.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No patients found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredPatients.length > 5 && (
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        {showAll ? 'View Less' : `View All patients (${filteredPatients.length})`}
                    </button>
                </div>
            )}

            <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Data Preprocessing Steps</h3>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.9rem' }}>Required Fields Validation</span>
                            <span style={{ fontSize: '0.8rem', color: processingStep >= 1 ? 'var(--success)' : 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {processingStep >= 1 ? 'Passed ✓' : <><Loader2 size={12} className="spin" /> Processing...</>}
                            </span>
                        </div>
                        <div style={{ height: '6px', background: processingStep >= 1 ? 'var(--success)' : 'var(--glass-border)', borderRadius: '3px', opacity: processingStep >= 1 ? 0.3 : 0.1, overflow: 'hidden', position: 'relative' }}>
                            {processingStep < 1 && <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '30%', background: 'var(--primary)', animation: 'slide 1s infinite' }} />}
                        </div>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.9rem' }}>Format Standardization</span>
                            <span style={{ fontSize: '0.8rem', color: processingStep >= 2 ? 'var(--success)' : (processingStep === 1 ? 'var(--primary)' : 'var(--text-secondary)'), fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {processingStep >= 2 ? 'Passed ✓' : (processingStep === 1 ? <><Loader2 size={12} className="spin" /> Processing...</> : 'Waiting...')}
                            </span>
                        </div>
                        <div style={{ height: '6px', background: processingStep >= 2 ? 'var(--success)' : 'var(--glass-border)', borderRadius: '3px', opacity: processingStep >= 2 ? 0.3 : 0.1, overflow: 'hidden', position: 'relative' }}>
                            {processingStep === 1 && <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '30%', background: 'var(--primary)', animation: 'slide 1s infinite' }} />}
                        </div>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.9rem' }}>Data Cleaning (Auto)</span>
                            <span style={{ fontSize: '0.8rem', color: processingStep >= 3 ? 'var(--success)' : (processingStep === 2 ? 'var(--primary)' : 'var(--text-secondary)'), fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {processingStep >= 3 ? 'Passed ✓' : (processingStep === 2 ? <><Loader2 size={12} className="spin" /> Processing...</> : 'Waiting...')}
                            </span>
                        </div>
                        <div style={{ height: '6px', background: processingStep >= 3 ? 'var(--success)' : 'var(--glass-border)', borderRadius: '3px', opacity: processingStep >= 3 ? 0.3 : 0.1, overflow: 'hidden', position: 'relative' }}>
                            {processingStep === 2 && <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '30%', background: 'var(--primary)', animation: 'slide 1s infinite' }} />}
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes slide {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                `}</style>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Back to Selection
                </button>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        className="btn-primary"
                        style={{ background: 'transparent', border: '1px solid var(--glass-border)', padding: '12px 24px' }}
                    >
                        Re-Validate
                    </button>
                    <button
                        onClick={onProceed}
                        disabled={processingStep < 3}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', opacity: processingStep < 3 ? 0.5 : 1, cursor: processingStep < 3 ? 'not-allowed' : 'pointer' }}
                    >
                        Run Prediction <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientPreview;
