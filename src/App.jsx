import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { analyzeResume } from './utils/atsAnalyzer';
import { sampleData } from './utils/sampleData';

import CustomTitleBar from './components/CustomTitleBar';
import Sidebar from './components/Sidebar';
import FormSections from './components/FormSections';
import AtsFeedbackPanel from './components/AtsFeedbackPanel';
import ResumePreview from './components/ResumePreview';

export default function App() {
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeData, setResumeData] = useState(sampleData);
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState({ score: 0, recommendations: [], keywordMatches: [], missingKeywords: [] });

  useEffect(() => {
    const analysis = analyzeResume(resumeData, jobDescription);
    setAtsResult(analysis);
  }, [resumeData, jobDescription]);

  const loadSample = () => setResumeData(sampleData);
  
  const resetForm = () => setResumeData({
    personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    workHistory: [],
    education: [],
    projects: [],
    skills: []
  });

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

  return (
    <div className="app-container">
      <CustomTitleBar />
      <div className="main-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="workspace">
          <div className="form-panel">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button onClick={loadSample} className="btn-secondary">Load Pre-filled Sample</button>
              <button onClick={resetForm} className="btn-danger">Clear Form</button>
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
