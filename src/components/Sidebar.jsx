import React from 'react';
import { User, Briefcase, GraduationCap, Code, Layers, FileText, CheckCircle2 } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'work', label: 'Work Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'skills', label: 'Skills & Tools', icon: Code },
    { id: 'ats', label: 'ATS Job Matcher', icon: CheckCircle2 }
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
