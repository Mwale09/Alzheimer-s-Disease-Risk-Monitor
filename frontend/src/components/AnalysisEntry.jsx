import React from 'react';
import { Upload, UserPlus, Info } from 'lucide-react';

const AnalysisEntry = ({ onSelectManual, onSelectUpload }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px' }}>
            <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '1000px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Upload Genotype Data</h2>
                    <Info size={18} color="var(--text-secondary)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Upload File Option */}
                    <div
                        style={{
                            border: '2px solid var(--success)',
                            borderRadius: '16px',
                            padding: '40px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px',
                            backgroundColor: 'rgba(16, 185, 129, 0.02)'
                        }}
                    >
                        <div style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            padding: '16px',
                            borderRadius: '50%',
                            color: 'var(--success)'
                        }}>
                            <Upload size={40} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Upload File</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                Upload a CSV file with multiple patient records for batch processing
                            </p>
                        </div>
                        <button
                            onClick={onSelectUpload}
                            style={{
                                backgroundColor: 'var(--success)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: '10px',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.opacity = '0.9'}
                            onMouseOut={(e) => e.target.style.opacity = '1'}
                        >
                            Select This Option
                        </button>
                    </div>

                    {/* Manual Entry Option */}
                    <div
                        style={{
                            border: '2px solid var(--glass-border)',
                            borderRadius: '16px',
                            padding: '40px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.01)'
                        }}
                    >
                        <div style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            padding: '16px',
                            borderRadius: '50%',
                            color: 'var(--accent-blue)'
                        }}>
                            <UserPlus size={40} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Manual Entry</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                Enter patient data manually for instant individual predictions
                            </p>
                        </div>
                        <button
                            onClick={onSelectManual}
                            style={{
                                backgroundColor: '#00A19D', // Matching the Figma teal-ish button color roughly or using success/primary
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: '10px',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.opacity = '0.9'}
                            onMouseOut={(e) => e.target.style.opacity = '1'}
                        >
                            Select This Option
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisEntry;
