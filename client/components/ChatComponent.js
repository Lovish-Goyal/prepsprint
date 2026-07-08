'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader, GraduationCap, User, Sparkles, Copy, Check } from 'lucide-react';
import { aiMentorAPI } from '@/lib/api';

export default function ChatComponent({ activeSessionId, sessions, setSessions }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  // Retrieve active session from parent state
  const activeSession = sessions.find(s => (s._id || s.id) === activeSessionId) || { messages: [] };
  const messages = activeSession.messages || [];

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend = input) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText || !activeSessionId) return;

    // Build optimism messages (append user message instantly before API returns)
    const userMessage = {
      id: messages.length + 1,
      text: trimmedText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setSessions(prev => prev.map(s => {
      const sId = s._id || s.id;
      if (sId === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMessage]
        };
      }
      return s;
    }));

    setInput('');
    setLoading(true);

    // If local/offline default session, handle mock fallback response
    if (activeSessionId === 'local-default') {
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: "Based on your technical aspirations, I recommend focusing on decoupling architectures. To build high-impact platforms, you should prioritize mastering system distribution and cloud deployment strategies.",
          sender: 'bot',
          suggestions: ["Explain System Distribution", "Recommend cloud platforms", "Share architectural resources"],
          timestamp: new Date().toISOString()
        };
        setSessions(prev => prev.map(s => {
          if ((s._id || s.id) === 'local-default') {
            return {
              ...s,
              messages: [...s.messages, botMessage]
            };
          }
          return s;
        }));
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const response = await aiMentorAPI.sendSessionMessage(activeSessionId, {
        question: trimmedText
      });

      const { response: botResponseText, suggestions, messages: updatedMsgs } = response.data;

      setSessions(prev => prev.map(s => {
        const sId = s._id || s.id;
        if (sId === activeSessionId) {
          // If title is default session format, change it to first question preview
          let title = s.title;
          if (title.startsWith("Session - ") && s.messages.length <= 2) {
            title = trimmedText.slice(0, 30) + (trimmedText.length > 30 ? "..." : "");
          }
          return {
            ...s,
            title,
            messages: updatedMsgs
          };
        }
        return s;
      }));
    } catch (error) {
      console.error("AI chat failed:", error);
      const errorMsg = error.response?.data?.detail || error.message || "Failed to generate response. Please try again.";
      const botMessage = {
        id: messages.length + 2,
        text: `Error: ${errorMsg}`,
        sender: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      };
      setSessions(prev => prev.map(s => {
        const sId = s._id || s.id;
        if (sId === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, botMessage]
          };
        }
        return s;
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const parseBoldItalic = (text, partIndex) => {
    const boldRegex = /\*\*([\s\S]*?)\*\*/g;
    const boldParts = text.split(boldRegex);
    
    return boldParts.map((boldPart, bIdx) => {
      const italicRegex = /\*([\s\S]*?)\*/g;
      const italicParts = boldPart.split(italicRegex);
      
      const content = italicParts.map((italicPart, iIdx) => {
        if (iIdx % 2 === 1) {
          return <em key={`italic-${partIndex}-${bIdx}-${iIdx}`} className="italic text-slate-800">{italicPart}</em>;
        }
        return italicPart;
      });

      if (bIdx % 2 === 1) {
        return <strong key={`bold-${partIndex}-${bIdx}`} className="font-semibold text-slate-900">{content}</strong>;
      }
      
      return content;
    });
  };

  const parseInlineFormatting = (text) => {
    if (!text) return '';
    const codeRegex = /`([^`]+)`/g;
    const parts = text.split(codeRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <code key={`inline-code-${index}`} className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-[12.5px] border border-slate-200/60 mx-0.5">
            {part}
          </code>
        );
      }
      return parseBoldItalic(part, index);
    });
  };

  const renderTextBlock = (text, blockIndex) => {
    const lines = text.split('\n');
    const elements = [];
    
    let currentList = [];
    let listType = null; // 'bullet' or 'numbered'
    
    const commitList = (key) => {
      if (currentList.length > 0) {
        if (listType === 'bullet') {
          elements.push(
            <ul key={key} className="list-disc pl-6 my-2.5 space-y-1.5 text-slate-700">
              {currentList.map((item, idx) => (
                <li key={idx} className="leading-relaxed text-sm">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        } else if (listType === 'numbered') {
          elements.push(
            <ol key={key} className="list-decimal pl-6 my-2.5 space-y-1.5 text-slate-700">
              {currentList.map((item, idx) => (
                <li key={idx} className="leading-relaxed text-sm">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        commitList(`list-before-h-${blockIndex}-${i}`);
        const level = headingMatch[1].length;
        const headingText = headingMatch[2];
        
        const headingClass = 
          level === 1 ? "text-xl font-extrabold text-slate-900 mt-5 mb-2.5 flex items-center gap-1.5" :
          level === 2 ? "text-lg font-bold text-slate-900 mt-4 mb-2 flex items-center gap-1.5" :
          level === 3 ? "text-base font-bold text-slate-800 mt-3 mb-1.5 flex items-center gap-1.5" :
          "text-sm font-semibold text-slate-800 mt-2.5 mb-1 flex items-center gap-1.5";
          
        const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
        elements.push(
          <Tag key={`h-${blockIndex}-${i}`} className={headingClass}>
            {parseInlineFormatting(headingText)}
          </Tag>
        );
        continue;
      }
      
      const blockquoteMatch = line.match(/^>\s+(.*)/);
      if (blockquoteMatch) {
        commitList(`list-before-bq-${blockIndex}-${i}`);
        elements.push(
          <blockquote key={`bq-${blockIndex}-${i}`} className="border-l-4 border-indigo-500 bg-indigo-50/50 pl-4 py-2.5 my-3 text-slate-700 italic text-sm rounded-r-lg">
            {parseInlineFormatting(blockquoteMatch[1])}
          </blockquote>
        );
        continue;
      }
      
      const bulletMatch = line.match(/^\s*[-*•]\s+(.*)/);
      if (bulletMatch) {
        if (listType !== 'bullet') {
          commitList(`list-change-${blockIndex}-${i}`);
          listType = 'bullet';
        }
        currentList.push(bulletMatch[1]);
        continue;
      }
      
      const numberedMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        if (listType !== 'numbered') {
          commitList(`list-change-${blockIndex}-${i}`);
          listType = 'numbered';
        }
        currentList.push(numberedMatch[2]);
        continue;
      }
      
      if (trimmed === '') {
        commitList(`list-empty-${blockIndex}-${i}`);
        continue;
      }
      
      commitList(`list-before-p-${blockIndex}-${i}`);
      elements.push(
        <p key={`p-${blockIndex}-${i}`} className="mb-2.5 leading-relaxed text-sm text-slate-700">
          {parseInlineFormatting(line)}
        </p>
      );
    }
    
    commitList(`list-final-${blockIndex}`);
    
    return elements;
  };

  const renderMarkdown = (text) => {
    if (!text) return '';
    const parts = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const textBefore = text.slice(lastIndex, match.index);
      if (textBefore) {
        parts.push({ type: 'text', content: textBefore });
      }
      
      parts.push({
        type: 'code',
        language: match[1] || 'code',
        code: match[2].trim()
      });
      
      lastIndex = codeBlockRegex.lastIndex;
    }
    
    const textAfter = text.slice(lastIndex);
    if (textAfter) {
      parts.push({ type: 'text', content: textAfter });
    }
    
    return parts.map((part, index) => {
      if (part.type === 'code') {
        return (
          <CodeBlock
            key={`code-block-${index}`}
            language={part.language}
            code={part.code}
          />
        );
      }
      return renderTextBlock(part.content, index);
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/10 rounded-lg overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          const time = message.timestamp ? new Date(message.timestamp) : new Date();
          
          return (
            <div
              key={message.id || message.timestamp}
              className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'} fade-in`}
            >
              {!isUser && (
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <GraduationCap size={18} className="stroke-[2.2]" />
                </div>
              )}

              <div
                className={`${
                  isUser
                    ? 'max-w-[80%] md:max-w-[70%] px-5 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm'
                    : message.isError
                    ? 'max-w-[85%] md:max-w-[80%] px-6 py-5 rounded-2xl rounded-tl-sm bg-rose-50/80 border border-rose-100 text-rose-800 shadow-sm'
                    : 'flex-1 max-w-[85%] md:max-w-[80%] px-6 py-5 rounded-2xl rounded-tl-sm bg-white border border-slate-200/80 shadow-sm text-slate-800'
                }`}
              >
                {!isUser && !message.isError && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-2 select-none">
                    <Sparkles size={12} className="text-indigo-500 fill-indigo-100" />
                    AI Career Mentor
                  </div>
                )}

                <div className="text-sm leading-relaxed">
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  ) : (
                    renderMarkdown(message.text)
                  )}
                </div>

                {/* AI Follow-up suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 select-none">Suggested follow-ups</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(suggestion)}
                          className="text-xs bg-indigo-50/50 hover:bg-indigo-100/80 text-indigo-700 hover:text-indigo-800 border border-indigo-100/50 hover:border-indigo-200 px-3 py-1.5 rounded-full transition-all outline-none font-medium shadow-sm active:scale-95"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className={`text-[10px] mt-3 opacity-60 text-right select-none ${isUser ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {isUser && (
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User size={18} className="stroke-[2.2]" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-start justify-start fade-in">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <GraduationCap size={18} className="stroke-[2.2]" />
            </div>
            <div className="bg-white border border-slate-200/80 text-slate-800 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <span className="flex space-x-1.5 items-center py-1">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEnd} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4 bg-slate-50/50">
        <div className="flex gap-2 items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your career, skills, or resume..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm bg-white"
            rows="2"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg font-mono text-sm max-w-full">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800/80 select-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors focus:outline-none"
        >
          {copied ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check size={13} strokeWidth={2.5} />
              Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy size={13} strokeWidth={2} />
              Copy
            </span>
          )}
        </button>
      </div>
      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-slate-200 text-xs sm:text-sm leading-relaxed max-w-full">
        <pre className="whitespace-pre"><code>{code}</code></pre>
      </div>
    </div>
  );
}
