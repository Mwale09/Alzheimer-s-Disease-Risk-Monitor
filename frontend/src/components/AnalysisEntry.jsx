import React from 'react';
import { Upload, UserPlus, Info } from 'lucide-react';

const AnalysisEntry = ({ onSelectManual, onSelectUpload }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px' }} className="fade-in">
            <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '1000px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Choose Analysis Method</h2>
                    <Info size={18} color="var(--text-secondary)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Upload File Option */}
                    <div
                        className="glass-card"
                        style={{
                            border: '2px solid var(--success)',
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
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Upload File</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                Upload a CSV file with multiple patient records for batch processing
                            </p>
                        </div>
                        <button
                            onClick={onSelectUpload}
                            className="btn-primary"
                            style={{
                                backgroundColor: 'var(--success)',
                                marginTop: '10px'
                            }}
                        >
                            Select This Option
                        </button>
                    </div>

                    {/* Manual Entry Option */}
                    <div
                        className="glass-card"
                        style={{
                            border: '2px solid var(--primary)',
                            padding: '40px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px',
                            backgroundColor: 'rgba(56, 189, 248, 0.02)'
                        }}
                    >
                        <div style={{
                            backgroundColor: 'rgba(56, 189, 248, 0.1)',
                            padding: '16px',
                            borderRadius: '50%',
                            color: 'var(--primary)'
                        }}>
                            <UserPlus size={40} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Manual Entry</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                Enter patient data manually for instant individual predictions
                            </p>
                        </div>
                        <button
                            onClick={onSelectManual}
                            className="btn-primary"
                            style={{
                                marginTop: '10px'
                            }}
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
