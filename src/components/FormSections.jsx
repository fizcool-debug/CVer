import React, { useState, useEffect } from 'react';

export default function FormSections({ activeTab, resumeData, setResumeData, jobDescription, setJobDescription }) {
  const [skillsText, setSkillsText] = useState('');

  useEffect(() => {
    if (activeTab === 'skills') {
      const parentVal = resumeData.skills ? resumeData.skills.join(', ') : '';
      const cleanedParent = parentVal.split(',').map(s => s.trim()).filter(Boolean).join(',');
      const cleanedLocal = skillsText.split(',').map(s => s.trim()).filter(Boolean).join(',');
      if (cleanedParent !== cleanedLocal) {
        setSkillsText(parentVal);
      }
    }
  }, [resumeData.skills, activeTab]);

  const handleSkillsChange = (e) => {
    const val = e.target.value;
    setSkillsText(val);
    const skillsArr = val.split(',').map(s => s.trim()).filter(Boolean);
    setResumeData({ ...resumeData, skills: skillsArr });
  };

  const updatePersonal = (field, value) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [field]: value }
    });
  };

  const updateSummary = (value) => {
    setResumeData({ ...resumeData, summary: value });
  };

  // Generic handler for lists (Work history, Education, Projects)
  const addListItem = (section, defaultObj) => {
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], defaultObj]
    });
  };

  const updateListItem = (section, index, field, value) => {
    const newList = [...resumeData[section]];
    newList[index] = { ...newList[index], [field]: value };
    setResumeData({ ...resumeData, [section]: newList });
  };

  const deleteListItem = (section, index) => {
    const newList = resumeData[section].filter((_, idx) => idx !== index);
    setResumeData({ ...resumeData, [section]: newList });
  };

  const addBulletPoint = (section, index) => {
    const newList = [...resumeData[section]];
    newList[index].bullets = [...(newList[index].bullets || []), ''];
    setResumeData({ ...resumeData, [section]: newList });
  };

  const updateBulletPoint = (section, itemIndex, bulletIndex, value) => {
    const newList = [...resumeData[section]];
    newList[itemIndex].bullets[bulletIndex] = value;
    setResumeData({ ...resumeData, [section]: newList });
  };

  const deleteBulletPoint = (section, itemIndex, bulletIndex) => {
    const newList = [...resumeData[section]];
    newList[itemIndex].bullets = newList[itemIndex].bullets.filter((_, idx) => idx !== bulletIndex);
    setResumeData({ ...resumeData, [section]: newList });
  };

  if (activeTab === 'personal') {
    return (
      <div className="form-card">
        <h2>Personal Contact Information</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            value={resumeData.personal.name || ''} 
            onChange={(e) => updatePersonal('name', e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Professional Title</label>
          <input 
            type="text" 
            placeholder="Senior Software Engineer" 
            value={resumeData.personal.title || ''} 
            onChange={(e) => updatePersonal('title', e.target.value)} 
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="john.doe@example.com" 
              value={resumeData.personal.email || ''} 
              onChange={(e) => updatePersonal('email', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              placeholder="+1 (555) 019-2834" 
              value={resumeData.personal.phone || ''} 
              onChange={(e) => updatePersonal('phone', e.target.value)} 
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Location (City, State / Country)</label>
            <input 
              type="text" 
              placeholder="New York, NY" 
              value={resumeData.personal.location || ''} 
              onChange={(e) => updatePersonal('location', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>LinkedIn Link</label>
            <input 
              type="text" 
              placeholder="linkedin.com/in/johndoe" 
              value={resumeData.personal.linkedin || ''} 
              onChange={(e) => updatePersonal('linkedin', e.target.value)} 
            />
          </div>
        </div>
        <div className="form-group">
          <label>Personal Portfolio / Website</label>
          <input 
            type="text" 
            placeholder="johndoe.dev" 
            value={resumeData.personal.website || ''} 
            onChange={(e) => updatePersonal('website', e.target.value)} 
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'summary') {
    return (
      <div className="form-card">
        <h2>Professional Summary</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Write a concise 3-4 sentence summary targeting your core expertise. ATS scanners look here first for key terms.
        </p>
        <div className="form-group">
          <textarea 
            rows="6" 
            placeholder="Results-oriented Software Engineer with 5+ years of experience designing scalable web architectures..."
            value={resumeData.summary || ''} 
            onChange={(e) => updateSummary(e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'work') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>Work Experience</h2>
        {resumeData.workHistory.map((exp, idx) => (
          <div key={idx} className="form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Experience #{idx + 1}</h3>
              <button 
                className="btn-danger-sm" 
                onClick={() => deleteListItem('workHistory', idx)}
              >
                Remove
              </button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  value={exp.company || ''} 
                  onChange={(e) => updateListItem('workHistory', idx, 'company', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  value={exp.role || ''} 
                  onChange={(e) => updateListItem('workHistory', idx, 'role', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Duration (e.g. Jun 2021 - Present)</label>
                <input 
                  type="text" 
                  value={exp.dates || ''} 
                  onChange={(e) => updateListItem('workHistory', idx, 'dates', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Location (e.g. Austin, TX)</label>
                <input 
                  type="text" 
                  value={exp.location || ''} 
                  onChange={(e) => updateListItem('workHistory', idx, 'location', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Achievements & Responsibilities</label>
              {(exp.bullets || []).map((bullet, bulletIdx) => (
                <div key={bulletIdx} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <input 
                    type="text" 
                    style={{ flex: 1 }}
                    placeholder="Led development of XYZ feature increasing conversion rate by 12%." 
                    value={bullet} 
                    onChange={(e) => updateBulletPoint('workHistory', idx, bulletIdx, e.target.value)}
                  />
                  <button onClick={() => deleteBulletPoint('workHistory', idx, bulletIdx)} className="btn-danger-icon">×</button>
                </div>
              ))}
              <button 
                onClick={() => addBulletPoint('workHistory', idx)} 
                className="btn-link"
              >
                + Add Achievement Bullet
              </button>
            </div>
          </div>
        ))}
        <button 
          onClick={() => addListItem('workHistory', { company: '', role: '', dates: '', location: '', bullets: [''] })}
          className="btn-primary"
        >
          Add Experience Entry
        </button>
      </div>
    );
  }

  if (activeTab === 'education') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>Education</h2>
        {resumeData.education.map((edu, idx) => (
          <div key={idx} className="form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Education #{idx + 1}</h3>
              <button 
                className="btn-danger-sm" 
                onClick={() => deleteListItem('education', idx)}
              >
                Remove
              </button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Institution Name</label>
                <input 
                  type="text" 
                  value={edu.school || ''} 
                  onChange={(e) => updateListItem('education', idx, 'school', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Degree (e.g. B.S. in Computer Science)</label>
                <input 
                  type="text" 
                  value={edu.degree || ''} 
                  onChange={(e) => updateListItem('education', idx, 'degree', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Graduation Year / Range</label>
                <input 
                  type="text" 
                  value={edu.dates || ''} 
                  onChange={(e) => updateListItem('education', idx, 'dates', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>GPA / Honors (Optional)</label>
                <input 
                  type="text" 
                  value={edu.details || ''} 
                  onChange={(e) => updateListItem('education', idx, 'details', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <button 
          onClick={() => addListItem('education', { school: '', degree: '', dates: '', details: '' })}
          className="btn-primary"
        >
          Add Education Entry
        </button>
      </div>
    );
  }

  if (activeTab === 'projects') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>Projects</h2>
        {resumeData.projects.map((proj, idx) => (
          <div key={idx} className="form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Project #{idx + 1}</h3>
              <button 
                className="btn-danger-sm" 
                onClick={() => deleteListItem('projects', idx)}
              >
                Remove
              </button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Project Title</label>
                <input 
                  type="text" 
                  value={proj.title || ''} 
                  onChange={(e) => updateListItem('projects', idx, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Technologies Used</label>
                <input 
                  type="text" 
                  placeholder="React, AWS, Node.js"
                  value={proj.tech || ''} 
                  onChange={(e) => updateListItem('projects', idx, 'tech', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Achievements / Description Bullets</label>
              {(proj.bullets || []).map((bullet, bulletIdx) => (
                <div key={bulletIdx} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <input 
                    type="text" 
                    style={{ flex: 1 }}
                    value={bullet} 
                    onChange={(e) => updateBulletPoint('projects', idx, bulletIdx, e.target.value)}
                  />
                  <button onClick={() => deleteBulletPoint('projects', idx, bulletIdx)} className="btn-danger-icon">×</button>
                </div>
              ))}
              <button 
                onClick={() => addBulletPoint('projects', idx)} 
                className="btn-link"
              >
                + Add Project Detail
              </button>
            </div>
          </div>
        ))}
        <button 
          onClick={() => addListItem('projects', { title: '', tech: '', bullets: [''] })}
          className="btn-primary"
        >
          Add Project Entry
        </button>
      </div>
    );
  }

  if (activeTab === 'skills') {
    return (
      <div className="form-card">
        <h2>Skills & Technologies</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Enter your skills separated by commas. ATS crawlers scan this section heavily for technical keywords.
        </p>
        <div className="form-group">
          <textarea 
            rows="6" 
            placeholder="JavaScript, TypeScript, React, Node.js, GraphQL, AWS, Docker, Git"
            value={skillsText} 
            onChange={handleSkillsChange}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'ats') {
    return (
      <div className="form-card">
        <h2>ATS Job Matcher</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Paste the target job description below. CVer will automatically scan it for crucial skills and match them against your resume contents in real time.
        </p>
        <div className="form-group">
          <textarea 
            rows="10" 
            placeholder="Paste job description here..."
            value={jobDescription} 
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return null;
}
