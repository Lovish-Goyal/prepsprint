'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Edit3,
  User,
  Briefcase,
  Code,
  Save,
  CheckCircle,
  Layout
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function ResumeBuilder() {
  const [view, setView] = useState('edit');
  const [templateId, setTemplateId] = useState('ats'); // 'ats', 'minimal', 'creative'
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const [resumeData, setResumeData] = useState({
    full_name: 'Alex Developer',
    email: 'alex@example.com',
    phone: '+1 234 567 890',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexdev',
    summary: 'Senior Frontend Engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and Distributed Systems.',
    experience: [
      { company: 'Tech Corp', role: 'Senior Engineer', duration: '2020 - Present', desc: 'Architected high-scale frontend systems using Next.js and GraphQL.' },
    ],
    projects: [
      { name: 'PrepSprint', link: 'github.com/alex/prepsprint', desc: 'A modern developer toolkit platform built with React and Tailwind.' },
    ],
    skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'System Design', 'AWS'],
    education: [
      { school: 'University of Tech', degree: 'B.S. Computer Science', year: '2016' },
    ],
    content: '' // For legacy compatibility or large text blocks
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API_BASE}/resume/`);
        if (res.data) {
          setResumeData(res.data);
          if (res.data.templateId) setTemplateId(res.data.templateId);
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err);
      }
    };
    fetchResume();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...resumeData, templateId };
      await axios.post(`${API_BASE}/resume/`, payload);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  const updateExperience = (idx, field, value) => {
    const newExp = [...resumeData.experience];
    newExp[idx][field] = value;
    setResumeData({ ...resumeData, experience: newExp });
  };

  const addExperience = () => {
    setResumeData({ ...resumeData, experience: [...resumeData.experience, { company: '', role: '', duration: '', desc: '' }] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
            <FileText size={16} /> Document Architect
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Resume Builder</h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Construct high-fidelity, ATS-optimized narratives designed for technical engineering roles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200">
            <button 
              onClick={() => setView('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Edit3 size={14} /> Edit
            </button>
            <button 
              onClick={() => setView('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Eye size={14} /> Preview
            </button>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <span className="animate-spin text-lg">⏳</span> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          {lastSaved && (
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
              <CheckCircle size={12} /> Saved at {lastSaved}
            </div>
          )}
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr,595px] gap-10 items-start">
        {/* Editor Side */}
        <section className={`space-y-8 ${view === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Template Selection */}
          <div className="toolkit-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
              <Layout size={18} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Architectural Template</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['ats', 'minimal', 'creative'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTemplateId(t)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${templateId === t ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <p className="text-xs font-bold uppercase tracking-widest">{t}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="toolkit-card p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <User size={18} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Personal Details</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input type="text" className="input-field text-sm" value={resumeData.full_name} onChange={(e) => updateField('full_name', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input type="email" className="input-field text-sm" value={resumeData.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</label>
                <input type="text" className="input-field text-sm" value={resumeData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LinkedIn / Portfolio</label>
                <input type="text" className="input-field text-sm" value={resumeData.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="toolkit-card p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Briefcase size={18} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Experience</h3>
            </div>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="space-y-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group transition-all hover:bg-slate-50">
                <button className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role / Position</label>
                    <input type="text" className="input-field text-sm" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</label>
                    <input type="text" className="input-field text-sm" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</label>
                    <input type="text" className="input-field text-sm" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description & Impact</label>
                  <textarea className="input-field text-sm h-28 rich-scrollbar leading-relaxed" value={exp.desc} onChange={(e) => updateExperience(idx, 'desc', e.target.value)}></textarea>
                </div>
              </div>
            ))}
            <button 
              onClick={addExperience}
              className="w-full py-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Plus size={18} /> Add Experience Section
            </button>
          </div>
        </section>

        {/* Preview Side */}
        <section className={`lg:sticky lg:top-24 max-h-[calc(100vh-140px)] ${view === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className={`bg-white shadow-2xl p-12 min-h-[842px] w-full max-w-[595px] mx-auto border border-slate-200 flex flex-col overflow-y-auto rich-scrollbar transition-all ${
            templateId === 'ats' ? 'font-serif text-slate-900' : templateId === 'minimal' ? 'font-sans text-slate-700' : 'font-sans text-indigo-900 border-indigo-100'
          }`}>
            {/* Template Rendering */}
            {templateId === 'ats' && (
              <div className="space-y-8">
                <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6 mb-8">
                  <h2 className="text-3xl font-bold uppercase tracking-tight">{resumeData.full_name}</h2>
                  <div className="text-[10px] space-x-2 text-slate-600 font-sans font-bold uppercase tracking-widest">
                    <span>{resumeData.email}</span>
                    <span>•</span>
                    <span>{resumeData.phone}</span>
                    <span>•</span>
                    <span>{resumeData.location}</span>
                  </div>
                </div>

                <PreviewSection title="Professional Summary" content={resumeData.summary} />
                
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase border-b border-slate-200 pb-1">Experience</h3>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <p className="text-xs font-bold text-slate-900">{exp.role} | {exp.company}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{exp.duration}</p>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed italic">{exp.desc}</p>
                    </div>
                  ))}
                </section>

                <PreviewSection title="Technical Skills" content={resumeData.skills.join(' • ')} />
              </div>
            )}

            {templateId === 'minimal' && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-light text-slate-900">{resumeData.full_name}</h2>
                  <div className="flex gap-4 text-[10px] text-slate-400 font-medium uppercase">
                    <span>{resumeData.email}</span>
                    <span>{resumeData.phone}</span>
                    <span>{resumeData.location}</span>
                  </div>
                </div>
                
                <div className="h-px bg-slate-100"></div>

                <div className="grid grid-cols-[120px,1fr] gap-8">
                  <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Summary</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{resumeData.summary}</p>
                </div>

                <div className="grid grid-cols-[120px,1fr] gap-8">
                  <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Experience</h4>
                  <div className="space-y-6">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-2">
                         <div className="flex justify-between">
                            <h5 className="text-xs font-bold text-slate-900">{exp.role}</h5>
                            <span className="text-[10px] text-slate-400">{exp.duration}</span>
                         </div>
                         <p className="text-[10px] font-bold text-indigo-600">{exp.company}</p>
                         <p className="text-[11px] text-slate-500 leading-relaxed">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {templateId === 'creative' && (
               <div className="space-y-8">
                  <div className="bg-slate-900 -mx-12 -mt-12 p-12 text-white space-y-4">
                     <h2 className="text-5xl font-bold tracking-tighter">{resumeData.full_name}</h2>
                     <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest">{resumeData.summary.split('.')[0]}</p>
                  </div>
                  
                  <div className="grid grid-cols-[1fr,200px] gap-12 pt-8">
                     <div className="space-y-8">
                        <section className="space-y-4">
                           <h3 className="text-lg font-bold border-l-4 border-indigo-600 pl-4">Work Experience</h3>
                           {resumeData.experience.map((exp, idx) => (
                             <div key={idx} className="space-y-2">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{exp.role} @ {exp.company}</p>
                                <p className="text-[11px] text-slate-600 leading-relaxed">{exp.desc}</p>
                             </div>
                           ))}
                        </section>
                     </div>
                     <div className="space-y-8 border-l border-slate-100 pl-8">
                        <section className="space-y-4">
                           <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact</h3>
                           <div className="space-y-2 text-[10px] font-bold text-slate-600">
                              <p>{resumeData.email}</p>
                              <p>{resumeData.phone}</p>
                              <p>{resumeData.location}</p>
                           </div>
                        </section>
                        <section className="space-y-4">
                           <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Stack</h3>
                           <div className="flex flex-wrap gap-2">
                              {resumeData.skills.map(s => (
                                <span key={s} className="px-2 py-1 bg-slate-100 rounded text-[9px] font-bold text-slate-600 uppercase">{s}</span>
                              ))}
                           </div>
                        </section>
                     </div>
                  </div>
               </div>
            )}
            
            <div className="mt-auto pt-10 text-[8px] text-center text-slate-300 font-sans tracking-[0.3em] uppercase">
              Document Architected by PrepSprint Protocol V1.0
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PreviewSection({ title, content }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold uppercase border-b border-slate-200 pb-1">{title}</h3>
      <p className="text-[11px] leading-relaxed text-slate-700">{content}</p>
    </section>
  );
}
