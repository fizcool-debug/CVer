import React, { useEffect, useState } from 'react';
import logo from '../assets/icon.png';

export default function CustomTitleBar({ currentFileName }) {
  const [platform, setPlatform] = useState('win32');

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getPlatform().then(setPlatform);
    }
  }, []);

  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => window.electronAPI?.maximize();
  const handleClose = () => window.electronAPI?.close();

  return (
    <div className="titlebar">
      <div className="titlebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={logo} alt="CVer Logo" style={{ width: '16px', height: '16px', borderRadius: '3px' }} />
        <span style={{ fontWeight: 800, color: 'var(--accent-color)' }}>CV</span>er
        {currentFileName && (
          <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.7, paddingLeft: '8px', borderLeft: '1px solid var(--border-subtle)', marginLeft: '8px' }}>
            {currentFileName}
          </span>
        )}
      </div>
      
      {/* Show custom controls only if NOT on macOS where system traffic lights are used */}
      {platform !== 'darwin' && (
        <div className="titlebar-controls">
          <button className="titlebar-btn" onClick={handleMinimize}>
            <svg width="10" height="1" viewBox="0 0 10 1"><rect fill="currentColor" width="10" height="1"/></svg>
          </button>
          <button className="titlebar-btn" onClick={handleMaximize}>
            <svg width="10" height="10" viewBox="0 0 10 10"><path fill="none" stroke="currentColor" d="M1,1h8v8h-8z"/></svg>
          </button>
          <button className="titlebar-btn close" onClick={handleClose}>
            <svg width="10" height="10" viewBox="0 0 10 10"><path fill="none" stroke="currentColor" d="M1,1l8,8 M9,1l-8,8"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
