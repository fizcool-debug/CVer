import React, { useState, useEffect } from 'react';
import { Download, Save, LogOut } from 'lucide-react';
import { analyzeResume } from './utils/atsAnalyzer';
import { sampleData } from './utils/sampleData';

import CustomTitleBar from './components/CustomTitleBar';
import Sidebar from './components/Sidebar';
import FormSections from './components/FormSections';
import AtsFeedbackPanel from './components/AtsFeedbackPanel';
import ResumePreview from './components/ResumePreview';
import WelcomeScreen from './components/WelcomeScreen';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentFilePath, setCurrentFilePath] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeData, setResumeData] = useState(sampleData);
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState({ score: 0, recommendations: [], keywordMatches: [], missingKeywords: [] });

  // Load recent projects on start
  useEffect(() => {
    const recents = localStorage.getItem('cver_recent_projects');
    if (recents) {
      try {
        setRecentProjects(JSON.parse(recents));
      } catch (e) {
        console.error('Failed to parse recent projects:', e);
      }
    }
  }, []);

  useEffect(() => {
    const analysis = analyzeResume(resumeData, jobDescription);
    setAtsResult(analysis);
  }, [resumeData, jobDescription]);

  const loadSample = () => setResumeData(JSON.parse(JSON.stringify(sampleData)));
  
  const resetForm = () => setResumeData({
    personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    workHistory: [],
    education: [],
    projects: [],
    skills: []
  });

  const createNewProject = () => {
    resetForm();
    setCurrentFilePath(null);
    setShowWelcome(false);
    setActiveTab('personal');
  };

  const loadSampleProject = () => {
    loadSample();
    setCurrentFilePath(null);
    setShowWelcome(false);
    setActiveTab('personal');
  };

  const openProject = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.openProjectFile();
      if (result.success) {
        setResumeData(result.data);
        setCurrentFilePath(result.path);
        addToRecentProjects(result.path, result.data.personal?.name || 'Untitled CV');
        setShowWelcome(false);
        setActiveTab('personal');
      } else if (result.error !== 'Cancelled') {
        alert(`Failed to open project: ${result.error}`);
      }
    } else {
      alert('File APIs are only available in the Desktop App.');
    }
  };

  const openRecent = async (filePath) => {
    if (window.electronAPI) {
      const result = await window.electronAPI.readProjectFile(filePath);
      if (result.success) {
        setResumeData(result.data);
        setCurrentFilePath(filePath);
        addToRecentProjects(filePath, result.data.personal?.name || 'Untitled CV');
        setShowWelcome(false);
        setActiveTab('personal');
      } else {
        alert(`Failed to open recent project: ${result.error}. It might have been moved or deleted.`);
        removeRecentProject(filePath);
      }
    }
  };

  const saveProject = async () => {
    if (!window.electronAPI) {
      alert('File saving is only supported in Desktop mode.');
      return;
    }

    if (currentFilePath) {
      const dataString = JSON.stringify(resumeData, null, 2);
      const result = await window.electronAPI.writeProjectFile(currentFilePath, dataString);
      if (result.success) {
        addToRecentProjects(currentFilePath, resumeData.personal?.name || 'Untitled CV');
        // Flash a subtle notification or alert
        alert('CV project saved successfully.');
      } else {
        alert(`Error saving project: ${result.error}`);
      }
    } else {
      await saveProjectAs();
    }
  };

  const saveProjectAs = async () => {
    if (window.electronAPI) {
      const dataString = JSON.stringify(resumeData, null, 2);
      const result = await window.electronAPI.saveProjectFile(dataString);
      if (result.success) {
        setCurrentFilePath(result.path);
        addToRecentProjects(result.path, resumeData.personal?.name || 'Untitled CV');
        alert('CV project saved successfully.');
      } else if (result.error !== 'Cancelled') {
        alert(`Error saving project: ${result.error}`);
      }
    } else {
      alert('File saving is only supported in Desktop mode.');
    }
  };

  const closeProject = () => {
    setShowWelcome(true);
    setCurrentFilePath(null);
  };

  const addToRecentProjects = (filePath, name) => {
    setRecentProjects(prev => {
      const filtered = prev.filter(p => p.path !== filePath);
      const updated = [
        { path: filePath, name: name || 'Untitled CV', timestamp: Date.now() },
        ...filtered
      ].slice(0, 5);
      localStorage.setItem('cver_recent_projects', JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentProject = (filePath) => {
    setRecentProjects(prev => {
      const updated = prev.filter(p => p.path !== filePath);
      localStorage.setItem('cver_recent_projects', JSON.stringify(updated));
      return updated;
    });
  };

  const exportPDF = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.exportPDF();
      if (result.success) {
        alert(`Resume successfully saved to: ${result.path}`);
      } else if (result.error !== 'Cancelled') {
        alert(`Failed to save PDF: ${result.error}`);
      }
    } else {
      window.print();
    }
  };

  const currentFileName = currentFilePath ? currentFilePath.split(/[\\/]/).pop() : null;

  if (showWelcome) {
    return (
      <div className="app-container">
        <CustomTitleBar currentFileName={currentFileName} />
        <WelcomeScreen 
          onCreateNew={createNewProject}
          onOpenFile={openProject}
          onLoadSample={loadSampleProject}
          recentProjects={recentProjects}
          onOpenRecent={openRecent}
          onRemoveRecent={removeRecentProject}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <CustomTitleBar currentFileName={currentFileName} />
      <div className="main-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="workspace">
          <div className="form-panel">
            {/* Project Actions Header */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <button onClick={saveProject} className="btn-primary" style={{ height: '36px' }}>
                <Save size={15} /> Save Project
              </button>
              <button onClick={saveProjectAs} className="btn-secondary" style={{ height: '36px' }}>
                Save As...
              </button>
              <button onClick={closeProject} className="btn-secondary" style={{ height: '36px', color: 'var(--text-secondary)' }}>
                <LogOut size={15} /> Close Project
              </button>
              <div style={{ flexGrow: 1 }} />
              <button onClick={loadSample} className="btn-secondary" style={{ height: '36px' }}>
                Reset Sample
              </button>
              <button onClick={resetForm} className="btn-danger" style={{ height: '36px' }}>
                Clear Form
              </button>
            </div>
            
            <FormSections 
              activeTab={activeTab} 
              resumeData={resumeData} 
              setResumeData={setResumeData} 
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
            />
          </div>
          
          <div className="preview-panel">
            <div className="no-print" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Live ATS Preview</h3>
              <button onClick={exportPDF} className="btn-primary">
                <Download size={16} /> Export A4 PDF
              </button>
            </div>
            <ResumePreview data={resumeData} />
            <AtsFeedbackPanel result={atsResult} />
          </div>
        </div>
      </div>
    </div>
  );
}
