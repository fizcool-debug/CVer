import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function AtsFeedbackPanel({ result }) {
  const { score, recommendations, keywordMatches, missingKeywords } = result;

  const getScoreColor = (s) => {
    if (s >= 80) return 'var(--color-success)';
    if (s >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="form-card no-print" style={{ width: '100%', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600 }}>ATS Scanner & Compatibility Engine</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Compatibility:</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: getScoreColor(score) }}>{score}%</span>
        </div>
      </div>

      <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {recommendations.map((rec, idx) => {
          let Icon = Info;
          let iconColor = 'var(--text-secondary)';
          if (rec.type === 'critical') {
            Icon = AlertCircle;
            iconColor = 'var(--color-error)';
          } else if (rec.type === 'warning') {
            Icon = AlertCircle;
            iconColor = 'var(--color-warning)';
          } else if (rec.type === 'keyword') {
            Icon = CheckCircle;
            iconColor = 'var(--color-success)';
          }

          return (
            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px' }}>
              <Icon size={14} style={{ color: iconColor, marginTop: '2px', flexShrink: 0 }} />
              <span style={{ color: rec.type === 'critical' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {rec.message}
              </span>
            </div>
          );
        })}
      </div>

      {(keywordMatches.length > 0 || missingKeywords.length > 0) && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h5 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>JOB KEYWORD REPORT</h5>
          
          {keywordMatches.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '2px' }}>Matched Keywords:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {keywordMatches.map((word, i) => (
                  <span key={i} style={{ fontSize: '10px', background: 'rgba(16, 124, 65, 0.1)', color: 'var(--color-success)', padding: '2px 6px', borderRadius: '4px' }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingKeywords.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 600, marginBottom: '2px' }}>Missing Target Keywords:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {missingKeywords.map((word, i) => (
                  <span key={i} style={{ fontSize: '10px', background: 'rgba(216, 59, 1, 0.1)', color: 'var(--color-warning)', padding: '2px 6px', borderRadius: '4px' }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
