import React, { useRef, useState, useEffect } from 'react';

export default function ResumePreview({ data }) {
  const { personal = {}, summary = '', workHistory = [], education = [], projects = [], skills = [] } = data;
  
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries) => {
      for (let entry of entries) {
        // Measure parent width, leave 24px padding on each side (total 48px)
        const parentWidth = entry.contentRect.width - 48;
        // Calculate scale ratio relative to 800px A4 base width
        const newScale = Math.min(1, Math.max(0.2, parentWidth / 800));
        setScale(newScale);
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const baseWidth = 800;
  const baseHeight = 1130;

  return (
    <div 
      ref={containerRef} 
      className="resume-preview-container"
      style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        overflow: 'hidden'
      }}
    >
      <div 
        className="resume-preview-wrapper"
        style={{
          width: `${baseWidth * scale}px`,
          height: `${baseHeight * scale}px`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'width 0.15s ease-out, height 0.15s ease-out'
        }}
      >
        <div 
          className="print-resume-document" 
          id="resume-preview-document" 
          style={{
            width: `${baseWidth}px`,
            height: `${baseHeight}px`,
            backgroundColor: 'white',
            color: '#333333',
            padding: '40px 32px',
            fontSize: '9pt',
            lineHeight: '1.45',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: '2px',
            boxSizing: 'border-box'
          }}
        >
          {/* Header Info */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '0 0 4px 0', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {personal.name || 'Your Name'}
            </h1>
            <div style={{ fontSize: '9pt', fontWeight: 'bold', color: '#555555', marginBottom: '6px' }}>
              {personal.title || 'Professional Title'}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#666666', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>• {personal.phone}</span>}
              {personal.location && <span>• {personal.location}</span>}
              {personal.linkedin && <span>• {personal.linkedin}</span>}
              {personal.website && <span>• {personal.website}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', borderBottom: '1.5px solid #333333', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>
                Professional Summary
              </div>
              <p style={{ margin: 0, textAlign: 'justify', fontSize: '8.5pt' }}>{summary}</p>
            </div>
          )}

          {/* Work History */}
          {workHistory && workHistory.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', borderBottom: '1.5px solid #333333', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>
                Professional Experience
              </div>
              {workHistory.map((work, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#111111', fontSize: '9pt' }}>
                    <span>{work.company || 'Company Name'}</span>
                    <span>{work.location || 'Location'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', color: '#444444', marginBottom: '4px', fontSize: '8.5pt' }}>
                    <span>{work.role || 'Job Title'}</span>
                    <span>{work.dates || 'Dates'}</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '8.5pt' }}>
                    {(work.bullets || []).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', borderBottom: '1.5px solid #333333', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>
                Education
              </div>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt' }}>
                  <div>
                    <strong style={{ color: '#111111', fontSize: '9pt' }}>{edu.school || 'School'}</strong> — <span>{edu.degree || 'Degree'}</span>
                    {edu.details && <div style={{ fontSize: '8pt', color: '#666666', fontStyle: 'italic' }}>{edu.details}</div>}
                  </div>
                  <span style={{ fontStyle: 'italic' }}>{edu.dates || 'Dates'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', borderBottom: '1.5px solid #333333', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>
                Technical Projects
              </div>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#111111', fontSize: '9pt' }}>
                    <span>{proj.title || 'Project Title'}</span>
                    {proj.tech && <span style={{ fontWeight: 'normal', fontSize: '8pt', color: '#555555' }}>({proj.tech})</span>}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '8.5pt' }}>
                    {(proj.bullets || []).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', borderBottom: '1.5px solid #333333', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>
                Skills & Core Competencies
              </div>
              <div style={{ fontSize: '8.5pt', lineHeight: '1.45' }}>
                {skills.join(' • ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
