import React from 'react';
import { FilePlus, FolderOpen, FileText, Clock, ChevronRight, Sparkles } from 'lucide-react';

export default function WelcomeScreen({ onCreateNew, onOpenFile, onLoadSample, recentProjects, onOpenRecent, onRemoveRecent }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <div className="welcome-logo">
          <span className="logo-accent">CV</span>er
        </div>
        <p className="welcome-tagline">Create ATS-Optimized Professional Resumes in Real-Time</p>
      </div>

      <div className="welcome-content">
        {/* Main Actions Column */}
        <div className="welcome-actions">
          <h3 className="section-title">Get Started</h3>
          
          <div className="action-grid">
            <button className="welcome-card-btn primary" onClick={onCreateNew}>
              <div className="card-icon-wrapper">
                <FilePlus size={24} />
              </div>
              <div className="card-text">
                <h4>Create New CV</h4>
                <p>Start fresh with a clean, ATS-compliant structure</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </button>

            <button className="welcome-card-btn" onClick={onOpenFile}>
              <div className="card-icon-wrapper">
                <FolderOpen size={24} />
              </div>
              <div className="card-text">
                <h4>Open CV Project</h4>
                <p>Load a saved .cver or .json project file</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </button>

            <button className="welcome-card-btn" onClick={onLoadSample}>
              <div className="card-icon-wrapper template">
                <Sparkles size={24} />
              </div>
              <div className="card-text">
                <h4>Explore Sample CV</h4>
                <p>Load a pre-filled resume template to see how it works</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </button>
          </div>
        </div>

        {/* Recents Column */}
        <div className="welcome-recents">
          <h3 className="section-title">
            <Clock size={16} style={{ marginRight: '6px' }} />
            Recent Projects
          </h3>

          {recentProjects && recentProjects.length > 0 ? (
            <div className="recents-list">
              {recentProjects.map((project, idx) => (
                <div key={idx} className="recent-item">
                  <div className="recent-clickable" onClick={() => onOpenRecent(project.path)}>
                    <div className="recent-icon">
                      <FileText size={18} />
                    </div>
                    <div className="recent-details">
                      <div className="recent-name">{project.name}</div>
                      <div className="recent-path" title={project.path}>{project.path}</div>
                    </div>
                  </div>
                  <button 
                    className="btn-remove-recent" 
                    title="Remove from Recents"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecent(project.path);
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="recents-empty">
              <div className="empty-state-icon">
                <FileText size={32} style={{ opacity: 0.3 }} />
              </div>
              <p>No recent projects found</p>
              <span className="empty-sub">Saved projects will appear here for quick access.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
