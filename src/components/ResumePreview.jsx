import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';

export default function ResumePreview({ data }) {
  const { personal = {}, summary = '', workHistory = [], education = [], projects = [], skills = [] } = data;
  
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [fontScale, setFontScale] = useState(1);

  // Reset fontScale when data changes
  useEffect(() => {
    setFontScale(1);
  }, [data]);

  // Adjust fontScale to fit within exactly one page
  useLayoutEffect(() => {
    const docEl = document.getElementById('resume-preview-document');
    if (!docEl) return;

    const maxH = 1130;
    const currentScrollHeight = docEl.scrollHeight;

    if (currentScrollHeight > maxH && fontScale > 0.4) {
      // Calculate a conservative scaling ratio to fit contents
      const ratio = maxH / currentScrollHeight;
      const nextScale = Math.max(0.4, fontScale * ratio - 0.01);
      
      // Avoid infinite cycles if the difference is negligible
      if (fontScale - nextScale > 0.005) {
        setFontScale(nextScale);
      }
    }
  }, [data, fontScale]);

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
            padding: `${40 * fontScale}px ${32 * fontScale}px`,
            fontSize: `${9 * fontScale}pt`,
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
          <div style={{ textAlign: 'center', marginBottom: `${16 * fontScale}px` }}>
            <h1 style={{ fontSize: `${18 * fontScale}pt`, fontWeight: 'bold', margin: `0 0 ${4 * fontScale}px 0`, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {personal.name || 'Your Name'}
            </h1>
            <div style={{ fontSize: `${9 * fontScale}pt`, fontWeight: 'bold', color: '#555555', marginBottom: `${6 * fontScale}px` }}>
              {personal.title || 'Professional Title'}
            </div>
            <div style={{ fontSize: `${8.5 * fontScale}pt`, color: '#666666', display: 'flex', justifyContent: 'center', gap: `${8 * fontScale}px`, flexWrap: 'wrap' }}>
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>• {personal.phone}</span>}
              {personal.location && <span>• {personal.location}</span>}
              {personal.linkedin && <span>• {personal.linkedin}</span>}
              {personal.website && <span>• {personal.website}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div style={{ marginBottom: `${14 * fontScale}px` }}>
              <div style={{ fontSize: `${10 * fontScale}pt`, fontWeight: 'bold', borderBottom: `${1.5 * fontScale}px solid #333333`, paddingBottom: `${2 * fontScale}px`, marginBottom: `${6 * fontScale}px`, textTransform: 'uppercase' }}>
                Professional Summary
              </div>
              <p style={{ margin: 0, textAlign: 'justify', fontSize: `${8.5 * fontScale}pt` }}>{summary}</p>
            </div>
          )}

          {/* Work History */}
          {workHistory && workHistory.length > 0 && (
            <div style={{ marginBottom: `${14 * fontScale}px` }}>
              <div style={{ fontSize: `${10 * fontScale}pt`, fontWeight: 'bold', borderBottom: `${1.5 * fontScale}px solid #333333`, paddingBottom: `${2 * fontScale}px`, marginBottom: `${6 * fontScale}px`, textTransform: 'uppercase' }}>
                Professional Experience
              </div>
              {workHistory.map((work, idx) => (
                <div key={idx} style={{ marginBottom: `${10 * fontScale}px` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#111111', fontSize: `${9 * fontScale}pt` }}>
                    <span>{work.company || 'Company Name'}</span>
                    <span>{work.location || 'Location'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', color: '#444444', marginBottom: `${4 * fontScale}px`, fontSize: `${8.5 * fontScale}pt` }}>
                    <span>{work.role || 'Job Title'}</span>
                    <span>{work.dates || 'Dates'}</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: `${16 * fontScale}px`, fontSize: `${8.5 * fontScale}pt` }}>
                    {(work.bullets || []).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: `${2 * fontScale}px` }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div style={{ marginBottom: `${14 * fontScale}px` }}>
              <div style={{ fontSize: `${10 * fontScale}pt`, fontWeight: 'bold', borderBottom: `${1.5 * fontScale}px solid #333333`, paddingBottom: `${2 * fontScale}px`, marginBottom: `${6 * fontScale}px`, textTransform: 'uppercase' }}>
                Education
              </div>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: `${6 * fontScale}px`, display: 'flex', justifyContent: 'space-between', fontSize: `${8.5 * fontScale}pt` }}>
                  <div>
                    <strong style={{ color: '#111111', fontSize: `${9 * fontScale}pt` }}>{edu.school || 'School'}</strong> — <span>{edu.degree || 'Degree'}</span>
                    {edu.details && <div style={{ fontSize: `${8 * fontScale}pt`, color: '#666666', fontStyle: 'italic' }}>{edu.details}</div>}
                  </div>
                  <span style={{ fontStyle: 'italic' }}>{edu.dates || 'Dates'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div style={{ marginBottom: `${14 * fontScale}px` }}>
              <div style={{ fontSize: `${10 * fontScale}pt`, fontWeight: 'bold', borderBottom: `${1.5 * fontScale}px solid #333333`, paddingBottom: `${2 * fontScale}px`, marginBottom: `${6 * fontScale}px`, textTransform: 'uppercase' }}>
                Technical Projects
              </div>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: `${6 * fontScale}px` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#111111', fontSize: `${9 * fontScale}pt` }}>
                    <span>{proj.title || 'Project Title'}</span>
                    {proj.tech && <span style={{ fontWeight: 'normal', fontSize: `${8 * fontScale}pt`, color: '#555555' }}>({proj.tech})</span>}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: `${16 * fontScale}px`, fontSize: `${8.5 * fontScale}pt` }}>
                    {(proj.bullets || []).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: `${2 * fontScale}px` }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div style={{ marginBottom: `${14 * fontScale}px` }}>
              <div style={{ fontSize: `${10 * fontScale}pt`, fontWeight: 'bold', borderBottom: `${1.5 * fontScale}px solid #333333`, paddingBottom: `${2 * fontScale}px`, marginBottom: `${6 * fontScale}px`, textTransform: 'uppercase' }}>
                Skills & Core Competencies
              </div>
              <div style={{ fontSize: `${8.5 * fontScale}pt`, lineHeight: '1.45' }}>
                {skills.join(' • ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
