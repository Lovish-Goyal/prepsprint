'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FileText, Plus, Trash2, Download, Eye, Edit3, User,
  Briefcase, Code, Save, CheckCircle, Layout, BookOpen,
  Award, Globe, Heart, ChevronDown, ChevronUp
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const EMPTY_EXP = { company: '', role: '', duration: '', desc: '' };
const EMPTY_EDU = { school: '', degree: '', year: '' };
const EMPTY_PROJ = { name: '', link: '', desc: '' };
const EMPTY_CERT = { name: '', issuer: '', year: '' };

function ScaledA4Wrapper({ children }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.parentElement.clientWidth;
      const targetWidth = 794;
      if (parentWidth < targetWidth) {
        setScale(parentWidth / targetWidth);
      } else {
        setScale(1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [children]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center items-start overflow-hidden rounded-xl bg-slate-50 border border-slate-200/50" 
      style={{ height: `${1123 * scale}px` }}
    >
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          width: '794px',
          height: '1123px',
          flexShrink: 0,
          boxSizing: 'border-box'
        }}
        className="shadow-xl bg-white"
      >
        {children}
      </div>
    </div>
  );
}

const DEFAULT_DATA = {
  full_name: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  summary: '',
  experience: [],
  projects: [],
  skills: [],
  education: [],
  certifications: [],
  languages: [],
  interests: [],
  templateId: 'ats-classic',
};

const SAMPLE_RESUME_DATA = {
  full_name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/johndoe',
  summary: 'Results-driven Senior Software Engineer with over 6 years of expertise building highly scalable web applications, real-time data pipelines, and optimized cloud architectures. Proven track record of leading cross-functional teams and implementing high-throughput microservices using React, Node.js, and AWS.',
  experience: [
    { 
      company: 'Tech Giants Inc.', 
      role: 'Senior Software Engineer', 
      duration: '2023 – Present', 
      desc: 'Led a cross-functional team of 6 engineers to re-architect core payment microservices, reducing transaction processing latencies by 35%.\nConfigured AWS CloudFront CDN caching, improving global landing page load times by 40% and boosting conversions.\nDesigned real-time telemetry dashboards using Grafana and Prometheus to monitor system health and resolve critical anomalies.' 
    },
    { 
      company: 'InnovateCorp', 
      role: 'Full Stack Developer', 
      duration: '2021 – 2023', 
      desc: 'Built and scaled secure OAuth2 user authentication middleware, protecting customer identity information across 5 core services.\nImplemented dynamic lazy-loading and search auto-suggest indices in Elasticsearch, cutting database query traffic by 25%.\nDeveloped responsive client-side pages in Next.js with 100% test coverage using Jest and React Testing Library.' 
    }
  ],
  projects: [
    { 
      name: 'Distributed Task Scheduler', 
      link: 'github.com/doe/scheduler', 
      desc: 'Developed an open-source task scheduling library in Go and PostgreSQL, serving 15,000+ tasks per second.\nProgrammed custom cron matching algorithms to trigger events with millisecond-level precision.' 
    },
    { 
      name: 'Cloud Metrics Daemon', 
      link: 'github.com/doe/metrics', 
      desc: 'Built a lightweight system agent that gathers CPU/memory telemetry across server instances and pushes to central database.' 
    }
  ],
  skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'FastAPI', 'AWS', 'Docker', 'Kubernetes', 'Elasticsearch', 'CI/CD'],
  education: [
    { school: 'Georgia Institute of Technology', degree: 'M.S. Computer Science', year: '2023' },
    { school: 'Stanford University', degree: 'B.S. Computer Science', year: '2021' }
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' }
  ],
  languages: ['English (Fluent)', 'Spanish (Conversational)'],
  interests: ['Open Source Contributing', 'Long-Distance Marathons', 'Artificial Intelligence Ethics']
};

// ------------ Section Wrapper with collapse ----------
function Section({ icon: Icon, title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="toolkit-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/70 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={16} className="text-indigo-500" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">{title}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function TagInput({ values = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setDraft('');
  };
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="input-field text-sm flex-1"
        />
        <button onClick={add} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">
          <Plus size={14} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {values.map((v, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full">
              {v}
              <button onClick={() => remove(i)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <Trash2 size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ TEMPLATES ============
function ATSClassic({ data, isSample = false }) {
  const name = isSample ? SAMPLE_RESUME_DATA.full_name : (data.full_name || 'Your Name');
  const email = isSample ? SAMPLE_RESUME_DATA.email : data.email;
  const phone = isSample ? SAMPLE_RESUME_DATA.phone : data.phone;
  const location = isSample ? SAMPLE_RESUME_DATA.location : data.location;
  const linkedin = isSample ? SAMPLE_RESUME_DATA.linkedin : data.linkedin;
  const summary = isSample ? SAMPLE_RESUME_DATA.summary : data.summary;
  const experience = isSample ? SAMPLE_RESUME_DATA.experience : (data.experience || []);
  const education = isSample ? SAMPLE_RESUME_DATA.education : (data.education || []);
  const projects = isSample ? SAMPLE_RESUME_DATA.projects : (data.projects || []);
  const skills = isSample ? SAMPLE_RESUME_DATA.skills : (data.skills || []);
  const certifications = isSample ? SAMPLE_RESUME_DATA.certifications : (data.certifications || []);
  const interests = isSample ? SAMPLE_RESUME_DATA.interests : (data.interests || []);

  return (
    <div className="font-serif text-slate-900 text-[12px] leading-relaxed max-w-[700px] mx-auto p-2 select-none font-medium">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-none">{name}</h2>
          <p className="text-[11px] font-sans text-slate-500 mt-2 uppercase tracking-widest font-semibold">Candidate Profile</p>
        </div>
        <div className="text-[11px] text-right font-sans text-slate-700 space-y-1 font-semibold">
          {email && <p>{email}</p>}
          {phone && <p>{phone}</p>}
          {location && <p>{location}</p>}
          {linkedin && <p className="text-indigo-600 font-bold">{linkedin}</p>}
        </div>
      </div>

      {summary && (
        <ATSSection title="Professional Summary">
          <p className="text-slate-800 leading-relaxed font-medium text-[12px]">{summary}</p>
        </ATSSection>
      )}

      {experience?.length > 0 && (
        <ATSSection title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline font-sans font-bold text-[13px] text-slate-900">
                <span>{exp.role} {exp.company ? ` • ${exp.company}` : ''}</span>
                <span className="text-[10px] text-slate-600 font-bold">{exp.duration}</span>
              </div>
              {exp.desc && (
                <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-800 font-medium text-[12px]">
                  {exp.desc.split('\n').map((bullet, idx) => bullet.trim() && (
                    <li key={idx}>{bullet.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ATSSection>
      )}

      {education?.length > 0 && (
        <ATSSection title="Education">
          {education.map((edu, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline font-sans text-[13px]">
                <span className="font-bold text-slate-900">{edu.degree}</span>
                <span className="text-[10px] text-slate-600 font-bold">{edu.year}</span>
              </div>
              <p className="text-slate-700 italic font-medium mt-1">{edu.school}</p>
            </div>
          ))}
        </ATSSection>
      )}

      {projects?.length > 0 && (
        <ATSSection title="Personal Projects">
          {projects.map((p, i) => (
            <div key={i} className="mb-4">
              <p className="font-sans font-bold text-[13px] text-slate-900">{p.name} {p.link ? <span className="font-normal text-slate-500 text-[10px] ml-2">({p.link})</span> : ''}</p>
              {p.desc && (
                <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-800 font-medium text-[12px]">
                  {p.desc.split('\n').map((bullet, idx) => bullet.trim() && (
                    <li key={idx}>{bullet.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ATSSection>
      )}

      {skills?.length > 0 && (
        <ATSSection title="Technical Skills & Interests">
          <p className="text-slate-800 font-medium text-[12px]"><span className="font-sans font-bold text-[10px] text-slate-500 uppercase tracking-wider mr-2">Skills:</span> {skills.join(' • ')}</p>
          {interests?.length > 0 && (
            <p className="text-slate-800 font-medium text-[12px] mt-2"><span className="font-sans font-bold text-[10px] text-slate-500 uppercase tracking-wider mr-2">Interests:</span> {interests.join(' • ')}</p>
          )}
        </ATSSection>
      )}

      {certifications?.length > 0 && (
        <ATSSection title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} className="flex justify-between mb-2 font-sans text-slate-800 text-[12px] font-medium">
              <span className="font-bold">{c.name}{c.issuer ? ` (${c.issuer})` : ''}</span>
              <span className="text-[10px] text-slate-600 font-bold">{c.year}</span>
            </div>
          ))}
        </ATSSection>
      )}
    </div>
  );
}

function ATSSection({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-350 pb-0.5 mb-2 text-slate-800">{title}</h3>
      {children}
    </div>
  );
}

function ModernPro({ data, isSample = false }) {
  const name = isSample ? SAMPLE_RESUME_DATA.full_name : (data.full_name || 'Your Name');
  const email = isSample ? SAMPLE_RESUME_DATA.email : data.email;
  const phone = isSample ? SAMPLE_RESUME_DATA.phone : data.phone;
  const location = isSample ? SAMPLE_RESUME_DATA.location : data.location;
  const linkedin = isSample ? SAMPLE_RESUME_DATA.linkedin : data.linkedin;
  const summary = isSample ? SAMPLE_RESUME_DATA.summary : data.summary;
  const experience = isSample ? SAMPLE_RESUME_DATA.experience : (data.experience || []);
  const education = isSample ? SAMPLE_RESUME_DATA.education : (data.education || []);
  const projects = isSample ? SAMPLE_RESUME_DATA.projects : (data.projects || []);
  const skills = isSample ? SAMPLE_RESUME_DATA.skills : (data.skills || []);
  const certifications = isSample ? SAMPLE_RESUME_DATA.certifications : (data.certifications || []);
  const languages = isSample ? SAMPLE_RESUME_DATA.languages : (data.languages || []);
  const interests = isSample ? SAMPLE_RESUME_DATA.interests : (data.interests || []);

  return (
    <div className="font-sans text-slate-800 text-[12px] leading-relaxed max-w-[700px] mx-auto p-2 select-none font-medium">
      {/* Top Banner Header */}
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">{name}</h2>
        <p className="text-[11px] text-indigo-700 font-extrabold tracking-wide mt-2.5 uppercase">Software Engineer | Technical Specialist</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3.5 text-[11px] text-slate-600 font-bold">
          {email && <span>✉ {email}</span>}
          {phone && <span>☏ {phone}</span>}
          {location && <span>📍 {location}</span>}
          {linkedin && <span className="text-indigo-600 font-black">🔗 {linkedin}</span>}
        </div>
      </div>

      {/* Two-Column Split Layout */}
      <div className="grid grid-cols-[1.5fr,1fr] gap-8">
        {/* Left Column (Summary, Experience, Education) */}
        <div className="space-y-8">
          {summary && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3.5">Summary</h3>
              <p className="text-slate-700 leading-relaxed font-medium text-[12px]">{summary}</p>
            </div>
          )}

          {experience?.length > 0 && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3.5">Experience</h3>
              {experience.map((exp, i) => (
                <div key={i} className="mb-5">
                  <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px]">
                    <span>{exp.role}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{exp.duration}</span>
                  </div>
                  <p className="text-[11px] text-indigo-700 font-bold mt-1">{exp.company}</p>
                  {exp.desc && (
                    <ul className="list-disc pl-4 mt-2.5 space-y-2.5 text-slate-700 font-medium text-[12px]">
                      {exp.desc.split('\n').map((bullet, idx) => bullet.trim() && (
                        <li key={idx}>{bullet.replace(/^-\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {education?.length > 0 && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3.5">Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px]">
                    <span>{edu.degree}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{edu.year}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic font-bold mt-1">{edu.school}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Achievements, Skills, Courses, Passions) */}
        <div className="space-y-8">
          {skills?.length > 0 && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3.5">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-850 text-[10px] font-black px-3 py-1 rounded border border-indigo-150 uppercase tracking-wide">{s}</span>
                ))}
              </div>
            </div>
          )}

          {projects?.length > 0 && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3">Projects</h3>
              {projects.map((p, i) => (
                <div key={i} className="mb-4">
                  <p className="font-bold text-slate-900 text-[13px]">{p.name}</p>
                  {p.link && <p className="text-[10px] text-indigo-700 font-bold mt-1">{p.link}</p>}
                  {p.desc && <p className="text-slate-700 mt-2 font-medium text-[12px] leading-relaxed">{p.desc}</p>}
                </div>
              ))}
            </div>
          )}

          {certifications?.length > 0 && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3">Certifications</h3>
              <div className="space-y-3">
                {certifications.map((c, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <span className="text-indigo-600 text-sm mt-0.5">★</span>
                    <div>
                      <p className="font-bold text-slate-900 text-[12px]">{c.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{c.issuer} • {c.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(languages?.length > 0 || interests?.length > 0) && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3">Passions & Info</h3>
              {languages?.length > 0 && (
                <p className="text-slate-700 mt-2 text-[12px] font-medium"><span className="font-bold text-slate-900">Languages:</span> {languages.join(', ')}</p>
              )}
              {interests?.length > 0 && (
                <p className="text-slate-700 mt-2 text-[12px] font-medium"><span className="font-bold text-slate-900">Interests:</span> {interests.join(', ')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModernSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function MinimalistScholar({ data, isSample = false }) {
  const name = isSample ? SAMPLE_RESUME_DATA.full_name : (data.full_name || 'Your Name');
  const email = isSample ? SAMPLE_RESUME_DATA.email : data.email;
  const phone = isSample ? SAMPLE_RESUME_DATA.phone : data.phone;
  const linkedin = isSample ? SAMPLE_RESUME_DATA.linkedin : data.linkedin;
  const summary = isSample ? SAMPLE_RESUME_DATA.summary : data.summary;
  const experience = isSample ? SAMPLE_RESUME_DATA.experience : (data.experience || []);
  const education = isSample ? SAMPLE_RESUME_DATA.education : (data.education || []);
  const projects = isSample ? SAMPLE_RESUME_DATA.projects : (data.projects || []);
  const skills = isSample ? SAMPLE_RESUME_DATA.skills : (data.skills || []);

  return (
    <div className="font-sans text-slate-750 text-[12px] leading-relaxed max-w-[700px] mx-auto p-2 select-none font-medium">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-light text-slate-900 tracking-tight">{name}</h2>
          <p className="text-[11px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Academic Scholar Profile</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-500 font-bold">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {linkedin && <span>{linkedin}</span>}
        </div>
      </div>

      {summary && (
        <MinSection label="Profile">
          <p className="text-slate-700 leading-relaxed font-medium text-[12px]">{summary}</p>
        </MinSection>
      )}

      {experience?.length > 0 && (
        <MinSection label="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px]">
                <span>{exp.role}</span>
                <span className="text-[10px] text-slate-500 font-bold">{exp.duration}</span>
              </div>
              {exp.company && <p className="text-[11px] text-slate-600 italic font-bold mt-1">{exp.company}</p>}
              {exp.desc && (
                <ul className="list-disc pl-4 mt-2 space-y-2 text-slate-700 font-medium text-[12px]">
                  {exp.desc.split('\n').map((bullet, idx) => bullet.trim() && (
                    <li key={idx}>{bullet.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </MinSection>
      )}

      {education?.length > 0 && (
        <MinSection label="Education">
          {education.map((edu, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px]">
                <span>{edu.degree}</span>
                <span className="text-[10px] text-slate-500 font-bold">{edu.year}</span>
              </div>
              {edu.school && <p className="text-[11px] text-slate-600 italic font-bold mt-1">{edu.school}</p>}
            </div>
          ))}
        </MinSection>
      )}

      {skills?.length > 0 && (
        <MinSection label="Skills">
          <p className="text-slate-700 font-bold text-[12px]">{skills.join('  ·  ')}</p>
        </MinSection>
      )}

      {projects?.length > 0 && (
        <MinSection label="Projects">
          {projects.map((p, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px]">
                <span>{p.name}</span>
                {p.link && <span className="text-[10px] text-slate-500 font-bold">{p.link}</span>}
              </div>
              {p.desc && (
                <ul className="list-disc pl-4 mt-2 space-y-2 text-slate-700 font-medium text-[12px]">
                  {p.desc.split('\n').map((bullet, idx) => bullet.trim() && (
                    <li key={idx}>{bullet.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </MinSection>
      )}
    </div>
  );
}

function MinSection({ label, children }) {
  return (
    <div className="grid grid-cols-[110px,1fr] gap-4 mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 pt-0.5">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function CreativeTech({ data, isSample = false }) {
  const name = isSample ? SAMPLE_RESUME_DATA.full_name : (data.full_name || 'Your Name');
  const email = isSample ? SAMPLE_RESUME_DATA.email : data.email;
  const phone = isSample ? SAMPLE_RESUME_DATA.phone : data.phone;
  const location = isSample ? SAMPLE_RESUME_DATA.location : data.location;
  const linkedin = isSample ? SAMPLE_RESUME_DATA.linkedin : data.linkedin;
  const summary = isSample ? SAMPLE_RESUME_DATA.summary : data.summary;
  const experience = isSample ? SAMPLE_RESUME_DATA.experience : (data.experience || []);
  const education = isSample ? SAMPLE_RESUME_DATA.education : (data.education || []);
  const projects = isSample ? SAMPLE_RESUME_DATA.projects : (data.projects || []);
  const skills = isSample ? SAMPLE_RESUME_DATA.skills : (data.skills || []);

  return (
    <div className="font-sans text-[12px] leading-relaxed max-w-[700px] mx-auto p-2 select-none font-medium">
      {/* Header */}
      <div className="pb-4 mb-6 border-b border-indigo-100 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase leading-none">{name}</h2>
          <p className="text-[11px] text-indigo-600 font-black tracking-widest mt-2.5 uppercase">Technical Engineer & Developer</p>
          {summary && <p className="text-slate-650 text-[12px] mt-2 max-w-md leading-relaxed font-medium">{summary}</p>}
        </div>
        <div className="text-[11px] text-indigo-650 font-bold space-y-1 md:text-right">
          {email && <p>✉ {email}</p>}
          {phone && <p>☏ {phone}</p>}
          {location && <p>📍 {location}</p>}
          {linkedin && <p className="text-slate-500">🔗 {linkedin}</p>}
        </div>
      </div>

      <div className="space-y-6">
        {experience?.length > 0 && (
          <CreativeSection title="Work Experience">
            {experience.map((exp, i) => (
              <div key={i} className="mb-5 pl-4 border-l-2 border-indigo-550">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px]">
                  <span>{exp.role}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{exp.duration}</span>
                </div>
                <p className="text-[11px] text-indigo-700 font-bold mt-1">{exp.company}</p>
                {exp.desc && (
                  <ul className="list-disc pl-4 mt-2 space-y-2 text-slate-700 font-medium text-[12px]">
                    {exp.desc.split('\n').map((bullet, idx) => bullet.trim() && (
                      <li key={idx}>{bullet.replace(/^-\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CreativeSection>
        )}

        {education?.length > 0 && (
          <CreativeSection title="Education">
            {education.map((edu, i) => (
              <div key={i} className="mb-4 pl-4 border-l-2 border-indigo-550">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px]">
                  <span>{edu.degree}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{edu.year}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-bold mt-1">{edu.school}</p>
              </div>
            ))}
          </CreativeSection>
        )}

        {skills?.length > 0 && (
          <CreativeSection title="Technology Stack">
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="bg-slate-100 text-slate-800 text-[10px] font-black px-3.5 py-1 rounded-xl uppercase tracking-wide border border-slate-200">{s}</span>
              ))}
            </div>
          </CreativeSection>
        )}

        {projects?.length > 0 && (
          <CreativeSection title="Key Projects">
            {projects.map((p, i) => (
              <div key={i} className="mb-4 pl-4 border-l-2 border-indigo-550">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px]">
                  <span>{p.name}</span>
                  {p.link && <span className="text-[10px] text-indigo-600 font-bold">{p.link}</span>}
                </div>
                {p.desc && (
                  <ul className="list-disc pl-4 mt-2 space-y-2 text-slate-700 font-medium text-[12px]">
                    {p.desc.split('\n').map((bullet, idx) => bullet.trim() && (
                      <li key={idx}>{bullet.replace(/^-\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CreativeSection>
        )}
      </div>
    </div>
  );
}

function CreativeSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ExecutiveElite({ data, isSample = false }) {
  const name = isSample ? SAMPLE_RESUME_DATA.full_name : (data.full_name || 'Your Name');
  const email = isSample ? SAMPLE_RESUME_DATA.email : data.email;
  const phone = isSample ? SAMPLE_RESUME_DATA.phone : data.phone;
  const location = isSample ? SAMPLE_RESUME_DATA.location : data.location;
  const linkedin = isSample ? SAMPLE_RESUME_DATA.linkedin : data.linkedin;
  const summary = isSample ? SAMPLE_RESUME_DATA.summary : data.summary;
  const experience = isSample ? SAMPLE_RESUME_DATA.experience : (data.experience || []);
  const education = isSample ? SAMPLE_RESUME_DATA.education : (data.education || []);
  const projects = isSample ? SAMPLE_RESUME_DATA.projects : (data.projects || []);
  const skills = isSample ? SAMPLE_RESUME_DATA.skills : (data.skills || []);
  const certifications = isSample ? SAMPLE_RESUME_DATA.certifications : (data.certifications || []);

  return (
    <div className="font-serif text-slate-850 text-[12px] leading-relaxed max-w-[800px] mx-auto p-2 border-0 font-medium">
      {/* Header */}
      <div className="text-center mb-7 pb-5 border-b-2 border-slate-900">
        <h2 className="text-3xl font-bold tracking-widest uppercase text-slate-900 leading-none">{name}</h2>
        <p className="text-[11px] text-slate-600 font-sans font-bold tracking-widest mt-2 uppercase">Executive & Technology Director</p>
        <div className="flex justify-center flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[10px] text-slate-600 font-sans tracking-widest uppercase font-bold">
          {email && <span>{email}</span>}
          {phone && <><span className="text-slate-300">|</span><span>{phone}</span></>}
          {location && <><span className="text-slate-300">|</span><span>{location}</span></>}
          {linkedin && <><span className="text-slate-300">|</span><span className="text-indigo-650">{linkedin}</span></>}
        </div>
      </div>

      {summary && (
        <ExecSection title="Executive Summary">
          <p className="text-slate-800 leading-relaxed italic text-center font-medium text-[12px]">{summary}</p>
        </ExecSection>
      )}

      {experience?.length > 0 && (
        <ExecSection title="Professional Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline font-sans font-bold text-slate-900 text-[13px]">
                <span className="uppercase tracking-wider">{exp.role}</span>
                <span className="text-[10px] text-slate-500 font-bold">{exp.duration}</span>
              </div>
              {exp.company && <p className="text-[10px] italic text-slate-600 font-bold mt-1">{exp.company}</p>}
              {exp.desc && (
                <ul className="list-disc pl-4 mt-2 space-y-2 text-slate-700 font-medium text-[12px]">
                  {exp.desc.split('\n').map((bullet, idx) => bullet.trim() && (
                    <li key={idx}>{bullet.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ExecSection>
      )}

      {education?.length > 0 && (
        <ExecSection title="Education">
          {education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline mb-4 font-sans font-bold text-slate-900 text-[13px]">
              <div>
                <span>{edu.degree}</span>
                <p className="text-[10px] italic text-slate-600 font-bold mt-1">{edu.school}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{edu.year}</span>
            </div>
          ))}
        </ExecSection>
      )}

      {skills?.length > 0 && (
        <ExecSection title="Core Competencies">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
            {skills.map((s, i) => (
              <span key={i} className="text-[11px] text-slate-800 font-bold">{s}</span>
            ))}
          </div>
        </ExecSection>
      )}

      {projects?.length > 0 && (
        <ExecSection title="Strategic Projects">
          {projects.map((p, i) => (
            <div key={i} className="mb-4">
              <p className="text-[13px] font-bold text-slate-900">{p.name} {p.link ? <span className="font-normal text-slate-500 ml-2 font-sans text-[10px]">({p.link})</span> : ''}</p>
              {p.desc && <p className="text-[12px] text-slate-700 leading-relaxed mt-1 font-medium">{p.desc}</p>}
            </div>
          ))}
        </ExecSection>
      )}

      {certifications?.length > 0 && (
        <ExecSection title="Certifications & Awards">
          {certifications.map((c, i) => (
            <div key={i} className="flex justify-between mb-2">
              <p className="text-[12px] font-bold text-slate-800">{c.name}{c.issuer ? ` (${c.issuer})` : ''}</p>
              {c.year && <p className="text-[10px] text-slate-500 font-sans font-bold">{c.year}</p>}
            </div>
          ))}
        </ExecSection>
      )}
    </div>
  );
}

function ExecSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-center text-slate-400 border-b border-slate-100 pb-1 mb-3">{title}</h3>
      {children}
    </div>
  );
}

// ============ TEMPLATE META ============
const TEMPLATES = [
  { id: 'ats-classic', name: 'ATS Classic', desc: 'Preferred by 90% of ATS scanners. Serif, structured.' },
  { id: 'modern-pro', name: 'Modern Professional', desc: 'Indigo header, two-column. Google/Microsoft style.' },
  { id: 'minimalist', name: 'Minimalist Scholar', desc: 'Ultra-clean. McKinsey, academic, consulting roles.' },
  { id: 'creative-tech', name: 'Creative Tech', desc: 'Bold, dark header. Startups & design-forward teams.' },
  { id: 'executive', name: 'Executive Elite', desc: 'Centered, serif. C-suite, senior leadership roles.' },
];

function TemplatePreview({ data, templateId }) {
  const wrapClass = "bg-white shadow-xl p-10 w-full max-w-[600px] mx-auto min-h-[840px] border border-slate-200 overflow-hidden";
  if (templateId === 'ats-classic') return <div className={wrapClass}><ATSClassic data={data} /></div>;
  if (templateId === 'modern-pro') return <div className={wrapClass}><ModernPro data={data} /></div>;
  if (templateId === 'minimalist') return <div className={wrapClass}><MinimalistScholar data={data} /></div>;
  if (templateId === 'creative-tech') return <div className={wrapClass}><CreativeTech data={data} /></div>;
  if (templateId === 'executive') return <div className={wrapClass}><ExecutiveElite data={data} /></div>;
  return null;
}

// ============ MAIN PAGE ============
export default function ResumeBuilder() {
  const [view, setView] = useState('edit');
  const [templateId, setTemplateId] = useState('ats-classic');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [resumeData, setResumeData] = useState(DEFAULT_DATA);

  useEffect(() => {
    axios.get(`${API_BASE}/resume/`)
      .then(res => {
        if (res.data) {
          setResumeData({ ...DEFAULT_DATA, ...res.data });
          if (res.data.templateId) setTemplateId(res.data.templateId);
        }
      })
      .catch(err => console.error('Failed to fetch resume:', err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${API_BASE}/resume/`, { ...resumeData, templateId });
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${API_BASE}/resume/`, { ...resumeData, templateId });
      setLastSaved(new Date().toLocaleTimeString());
      
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('resume-download-target');
      const nameSlug = resumeData.full_name ? resumeData.full_name.replace(/\s+/g, '_') : 'Resume';
      
      const opt = {
        margin:       0,
        filename:     `${nameSlug}_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2.5, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const set = (field, value) => setResumeData(prev => ({ ...prev, [field]: value }));

  const updateList = (field, idx, key, value) => {
    const arr = [...(resumeData[field] || [])];
    arr[idx] = { ...arr[idx], [key]: value };
    set(field, arr);
  };

  const addItem = (field, blank) => set(field, [...(resumeData[field] || []), { ...blank }]);
  const removeItem = (field, idx) => set(field, (resumeData[field] || []).filter((_, i) => i !== idx));

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <style dangerouslySetInnerHTML={{ __html: `
        #resume-print-area *, #resume-download-target *, .resume-times-font *, [id^="resume-"] * {
          font-family: "Times New Roman", Times, serif !important;
        }
      `}} />
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
            <FileText size={14} /> Document Architect
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resume Builder</h1>
          <p className="text-slate-500 text-sm">Build ATS-optimized resumes with globally accepted templates.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Edit / Preview toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setView('edit')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Edit3 size={13} /> Edit
            </button>
            <button
              onClick={() => setView('preview')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Eye size={13} /> Preview
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            <Download size={14} />
            <span>Download</span>
          </button>

          {lastSaved && (
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-wider">
              <CheckCircle size={11} /> Saved {lastSaved}
            </div>
          )}
        </div>
      </section>

      {/* ===== EDIT VIEW ===== */}
      {view === 'edit' && (
        <div className="space-y-5">
          {/* Template picker */}
          <div className="toolkit-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Layout size={15} className="text-indigo-500" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Template</span>
            </div>
            <div className="grid sm:grid-cols-5 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${templateId === t.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest leading-snug">{t.name}</p>
                  <p className="text-[9px] mt-1 leading-snug opacity-70 hidden sm:block">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Details */}
          <Section icon={User} title="Personal Details">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name"><input className="input-field text-sm" value={resumeData.full_name} onChange={e => set('full_name', e.target.value)} /></Field>
              <Field label="Email"><input className="input-field text-sm" type="email" value={resumeData.email} onChange={e => set('email', e.target.value)} /></Field>
              <Field label="Phone"><input className="input-field text-sm" value={resumeData.phone} onChange={e => set('phone', e.target.value)} /></Field>
              <Field label="Location"><input className="input-field text-sm" value={resumeData.location} onChange={e => set('location', e.target.value)} /></Field>
              <Field label="LinkedIn / Portfolio">
                <input className="input-field text-sm" value={resumeData.linkedin} onChange={e => set('linkedin', e.target.value)} />
              </Field>
            </div>
            <Field label="Professional Summary">
              <textarea className="input-field text-sm h-24 leading-relaxed" value={resumeData.summary} onChange={e => set('summary', e.target.value)} />
            </Field>
          </Section>

          {/* Experience */}
          <Section icon={Briefcase} title="Experience">
            {(resumeData.experience || []).map((exp, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                <button onClick={() => removeItem('experience', idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Role / Position"><input className="input-field text-sm" value={exp.role} onChange={e => updateList('experience', idx, 'role', e.target.value)} /></Field>
                  <Field label="Company"><input className="input-field text-sm" value={exp.company} onChange={e => updateList('experience', idx, 'company', e.target.value)} /></Field>
                  <Field label="Duration (e.g. 2022 – Present)"><input className="input-field text-sm" value={exp.duration} onChange={e => updateList('experience', idx, 'duration', e.target.value)} /></Field>
                </div>
                <Field label="Description & Impact">
                  <textarea className="input-field text-sm h-20 leading-relaxed" value={exp.desc} onChange={e => updateList('experience', idx, 'desc', e.target.value)} />
                </Field>
              </div>
            ))}
            <button onClick={() => addItem('experience', EMPTY_EXP)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 text-sm font-bold">
              <Plus size={16} /> Add Experience
            </button>
          </Section>

          {/* Education */}
          <Section icon={BookOpen} title="Education">
            {(resumeData.education || []).map((edu, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                <button onClick={() => removeItem('education', idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Degree / Qualification"><input className="input-field text-sm" value={edu.degree} onChange={e => updateList('education', idx, 'degree', e.target.value)} /></Field>
                  <Field label="School / University"><input className="input-field text-sm" value={edu.school} onChange={e => updateList('education', idx, 'school', e.target.value)} /></Field>
                  <Field label="Year"><input className="input-field text-sm" value={edu.year} onChange={e => updateList('education', idx, 'year', e.target.value)} /></Field>
                </div>
              </div>
            ))}
            <button onClick={() => addItem('education', EMPTY_EDU)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 text-sm font-bold">
              <Plus size={16} /> Add Education
            </button>
          </Section>

          {/* Projects */}
          <Section icon={Code} title="Projects">
            {(resumeData.projects || []).map((proj, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                <button onClick={() => removeItem('projects', idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Project Name"><input className="input-field text-sm" value={proj.name} onChange={e => updateList('projects', idx, 'name', e.target.value)} /></Field>
                  <Field label="Link (optional)"><input className="input-field text-sm" value={proj.link} onChange={e => updateList('projects', idx, 'link', e.target.value)} /></Field>
                </div>
                <Field label="Description">
                  <textarea className="input-field text-sm h-16 leading-relaxed" value={proj.desc} onChange={e => updateList('projects', idx, 'desc', e.target.value)} />
                </Field>
              </div>
            ))}
            <button onClick={() => addItem('projects', EMPTY_PROJ)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 text-sm font-bold">
              <Plus size={16} /> Add Project
            </button>
          </Section>

          {/* Certifications */}
          <Section icon={Award} title="Certifications">
            {(resumeData.certifications || []).map((cert, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                <button onClick={() => removeItem('certifications', idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Field label="Certification Name"><input className="input-field text-sm" value={cert.name} onChange={e => updateList('certifications', idx, 'name', e.target.value)} /></Field>
                  <Field label="Issuer"><input className="input-field text-sm" value={cert.issuer} onChange={e => updateList('certifications', idx, 'issuer', e.target.value)} /></Field>
                  <Field label="Year"><input className="input-field text-sm" value={cert.year} onChange={e => updateList('certifications', idx, 'year', e.target.value)} /></Field>
                </div>
              </div>
            ))}
            <button onClick={() => addItem('certifications', EMPTY_CERT)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 text-sm font-bold">
              <Plus size={16} /> Add Certification
            </button>
          </Section>

          {/* Skills */}
          <Section icon={Code} title="Skills">
            <TagInput values={resumeData.skills || []} onChange={v => set('skills', v)} placeholder="e.g. React, System Design, AWS…" />
          </Section>

          {/* Languages */}
          <Section icon={Globe} title="Languages">
            <TagInput values={resumeData.languages || []} onChange={v => set('languages', v)} placeholder="e.g. English (Fluent), Hindi (Native)…" />
          </Section>

          {/* Interests */}
          <Section icon={Heart} title="Hobbies & Interests">
            <TagInput values={resumeData.interests || []} onChange={v => set('interests', v)} placeholder="e.g. Open Source, Competitive Programming…" />
          </Section>
        </div>
      )}

      {/* ===== PREVIEW VIEW ===== */}
      {view === 'preview' && (
        <div className="space-y-6 w-full">
          {/* Template tabs in preview */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-3xl mx-auto w-full border border-slate-200/40">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`flex-1 min-w-[130px] text-center px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  templateId === t.id 
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start w-full">
            {/* Left side: Live user resume preview inside ScaledA4Wrapper */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">Active: {TEMPLATES.find(t => t.id === templateId)?.name}</span>
              </div>
              <ScaledA4Wrapper>
                <div className="w-[794px] h-[1123px] bg-white p-10 overflow-hidden" id="resume-print-area" style={{ boxSizing: 'border-box' }}>
                  {templateId === 'ats-classic' && <ATSClassic data={resumeData} />}
                  {templateId === 'modern-pro' && <ModernPro data={resumeData} />}
                  {templateId === 'minimalist' && <MinimalistScholar data={resumeData} />}
                  {templateId === 'creative-tech' && <CreativeTech data={resumeData} />}
                  {templateId === 'executive' && <ExecutiveElite data={resumeData} />}
                </div>
              </ScaledA4Wrapper>
            </div>

            {/* Right side: Mockup Sample Resume inside ScaledA4Wrapper */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference Template Sample</span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">Sample Data View</span>
              </div>
              <ScaledA4Wrapper>
                <div className="w-[794px] h-[1123px] bg-white p-10 overflow-hidden" style={{ boxSizing: 'border-box' }}>
                  {templateId === 'ats-classic' && <ATSClassic data={SAMPLE_RESUME_DATA} />}
                  {templateId === 'modern-pro' && <ModernPro data={SAMPLE_RESUME_DATA} />}
                  {templateId === 'minimalist' && <MinimalistScholar data={SAMPLE_RESUME_DATA} />}
                  {templateId === 'creative-tech' && <CreativeTech data={SAMPLE_RESUME_DATA} />}
                  {templateId === 'executive' && <ExecutiveElite data={SAMPLE_RESUME_DATA} />}
                </div>
              </ScaledA4Wrapper>
            </div>
          </div>
        </div>
      )}

      {/* Offscreen A4 container for direct PDF download */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div className="w-[794px] h-[1123px] bg-white p-10 overflow-hidden" id="resume-download-target" style={{ boxSizing: 'border-box' }}>
          {templateId === 'ats-classic' && <ATSClassic data={resumeData} />}
          {templateId === 'modern-pro' && <ModernPro data={resumeData} />}
          {templateId === 'minimalist' && <MinimalistScholar data={resumeData} />}
          {templateId === 'creative-tech' && <CreativeTech data={resumeData} />}
          {templateId === 'executive' && <ExecutiveElite data={resumeData} />}
        </div>
      </div>
    </div>
  );
}
