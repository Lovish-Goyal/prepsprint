'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Upload, FileText, Briefcase, ArrowRight, AlertCircle,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, RefreshCw,
  Sparkles, TrendingUp, Compass, BookOpen, Target,
  Zap, AlertTriangle, Award, BarChart3, Brain, Lightbulb,
  ChevronRight
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const PRIORITY_CONFIG = {
  Critical: {
    color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200',
    leftBorder: 'border-l-rose-500', dot: 'bg-rose-500', tag: 'bg-rose-100 text-rose-700 border-rose-200'
  },
  High: {
    color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200',
    leftBorder: 'border-l-orange-400', dot: 'bg-orange-400', tag: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  Medium: {
    color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200',
    leftBorder: 'border-l-amber-400', dot: 'bg-amber-400', tag: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  Low: {
    color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200',
    leftBorder: 'border-l-slate-300', dot: 'bg-slate-400', tag: 'bg-slate-100 text-slate-600 border-slate-200'
  },
};

// ── Circular Score Gauge ──────────────────────────────────────────────────
function CircularGauge({ score, size = 140 }) {
  const pct = Math.min(100, Math.max(0, score));
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;
  const color = pct >= 70 ? '#10b981' : pct >= 45 ? '#f59e0b' : '#ef4444';
  const label = pct >= 70 ? 'Strong Match' : pct >= 45 ? 'Developing' : 'Match Found';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 1.2s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white leading-none">{pct}</span>
        <span className="text-xs font-bold text-slate-300 leading-none">%</span>
        <span className="text-[10px] font-bold mt-1 leading-none" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

// ── Suggestion Card ──────────────────────────────────────────────────────
const SUGGESTION_CONFIG = {
  Learning: {
    color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200',
    leftBorder: 'border-l-blue-500', dot: 'bg-blue-500', tag: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: BookOpen
  },
  Project: {
    color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200',
    leftBorder: 'border-l-indigo-500', dot: 'bg-indigo-500', tag: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: Target
  },
  Certification: {
    color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
    leftBorder: 'border-l-emerald-500', dot: 'bg-emerald-500', tag: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: Award
  },
  Resume: {
    color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200',
    leftBorder: 'border-l-purple-500', dot: 'bg-purple-500', tag: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: FileText
  },
  Default: {
    color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200',
    leftBorder: 'border-l-slate-400', dot: 'bg-slate-400', tag: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: Lightbulb
  }
};

function SuggestionCard({ suggestion }) {
  const cfg = SUGGESTION_CONFIG[suggestion.type] || SUGGESTION_CONFIG['Default'];
  const Icon = cfg.icon;

  return (
    <div className={`border border-l-4 ${cfg.border} ${cfg.leftBorder} rounded-r-xl overflow-hidden bg-white transition-all duration-200 shadow-sm hover:shadow p-4`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
          <Icon size={16} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-snug">{suggestion.name}</p>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${cfg.tag}`}>
          {suggestion.type || 'Suggestion'}
        </span>
      </div>
    </div>
  );
}

// ── Progress Stepper ──────────────────────────────────────────────────────
function ProgressStepper({ currentStep }) {
  const steps = [
    { n: 1, label: 'Input Details' },
    { n: 2, label: 'AI Analysis' },
    { n: 3, label: 'Your Report' },
  ];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = currentStep > s.n;
        const active = currentStep === s.n;
        return (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
                done ? 'bg-indigo-600 border-indigo-600 text-white' :
                active ? 'bg-white border-indigo-600 text-indigo-600' :
                'bg-white border-slate-200 text-slate-400'
              }`}>
                {done ? <CheckCircle2 size={14} className="stroke-[2.5]" /> : s.n}
              </div>
              <span className={`text-xs font-bold hidden sm:block ${
                active ? 'text-slate-800' : done ? 'text-indigo-600' : 'text-slate-400'
              }`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 transition-all duration-500 ${
                currentStep > s.n ? 'bg-indigo-600' : 'bg-slate-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Animated Checklist Loader ─────────────────────────────────────────────
function AnalysisLoader() {
  const [activeIdx, setActiveIdx] = useState(0);
  const steps = [
    { label: 'Parsing resume profile', icon: FileText },
    { label: 'Extracting technical skills', icon: Brain },
    { label: 'Analyzing job requirements', icon: Briefcase },
    { label: 'Matching competencies', icon: CheckCircle2 },
    { label: 'Identifying skill gaps', icon: Target },
    { label: 'Generating recommendations', icon: Lightbulb },
    { label: 'Finalizing your report', icon: Sparkles },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(i => Math.min(i + 1, steps.length));
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-16 flex flex-col items-center justify-center gap-10">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-30" />
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BarChart3 size={24} className="text-indigo-600 animate-pulse" />
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const done = activeIdx > i;
          const active = activeIdx === i;
          return (
            <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${
              done ? 'opacity-100' : active ? 'opacity-100' : 'opacity-30'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                done ? 'bg-emerald-500' : active ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200'
              }`}>
                {done
                  ? <CheckCircle2 size={13} className="text-white stroke-[2.5]" />
                  : <Icon size={12} className={active ? 'text-white' : 'text-slate-400'} />
                }
              </div>
              <span className={`text-sm font-medium transition-colors ${
                done ? 'text-slate-500 line-through decoration-1' :
                active ? 'text-slate-900 font-bold' : 'text-slate-400'
              }`}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Gap Card ──────────────────────────────────────────────────────────────
function GapCard({ gap, index }) {
  const [open, setOpen] = useState(false);
  const cfg = PRIORITY_CONFIG[gap.importance] || PRIORITY_CONFIG['Medium'];

  const impactMap = { Critical: '+12–18%', High: '+7–12%', Medium: '+3–7%', Low: '+1–3%' };
  const impact = impactMap[gap.importance] || '+3–7%';

  return (
    <div className={`border border-l-4 ${cfg.border} ${cfg.leftBorder} rounded-r-xl overflow-hidden bg-white transition-all duration-200 shadow-sm hover:shadow`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left focus:outline-none group"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">{gap.name}</p>
          {!open && gap.desc && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{gap.desc}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.tag}`}>
            {gap.importance}
          </span>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full" title="Estimated match score impact">
            {impact}
          </span>
          {open
            ? <ChevronUp size={14} className="text-slate-400" />
            : <ChevronDown size={14} className="text-slate-400" />
          }
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 space-y-3 border-t border-slate-100">
          {gap.desc && (
            <div className="pt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Compass size={10} /> Why it matters
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{gap.desc}</p>
            </div>
          )}
          {gap.how_to_learn && (
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <BookOpen size={10} /> Action Plan
              </p>
              <p className="text-sm text-indigo-900/80 leading-relaxed">{gap.how_to_learn}</p>
            </div>
          )}
          <div className="flex items-center gap-2 pt-1">
            <Zap size={12} className="text-amber-500" />
            <p className="text-[11px] text-slate-500 font-medium">
              Closing this gap could improve your match score by <span className="font-bold text-slate-800">{impact}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stat Pill ─────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${color} shadow-sm`}>
      <Icon size={15} className="shrink-0" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 leading-none">{label}</p>
        <p className="text-base font-black leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function SkillAnalyzer() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [inputMode, setInputMode] = useState('paste');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState('0-1');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result);
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) { setError('Please provide your resume content.'); return; }
    if (!targetRole.trim()) { setError('Please specify a target job role.'); return; }
    if (!jobDescription.trim()) { setError('Please paste the job description.'); return; }
    setError(null);
    setStep(2);
    try {
      const res = await axios.post(`${API_BASE}/skills/analyze`, {
        resume_text: resumeText,
        target_role: targetRole,
        job_description: jobDescription,
        experience_years: experienceYears,
        current_skills: [],
      });
      setResults(res.data);
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Analysis failed. Please try again.';
      setError(msg);
      setStep(1);
    }
  };

  const reset = () => {
    setStep(1); setResults(null); setError(null);
    setResumeText(''); setResumeFile(null);
    setTargetRole(''); setJobDescription(''); setExperienceYears('0-1');
  };

  return (
    <div className="pb-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Target size={14} /> AI-Powered Analysis
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill Analyzer</h1>
            <p className="text-slate-500 text-sm mt-1.5 max-w-xl">
              Paste your resume and job description. Our AI will identify exact skill gaps, matching competencies, and a personalized action plan.
            </p>
          </div>
          {step === 3 && (
            <button onClick={reset} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 px-3.5 py-2 border border-slate-200 rounded-lg transition-colors bg-white shadow-sm">
              <RefreshCw size={13} /> New Analysis
            </button>
          )}
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={step} />

      {/* ── STEP 1: Input ───────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6 fade-in">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Resume */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <FileText size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Your Resume</h2>
                  <p className="text-[11px] text-slate-400">Paste text or upload a file</p>
                </div>
                {/* Toggle */}
                <div className="ml-auto flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                  {['paste', 'file'].map(m => (
                    <button key={m} onClick={() => setInputMode(m)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${inputMode === m ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400'}`}>
                      {m === 'paste' ? 'Paste' : 'Upload'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4">
                {inputMode === 'paste' ? (
                  <div className="space-y-1.5">
                    <textarea
                      value={resumeText}
                      onChange={e => setResumeText(e.target.value)}
                      placeholder="Paste your full resume — work experience, skills, education, projects..."
                      className="w-full h-72 p-3.5 border border-slate-200 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-400 font-sans"
                    />
                    <div className="flex justify-end">
                      <span className="text-[10px] text-slate-400">{resumeText.length} characters</span>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/10 rounded-xl cursor-pointer transition-all group gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:scale-105 transition-all">
                      <Upload size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">{resumeFile ? resumeFile.name : 'Click to upload resume'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Supports .txt, .md, plain text files</p>
                    </div>
                    {resumeFile && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={12} className="text-emerald-500" /> File ready
                      </span>
                    )}
                    <input type="file" accept=".txt,.md,.text,text/plain" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            {/* Right: Job Details */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Briefcase size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Job Requirements</h2>
                  <p className="text-[11px] text-slate-400">Details of the target role</p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Target Role *</label>
                  <input
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer at Stripe"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Experience Level</label>
                  <select
                    value={experienceYears}
                    onChange={e => setExperienceYears(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white cursor-pointer"
                  >
                    <option value="0-1">Fresher / 0–1 years</option>
                    <option value="1-3">Junior / 1–3 years</option>
                    <option value="3-5">Mid-Level / 3–5 years</option>
                    <option value="5+">Senior / 5+ years</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Job Description *</label>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description — required tech, responsibilities, must-haves..."
                    className="w-full h-44 px-3.5 py-3 border border-slate-200 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-400 font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              * All fields required for a complete analysis
            </p>
            <button
              onClick={handleAnalyze}
              disabled={!resumeText.trim() || !targetRole.trim() || !jobDescription.trim()}
              className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <Sparkles size={15} /> Run Analysis <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Analyzing ───────────────────────────────────────────── */}
      {step === 2 && <AnalysisLoader />}

      {/* ── STEP 3: Results Dashboard ────────────────────────────────────── */}
      {step === 3 && results && (
        <div className="space-y-6 fade-in">

          {/* Hero Match Summary */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 shadow-xl border border-white/5 text-white">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">

              {/* Circular Score */}
              <div className="shrink-0">
                <CircularGauge score={results.readiness_score ?? 0} size={150} />
              </div>

              {/* Assessment + stat pills */}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">AI Mentor Assessment</p>
                  <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
                    {results.overall_assessment || 'Analysis complete. See detailed results below.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {results.matched_skills?.length !== undefined && (
                    <StatPill
                      icon={CheckCircle2}
                      label="Skills Matched"
                      value={results.matched_skills.length}
                      color="bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    />
                  )}
                  {results.gaps?.length !== undefined && (
                    <StatPill
                      icon={AlertTriangle}
                      label="Gaps Found"
                      value={results.gaps.length}
                      color="bg-rose-500/10 border-rose-500/20 text-rose-300"
                    />
                  )}
                  {results.suggestions?.length !== undefined && (
                    <StatPill
                      icon={Lightbulb}
                      label="Suggestions"
                      value={results.suggestions.length}
                      color="bg-amber-500/10 border-amber-500/20 text-amber-300"
                    />
                  )}
                </div>
              </div>

              {/* Target role tag */}
              {results.target_role && (
                <div className="shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">Target</p>
                  <p className="text-sm font-bold text-white/90">{results.target_role}</p>
                  <p className="text-[10px] text-white/50 mt-0.5">{experienceYears} yr exp level</p>
                </div>
              )}
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[minmax(0,1fr),320px] gap-6 items-start">

            {/* Left — Skills & Gaps */}
            <div className="space-y-5">

              {/* Matched Skills */}
              {results.matched_skills?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-slate-800">Matching Competencies</h2>
                      <p className="text-[11px] text-slate-400">Skills you already have for this role</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                      {results.matched_skills.length} matched
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.matched_skills.map((skill, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Critical Skill Gaps */}
              {results.gaps?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center">
                      <Target size={14} className="text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-slate-800">Skill Gaps to Address</h2>
                      <p className="text-[11px] text-slate-400">Ranked by priority — click any to see how to close it</p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                      {results.gaps.length} gaps
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {results.gaps.map((gap, i) => (
                      <GapCard key={i} gap={gap} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Suggestions */}
              {results.suggestions?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                      <Lightbulb size={14} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-slate-800">Actionable Suggestions</h2>
                      <p className="text-[11px] text-slate-400">Personalized recommendations to boost your hiring potential</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                      {results.suggestions.length} suggestions
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {results.suggestions.map((s, i) => (
                      <SuggestionCard key={i} suggestion={s} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">

              {/* Strategic Direction */}
              {results.direction && (
                <div className="bg-slate-900 rounded-2xl p-5 shadow-md space-y-3 border border-white/5">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
                    <Compass size={16} className="text-indigo-400 animate-spin-slow" />
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300">Strategic Direction</h3>
                      <p className="text-[10px] text-white/40">Your personalized advisory</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{results.direction}</p>
                </div>
              )}



              {/* Quick re-analyze */}
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
              >
                <RefreshCw size={13} /> Start New Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
