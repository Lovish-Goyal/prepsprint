'use client';

import { useState } from 'react';
import axios from 'axios';
import { 
  Sparkles,
  Wand2,
  AlertCircle,
  Code,
  Compass,
  ChevronRight,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Roadmap() {
  const [targetRole, setTargetRole] = useState('');
  const [interests, setInterests] = useState('');
  const [targetLevel, setTargetLevel] = useState('Beginner');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creditError, setCreditError] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole.trim() || !interests.trim()) {
      setError("Please specify both your Target Job Role and Tech Stack / Interests.");
      return;
    }
    setLoading(true);
    setError(null);
    setCreditError(null);
    setRoadmap(null);
    try {
      const res = await axios.post(`${API_BASE}/roadmap/`, {
        target_role: targetRole,
        target_level: targetLevel,
        primary_interests: interests
      });
      setRoadmap(res.data);
      if (res.data.warning) {
        setCreditError(res.data.warning);
      }
      setActiveStepIndex(0);
    } catch (err) {
      console.error("Generation failed:", err);
      const isCreditErr = err.response?.status === 402 || 
        (err.response?.data?.detail && (
          err.response.data.detail.toLowerCase().includes("credits") ||
          err.response.data.detail.toLowerCase().includes("tokens") ||
          err.response.data.detail.toLowerCase().includes("max_tokens")
        ));
      if (isCreditErr) {
        setCreditError(err.response?.data?.detail || "Limit Exceeded: Please retry after some time.");
      } else {
        setError(err.response?.data?.detail || "Failed to generate roadmap. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const activePhase = roadmap?.phases?.[activeStepIndex];

  // Helper to split points by colon to bold the headlines
  const renderPointText = (text) => {
    const parts = text.split(':');
    if (parts.length > 1) {
      return (
        <>
          <strong className="text-slate-900 font-semibold">{parts[0]}:</strong>
          <span className="text-slate-600"> {parts.slice(1).join(':')}</span>
        </>
      );
    }
    return <span className="text-slate-600">{text}</span>;
  };

  // Helper to format words inside parentheses as green code tags
  const formatTextWithCode = (text) => {
    if (!text) return '';
    const regex = /\(([^)]+)\)/g;
    const parts = text.split(regex);
    if (parts.length === 1) {
      return text;
    }
    
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        result.push(parts[i]);
      } else {
        const keywords = parts[i].split(',');
        const formattedKeywords = [];
        keywords.forEach((kw, kIdx) => {
          const trimmed = kw.trim();
          formattedKeywords.push(
            <code key={kIdx} className="text-emerald-600 bg-slate-100 px-1 py-0.5 rounded font-mono text-xs font-semibold mx-0.5">
              {trimmed}
            </code>
          );
          if (kIdx < keywords.length - 1) {
            formattedKeywords.push(<span key={`comma-${kIdx}`}>, </span>);
          }
        });
        result.push(
          <span key={`group-${i}`}>
            ({formattedKeywords})
          </span>
        );
      }
    }
    return result;
  };

  return (
    <div className="space-y-6 w-full pb-8 text-slate-800 font-sans">
      
      {/* Minimal Header */}
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 justify-center md:justify-start">
          <Compass size={24} className="text-indigo-600" /> Career Roadmap
        </h1>
        <p className="text-slate-500 text-xs">
          Build a step-by-step learning path to your target job role. Highlight key milestones, skills, and timelines.
        </p>
      </div>

      {/* Simplified, Professional Input Form */}
      <form onSubmit={handleGenerate} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm mb-8">
        <div className="grid md:grid-cols-[1.5fr,1.5fr,1fr] gap-4 items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Target Job Role</span>
            <input 
              type="text" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Backend Engineer"
              className="w-full bg-slate-55 text-slate-800 rounded-lg py-2 px-3 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none text-xs transition-all"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Tech Stack &amp; Interests</span>
            <input 
              type="text" 
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. java, spring"
              className="w-full bg-slate-55 text-slate-800 rounded-lg py-2 px-3 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none text-xs transition-all"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Target Level</span>
            <select 
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              className="w-full bg-slate-55 text-slate-800 rounded-lg py-2 px-3 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none text-xs cursor-pointer transition-all"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 h-[36px] w-full md:w-auto"
          >
            {loading ? <span className="animate-spin text-xs">⚙️</span> : <Wand2 size={12} />}
            <span>{loading ? 'Generating...' : 'Build Roadmap'}</span>
          </button>
        </div>
        {error && (
          <div className="mt-5 p-6 bg-rose-50/50 border border-rose-100 rounded-xl flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Roadmap Generation Failed</h3>
            <p className="text-xs text-slate-550 max-w-sm leading-relaxed mb-4">
              {error.toLowerCase().includes("credits") || error.toLowerCase().includes("tokens") 
                ? "The AI builder is currently experiencing credit limitations or high server loads. Please try again later or recharge your platform credits." 
                : error}
            </p>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition"
            >
              Retry Building Pathway
            </button>
          </div>
        )}
      </form>

      {/* Main Split Layout: Left Index Columns, Right Details Column */}
      {roadmap && roadmap.phases && roadmap.phases.length > 0 && (
        <div className="grid md:grid-cols-[240px,1fr] gap-8 items-start">
          
          {/* LEFT COLUMN: Step Navigator Menu */}
          <div className="md:sticky md:top-6 flex flex-col gap-4">
            {/* Desktop Vertical Menu */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Pathway Navigator
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {roadmap.phases.map((phase, pIdx) => {
                  const isActive = pIdx === activeStepIndex;
                  const cleanedTitle = phase.name.replace(/^(Phase|Month|Step) \d+:\s*/i, '');
                  
                  return (
                    <button
                      key={pIdx}
                      onClick={() => setActiveStepIndex(pIdx)}
                      className={`w-full text-left p-4 transition-all flex items-center justify-between text-xs outline-none
                        ${isActive 
                          ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600 font-bold text-indigo-600' 
                          : 'text-slate-600 hover:bg-slate-50/50 hover:text-slate-800'}`}
                    >
                      <div className="min-w-0">
                        <span className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">
                          Step {pIdx + 1}
                        </span>
                        <span className="truncate block uppercase tracking-wide">
                          {cleanedTitle}
                        </span>
                      </div>
                      {isActive && <ChevronRight size={14} className="text-indigo-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Horizontal Tabs */}
            <div className="md:hidden flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                Pathway Navigator
              </span>
              <div className="flex flex-row overflow-x-auto gap-2 pb-2 scrollbar-none snap-x">
                {roadmap.phases.map((phase, pIdx) => {
                  const isActive = pIdx === activeStepIndex;
                  const cleanedTitle = phase.name.replace(/^(Phase|Month|Step) \d+:\s*/i, '');
                  return (
                    <button
                      key={pIdx}
                      onClick={() => setActiveStepIndex(pIdx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border shrink-0 transition-all snap-start
                        ${isActive 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      Step {pIdx + 1}: {cleanedTitle}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Step Explanation Details */}
          {activePhase && (
            <div className="space-y-6 pt-1 text-slate-800">
              
              {/* Heading Section */}
              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Step {activeStepIndex + 1} of {roadmap.phases.length}  •  {roadmap.target_level} Level  •  {activePhase.duration_hours || '40 hours'}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {activePhase.name.replace(/^(Phase|Month|Step) \d+:\s*/i, '')}
                </h2>
                <p className="text-slate-655 text-sm leading-relaxed pt-1">
                  {activePhase.description}
                </p>
              </div>

              {/* Syllabus section */}
              {activePhase.subtopics && activePhase.subtopics.length > 0 && (
                <div className="space-y-3 pt-1">
                  <h3 className="text-base font-bold text-slate-900">
                    Core Concepts
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 font-medium">
                    {activePhase.subtopics.map((sub, sIdx) => {
                      const parts = sub.split(':');
                      if (parts.length > 1) {
                        return (
                          <li key={sIdx} className="leading-relaxed">
                            <strong className="text-slate-900 font-semibold">{parts[0]}:</strong>
                            <span className="text-slate-650"> {formatTextWithCode(parts.slice(1).join(':').trim())}</span>
                          </li>
                        );
                      }
                      return (
                        <li key={sIdx} className="leading-relaxed">
                          {formatTextWithCode(sub)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Milestone Project */}
              {activePhase.project && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-slate-900">Milestone Project</h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    <h4 className="font-semibold text-slate-850">{activePhase.project.title}</h4>
                    <p className="text-slate-605 leading-relaxed">
                      {formatTextWithCode(activePhase.project.description)}
                    </p>
                    {activePhase.project.deliverables && activePhase.project.deliverables.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1.5 pt-1">
                        {activePhase.project.deliverables.map((item, dIdx) => (
                          <li key={dIdx} className="leading-relaxed">
                            {formatTextWithCode(item)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Tips & Recommendations */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-slate-900">Tips &amp; Best Practices</h3>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                  {activePhase.importance && (
                    <li className="leading-relaxed">
                      {formatTextWithCode(activePhase.importance.replace(/^Prerequisites:\s*/i, '').replace(/^Why:\s*/i, ''))}
                    </li>
                  )}
                  {activePhase.best_practices && activePhase.best_practices.map((bp, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {formatTextWithCode(bp.replace(/^(Do|Best Practice|Start Small):\s*/i, ''))}
                    </li>
                  ))}
                  {activePhase.common_mistakes && activePhase.common_mistakes.map((cm, cIdx) => (
                    <li key={cIdx} className="leading-relaxed">
                      {formatTextWithCode(cm.replace(/^(Avoid|Common Pitfall|Common Pitfalls to Avoid|Skipping Fundamentals):\s*/i, ''))}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hands-on Exercise & Next Steps */}
              {(activePhase.practice_tasks || activePhase.next_topic) && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-slate-900">Suggested Action &amp; Next Step</h3>
                  <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                    {activePhase.practice_tasks && activePhase.practice_tasks.map((task, tIdx) => (
                      <li key={tIdx} className="leading-relaxed">
                        {formatTextWithCode(task.replace(/^Practice:\s*/i, ''))}
                      </li>
                    ))}
                    {activePhase.next_topic && (
                      <li className="leading-relaxed">
                        Next Up: {formatTextWithCode(activePhase.next_topic.replace(/^Next Up:\s*/i, ''))}
                      </li>
                    )}
                  </ul>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* No roadmap placeholder */}
      {!roadmap && !loading && !error && (
        <div className="py-16 text-center space-y-4 bg-slate-50 border border-slate-200/60 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
            <Sparkles size={20} className="text-indigo-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Awaiting Inputs</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-[11px] leading-relaxed">
              Enter your target job details and click "Build Roadmap" to view the interactive path dashboard.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
