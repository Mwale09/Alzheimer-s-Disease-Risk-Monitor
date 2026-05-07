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

const ProcessingOverlay = ({ message, progress }) => (
  <div className="glass-overlay animate-fade-in-up">
    <div style={{ textAlign: 'center', padding: '40px', width: '100%', maxWidth: '500px' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }}></div>
        <BrainCircuit size={120} className="animate-pulse" style={{ color: 'var(--primary)', position: 'relative', zIndex: 1 }} />
      </div>
      <h2 className="gradient-text-animate" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '12px' }}>
        {message || 'Running AI Prediction Models...'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '32px' }}>
        SYNTHESIZING GENETIC DATA & NEURAL MAPPING
      </p>

      {/* Stylish Progress Bar */}
      <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
            boxShadow: '0 0 15px var(--primary)',
            transition: 'width 0.3s ease-out',
            borderRadius: '10px'
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{progress < 100 ? 'PROCESSING...' : 'COMPLETE'}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{progress}%</span>
      </div>
    </div>
  </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [analysisStep, setAnalysisStep] = useState('entry');
  const [analysisMode, setAnalysisMode] = useState('selection');
  const [preparedPatients, setPreparedPatients] = useState([]);
  const [selectedModel, setSelectedModel] = useState('XGBoost');
  const [darkMode, setDarkMode] = useState(true);
  const [userName, setUserName] = useState('Dr. User');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Persistent Auth & Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setDarkMode(false);

    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName);
  }, []);

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

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

  const handleLogin = (name) => {
    if (name) {
      setUserName(name);
      localStorage.setItem('userName', name);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    import('./api').then(apiModule => {
      if (apiModule.logoutUser) apiModule.logoutUser();
    });
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

    // Validate file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      const msg = 'Invalid file type. Please upload a CSV file.';
      console.error(msg);
      setError(msg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      console.log("File loaded, rows:", lines.length);

      // Validate required headers
      const requiredHeaders = ['name', 'age']; // Minimum required for basic processing, can adjust
      const hasRequiredHeaders = requiredHeaders.every(req => headers.some(h => h.includes(req)));

      if (!hasRequiredHeaders) {
        const msg = 'Invalid CSV format. Required columns missing (e.g., Name, Age). Please ensure the format matches the system requirements.';
        console.error(msg);
        setError(msg);
        return;
      }

      const csvRows = lines.slice(1);
      const patientsMap = {};

      let validRows = 0;

      csvRows.forEach((row, index) => {
        if (!row.trim()) return;
        const cols = row.split(',').map(c => c.trim());

        // Basic validation: need at least Name and Age
        if (cols.length < 2) {
          console.warn(`Row ${index + 2} is invalid: too few columns.`);
          return;
        }

        const [name, age, gender, education, familyHistory, variantId, gene, genotype, af] = cols;

        // More validation
        const parsedAge = parseInt(age);
        if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 150) {
          console.warn(`Row ${index + 2} has invalid age: ${age}`);
          return;
        }

        validRows++;

        if (!patientsMap[name]) {
          patientsMap[name] = {
            name: name || `Patient ${index + 1}`,
            age: parsedAge,
            gender: gender || 'Unknown',
            education_level: parseInt(education) || 12,
            family_history: familyHistory ? (familyHistory.toLowerCase() === 'true' || familyHistory === '1' || familyHistory.toLowerCase() === 'yes') : false,
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

      if (parsedPatients.length > 0 && validRows > 0) {
        setPreparedPatients(parsedPatients);
        setAnalysisStep('preview');
        setError(null); // Clear any previous errors
      } else {
        const msg = 'No valid patient data found. Minimum requirements: Name and Age.';
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
    setAnalysisProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev < 90) return prev + Math.floor(Math.random() * 10) + 1;
        return prev;
      });
    }, 300);

    try {
      if (preparedPatients.length > 1) {
        // Batch Prediction
        const { getBatchPredictions } = await import('./api');
        const results = await getBatchPredictions(preparedPatients, modelName);
        setResult(results);
      } else {
        // Single Prediction
        const { getPredictions } = await import('./api');
        const data = await getPredictions(preparedPatients[0], modelName);
        setResult([data]); // Store as array for consistency
      }
      setAnalysisProgress(100);
      // Wait a bit at 100% for the user to see "COMPLETE"
      await new Promise(r => setTimeout(r, 800));
      setAnalysisStep('result');
    } catch (err) {
      setError('Analysis failed. Please check your connection to the Neuro-Service.');
      setAnalysisStep('entry'); // Fallback on error
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const handleViewHistoryReport = async (reportSummary) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setSelectedResultIndex(0);
    setActiveTab('New Analysis'); // Switch to analysis view to show results
    setAnalysisStep('result');

    try {
      const { getHistoryDetail } = await import('./api');
      const detail = await getHistoryDetail(reportSummary.id);
      if (detail) {
        setResult([detail]);
      } else {
        setError('Failed to load report details.');
      }
    } catch (err) {
      setError('Error retrieving detailed report.');
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
                  setError(null);
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
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                textAlign: 'right',
                width: '100px',
                outline: 'none',
                borderBottom: '1px dashed var(--glass-border)'
              }}
            />
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
          </div>


        </header>

        {activeTab === 'Dashboard' && (
          <DashboardContent
            setActiveTab={setActiveTab}
            onStartAnalysis={() => {
              setActiveTab('New Analysis');
              setAnalysisMode('selection');
            }}
            onReportClick={handleViewHistoryReport}
          />
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
                        onClick={() => {
                          setAnalysisMode('selection');
                          setError(null);
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        ← Back to Options
                      </button>
                    </div>

                    {error && (
                      <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', border: '1px solid var(--danger)', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'left' }}>
                        {error}
                      </div>
                    )}

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
                onProceed={() => handleRunAnalysis('XGBoost')}
              />
            )}

            {analysisStep === 'result' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in-up">
                {/* Progress Summary Header */}
                <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {loading ? <Activity className="spin" color="var(--primary)" /> : <ShieldCheck color="var(--success)" />}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                        {loading ? 'Processing Analysis...' : 'Analysis Complete'}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Model: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedModel}</span>
                      </p>
                    </div>
                  </div>

                  {!loading && !error && result && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {result.length > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '8px' }}>
                          <button
                            onClick={() => setSelectedResultIndex(prev => Math.max(0, prev - 1))}
                            disabled={selectedResultIndex === 0}
                            style={{ background: 'transparent', border: 'none', color: selectedResultIndex === 0 ? 'var(--text-secondary)' : 'var(--primary)', cursor: 'pointer' }}
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedResultIndex + 1} / {result.length}</span>
                          <button
                            onClick={() => setSelectedResultIndex(prev => Math.min(result.length - 1, prev + 1))}
                            disabled={selectedResultIndex === result.length - 1}
                            style={{ background: 'transparent', border: 'none', color: selectedResultIndex === result.length - 1 ? 'var(--text-secondary)' : 'var(--primary)', cursor: 'pointer' }}
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
                        style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--glass-border)' }}
                      >
                        New Analysis
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px', border: '1px solid var(--danger)', textAlign: 'center' }}>
                    <p style={{ marginBottom: '16px' }}>{error}</p>
                    <button onClick={() => setAnalysisStep('model_selection')} className="btn-primary">Try Again</button>
                  </div>
                )}

                {result && result[selectedResultIndex] && (
                  <div style={{ animation: 'fade-in-up 0.6s ease-out' }}>
                    <ResultCard
                      result={result[selectedResultIndex]}
                      onBack={() => setAnalysisStep('entry')}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Cohort Analytics' && <AnalyticsDashboard />}

        {activeTab === 'Settings' && (
          <Settings darkMode={darkMode} toggleTheme={toggleTheme} userName={userName} setUserName={setUserName} />
        )}

      </main>

      {loading && (
        <ProcessingOverlay
          message={preparedPatients.length > 1 ? "Analyzing Patient Batch..." : "Analyzing Genotype Data..."}
          progress={analysisProgress}
        />
      )}
    </div>
  );
}

export default App;
