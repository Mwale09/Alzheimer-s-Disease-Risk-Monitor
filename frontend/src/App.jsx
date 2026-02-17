import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Activity,
  ShieldCheck,
  BrainCircuit,
  Loader2,
  Upload,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RiskForm from './components/RiskForm';
import ResultCard from './components/ResultCard';
import Login from './components/Login';
import DashboardContent from './components/DashboardContent';
import AnalysisEntry from './components/AnalysisEntry';
import PatientPreview from './components/PatientPreview';
import ModelSelection from './components/ModelSelection';
import Settings from './components/Settings';
import { getPredictions } from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [analysisStep, setAnalysisStep] = useState('entry');
  const [analysisMode, setAnalysisMode] = useState('selection');
  const [preparedPatients, setPreparedPatients] = useState([]);
  const [selectedModel, setSelectedModel] = useState('XGBoost');
  const [darkMode, setDarkMode] = useState(true);

  // Persistent Auth & Theme
  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') setIsLoggedIn(true);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setDarkMode(false);
  }, []);

  useEffect(() => {
    console.log("Current darkMode state:", darkMode);
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      console.log("Applied theme: dark");
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      console.log("Applied theme: light");
    }
  }, [darkMode]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // Will hold array of results
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

      console.log("File loaded, rows:", lines.length);

      const csvRows = lines.slice(1);
      const patientsMap = {};

      csvRows.forEach((row, index) => {
        if (!row.trim()) return;
        const cols = row.split(',').map(c => c.trim());

        // Basic validation: need at least Name and Age
        if (cols.length < 2) {
          console.warn(`Row ${index + 2} is invalid: too few columns.`);
          return;
        }

        const [name, age, gender, education, familyHistory, variantId, gene, genotype, af] = cols;

        if (!patientsMap[name]) {
          patientsMap[name] = {
            name: name || `Patient ${index + 1}`,
            age: parseInt(age) || 65,
            gender: gender || 'Unknown',
            education_level: parseInt(education) || 12,
            family_history: familyHistory ? (familyHistory.toLowerCase() === 'true' || familyHistory === '1') : false,
            variants: []
          };
        }

        if (variantId || gene) {
          patientsMap[name].variants.push({
            variant_id: variantId || 'N/A',
            gene: gene || 'N/A',
            genotype: genotype || 'N/A',
            allele_frequency: parseFloat(af) || 0.0
          });
        }
      });

      const parsedPatients = Object.values(patientsMap);
      console.log("Parsed patients:", parsedPatients);

      if (parsedPatients.length > 0) {
        setPreparedPatients(parsedPatients);
        setAnalysisStep('preview');
      } else {
        const msg = 'No valid patient data found in CSV. Please ensure the format matches: Name,Age,Gender,Education,FamilyHistory,VariantID,Gene,Genotype,AF';
        console.error(msg);
        setError(msg);
      }
    };
    reader.readAsText(file);
  };

  const handleRunAnalysis = async (modelName) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setSelectedResultIndex(0);
    setAnalysisStep('result');
    try {
      if (preparedPatients.length > 1) {
        // Batch Prediction
        const { getBatchPredictions } = await import('./api');
        const results = await getBatchPredictions(preparedPatients, modelName);
        setResult(results);
      } else {
        // Single Prediction
        const data = await getPredictions(preparedPatients[0], modelName);
        setResult([data]); // Store as array for consistency
      }
    } catch (err) {
      setError('Analysis failed. Please check your connection to the Neuro-Service.');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'New Analysis', icon: <UserPlus size={20} /> },
    { name: 'Cohort Analytics', icon: <BrainCircuit size={20} /> }, // New Tab
    { name: 'Reports', icon: <FileText size={20} /> },
    { name: 'Settings', icon: <SettingsIcon size={20} /> },
  ];

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', transition: 'background 0.3s ease' }}>

      {/* Top Navigation Bar - Command Center Style */}
      <nav className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 32px',
        margin: '0',
        borderRadius: '0',
        border: 'none',
        borderBottom: '1px solid var(--glass-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-primary)' }}>
            <BrainCircuit color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>AD Predict <span style={{ opacity: 0.5, fontWeight: 400 }}>Pro</span></h1>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          {['Dashboard', 'New Analysis', 'Cohort Analytics', 'Settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'New Analysis') {
                  setAnalysisStep('entry');
                  setAnalysisMode('selection');
                  setResult(null);
                  setPreparedPatients([]);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: activeTab === tab ? 600 : 500,
                fontSize: '0.9rem'
              }}
            >
              {tab === 'Dashboard' && <LayoutDashboard size={16} />}
              {tab === 'New Analysis' && <Activity size={16} />}
              {tab === 'Cohort Analytics' && <BrainCircuit size={16} />}
              {tab === 'Settings' && <SettingsIcon size={16} />}
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right', marginRight: '8px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Dr. User</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Neurologist</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 700 }}>{activeTab}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome to your Neuro-Command Center</p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
              <ShieldCheck size={18} color="var(--success)" />
              <span style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600 }}>System Secure</span>
            </div>
          </div>
        </header>

        {activeTab === 'Dashboard' && (
          <DashboardContent onStartAnalysis={() => {
            setActiveTab('New Analysis');
            setAnalysisMode('selection');
          }} />
        )}

        {activeTab === 'New Analysis' && (
          <div style={{ width: '100%' }}>
            {analysisStep === 'entry' && (
              <>
                {analysisMode === 'selection' && (
                  <AnalysisEntry
                    onSelectManual={() => setAnalysisMode('manual')}
                    onSelectUpload={() => setAnalysisMode('upload')}
                  />
                )}

                {analysisMode === 'manual' && (
                  <div className="glass-card" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h2 style={{ margin: 0 }}>Manual Patient Entry</h2>
                      <button
                        onClick={() => setAnalysisMode('selection')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        ← Back to Options
                      </button>
                    </div>
                    <RiskForm onSubmit={(data) => {
                      setPreparedPatients([data]);
                      setAnalysisStep('preview');
                    }} loading={loading} />
                  </div>
                )}

                {analysisMode === 'upload' && (
                  <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                      <h2 style={{ margin: 0 }}>Upload Genotype Data</h2>
                      <button
                        onClick={() => setAnalysisMode('selection')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        ← Back to Options
                      </button>
                    </div>

                    <input
                      type="file"
                      id="csvUpload"
                      accept=".csv"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />

                    <label
                      htmlFor="csvUpload"
                      style={{
                        display: 'block',
                        padding: '64px',
                        border: '2px dashed var(--glass-border)',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.01)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                    >
                      <Upload size={48} style={{ marginBottom: '16px', color: 'var(--text-secondary)' }} />
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Click to select a CSV file</p>
                      <span className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Browse Files</span>
                    </label>
                  </div>
                )}
              </>
            )}

            {analysisStep === 'preview' && (
              <PatientPreview
                patients={preparedPatients}
                onBack={() => setAnalysisStep('entry')}
                onProceed={() => setAnalysisStep('model_selection')}
              />
            )}

            {analysisStep === 'model_selection' && (
              <ModelSelection
                onSelect={(model) => {
                  setSelectedModel(model);
                  handleRunAnalysis(model);
                }}
              />
            )}

            {analysisStep === 'result' && (
              <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                  <h2 style={{ marginBottom: '16px' }}>Analysis Progress</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Model: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedModel}</span>
                  </p>

                  {loading && (
                    <div style={{ padding: '40px' }}>
                      <Activity size={48} className="spin" style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                      <p>Generating Neuro-Explainability Maps...</p>
                    </div>
                  )}

                  {!loading && !error && result && result.length > 0 && (
                    <div>
                      <ShieldCheck size={48} color="var(--success)" style={{ marginBottom: '16px' }} />
                      <p style={{ color: 'var(--success)', fontWeight: 600 }}>Analysis Complete</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Processed {result.length} patient(s)
                      </p>

                      {result.length > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                          <button
                            onClick={() => setSelectedResultIndex(prev => Math.max(0, prev - 1))}
                            disabled={selectedResultIndex === 0}
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--glass-border)',
                              color: selectedResultIndex === 0 ? 'var(--text-secondary)' : 'var(--primary)',
                              padding: '8px',
                              borderRadius: '8px',
                              cursor: selectedResultIndex === 0 ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            {selectedResultIndex + 1} / {result.length}
                          </span>
                          <button
                            onClick={() => setSelectedResultIndex(prev => Math.min(result.length - 1, prev + 1))}
                            disabled={selectedResultIndex === result.length - 1}
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--glass-border)',
                              color: selectedResultIndex === result.length - 1 ? 'var(--text-secondary)' : 'var(--primary)',
                              padding: '8px',
                              borderRadius: '8px',
                              cursor: selectedResultIndex === result.length - 1 ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setAnalysisStep('entry');
                          setResult(null);
                          setPreparedPatients([]);
                        }}
                        className="btn-primary"
                        style={{ background: 'transparent', border: '1px solid var(--glass-border)', width: '100%' }}
                      >
                        New Analysis
                      </button>
                    </div>
                  )}

                  {error && (
                    <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', border: '1px solid var(--danger)' }}>
                      {error}
                      <button onClick={() => setAnalysisStep('model_selection')} style={{ display: 'block', margin: '12px auto', background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>Try Again</button>
                    </div>
                  )}
                </div>
                {result && result[selectedResultIndex] && (
                  <div style={{ animation: 'fade-in 0.5s ease-out' }}>
                    <div style={{
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '0 8px'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '24px',
                        background: 'var(--primary)',
                        borderRadius: '4px'
                      }}></div>
                      <h3 style={{
                        fontSize: '1.2rem',
                        margin: 0,
                        color: 'var(--text-primary)'
                      }}>
                        Patient: {result[selectedResultIndex].patient_name}
                      </h3>
                    </div>
                    <ResultCard result={result[selectedResultIndex]} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Cohort Analytics' && <AnalyticsDashboard />}

        {activeTab === 'Settings' && (
          <Settings darkMode={darkMode} toggleTheme={toggleTheme} />
        )}

      </main>
    </div>
  );
}

export default App;
