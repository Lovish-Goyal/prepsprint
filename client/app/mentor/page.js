'use client';

import { useState, useEffect } from 'react';
import ChatComponent from '@/components/ChatComponent';
import { Sparkles, MessageSquare, Terminal, ShieldCheck } from 'lucide-react';
import { aiMentorAPI } from '@/lib/api';

export default function MentorPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      const res = await aiMentorAPI.getSessions();
      setSessions(res.data);
      if (res.data.length > 0) {
        setActiveSessionId(res.data[0]._id || res.data[0].id);
      } else {
        await handleNewChat();
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
      // Create a default local session if API fails
      const fallbackSession = {
        id: 'local-default',
        title: 'New Chat Session',
        messages: [
          {
            id: 1,
            text: "Hi! I'm your AI Career Mentor. I can help you with career guidance, resume tips, or any skill-related questions. What would you like to know?",
            sender: 'bot',
            timestamp: new Date().toISOString()
          }
        ]
      };
      setSessions([fallbackSession]);
      setActiveSessionId('local-default');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleNewChat = async () => {
    try {
      const res = await aiMentorAPI.createSession();
      const newSess = res.data;
      setSessions(prev => [newSess, ...prev]);
      setActiveSessionId(newSess._id || newSess.id);
    } catch (err) {
      console.error("Failed to create new session:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
          <Sparkles size={16} /> Technical Advisory
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">AI Mentor</h1>
        <p className="text-slate-500 text-lg max-w-3xl">
          High-level architectural consulting and career strategy powered by specialized language models.
        </p>
      </section>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-10 lg:h-[600px]">
        {/* Chat Main */}
        <div className="flex flex-col toolkit-card bg-white overflow-hidden h-[500px] lg:h-full lg:col-span-3">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Terminal size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Pathfinder-V4 Protocol</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Consultant Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-indigo-500" />
              Secure Session
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <ChatComponent 
                activeSessionId={activeSessionId}
                sessions={sessions}
                setSessions={setSessions}
              />
            )}
          </div>
        </div>

        {/* Sidebar / Presets */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">History Chats</h3>
              <button 
                onClick={handleNewChat}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded transition outline-none"
              >
                + New Chat
              </button>
            </div>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {sessions.map((sess) => {
                const isAct = (sess._id || sess.id) === activeSessionId;
                return (
                  <button 
                    key={sess._id || sess.id} 
                    onClick={() => setActiveSessionId(sess._id || sess.id)}
                    className={`w-full p-3.5 text-left rounded-xl transition-all border outline-none text-xs flex items-center gap-2.5
                      ${isAct 
                        ? 'bg-indigo-50/40 border-indigo-200/80 text-indigo-700 font-bold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <MessageSquare size={14} className={isAct ? 'text-indigo-600' : 'text-slate-400'} />
                    <span className="truncate flex-1">{sess.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="toolkit-card p-6 bg-slate-50 border-dashed border-slate-300">
            <div className="flex items-center gap-2 text-indigo-600 mb-3">
              <MessageSquare size={16} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Context Awareness</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pathfinder has access to your Resume profile and roadmap for context-aware assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
