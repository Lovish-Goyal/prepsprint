'use client';

import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { TECHS, CATEGORIES } from './data';

const formatSalaryToINR = (usdStr) => {
  if (!usdStr) return '';
  return usdStr.replace(/\$?(\d+)[kK]/g, (match, p1) => {
    const usdK = parseInt(p1, 10);
    const inrLakh = Math.round(usdK * 0.83);
    return `₹${inrLakh}L`;
  });
};

// ── Per-category color system ─────────────────────────────────────────────────
const CAT_STYLE = {
  'All':               { pill: 'bg-slate-900 text-white border-slate-900',         bar: 'bg-slate-500',   badge: 'bg-slate-100 text-slate-700 border-slate-200',    icon: 'LayoutGrid' },
  'AI / ML':           { pill: 'bg-violet-600 text-white border-violet-600',        bar: 'bg-violet-500',  badge: 'bg-violet-50 text-violet-700 border-violet-200',  icon: 'Brain'      },
  'Web Development':   { pill: 'bg-blue-600 text-white border-blue-600',            bar: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-200',        icon: 'Globe'      },
  'DevOps & Cloud':    { pill: 'bg-sky-600 text-white border-sky-600',              bar: 'bg-sky-500',     badge: 'bg-sky-50 text-sky-700 border-sky-200',           icon: 'Cloud'      },
  'Mobile':            { pill: 'bg-emerald-600 text-white border-emerald-600',      bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',icon: 'Smartphone' },
  'Security':          { pill: 'bg-rose-600 text-white border-rose-600',            bar: 'bg-rose-500',    badge: 'bg-rose-50 text-rose-700 border-rose-200',        icon: 'Shield'     },
  'Web3 & Blockchain': { pill: 'bg-amber-500 text-white border-amber-500',          bar: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200',     icon: 'Link'       },
  'Emerging':          { pill: 'bg-orange-500 text-white border-orange-500',        bar: 'bg-orange-400',  badge: 'bg-orange-50 text-orange-700 border-orange-200',  icon: 'Cpu'        },
};

const INACTIVE_PILL = 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700';

function DynIcon({ name, size = 16, className = '' }) {
  const Ic = Icons[name] || Icons.Code;
  return <Ic size={size} className={className} />;
}

function getCatStyle(cat) {
  return CAT_STYLE[cat] || CAT_STYLE['All'];
}

function DemandBar({ demand, category }) {
  const style = getCatStyle(category);
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden md:block">
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${demand}%` }} />
      </div>
      <span className="text-xs font-extrabold text-slate-800 tabular-nums">{demand}</span>
    </div>
  );
}

function Section({ icon, title, children }) {
  const Ic = Icons[icon] || Icons.Info;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Ic size={14} className="text-slate-400" />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function Technologies() {
  const [filter, setFilter]               = useState('All');
  const [searchTerm, setSearchTerm]       = useState('');
  const [sortBy, setSortBy]               = useState('demand');
  const [onlyTrending, setOnlyTrending]   = useState(false);
  const [onlyHighPaying, setOnlyHighPaying] = useState(false);
  const [selectedTech, setSelectedTech]   = useState(null);

  const spotlight = TECHS.reduce((m, t) => (t.demand > m.demand ? t : m), TECHS[0]);
  const spotlightStyle = getCatStyle(spotlight.category);

  let list = TECHS.filter(t => {
    const s = searchTerm.toLowerCase();
    return (
      (filter === 'All' || t.category === filter) &&
      (!s || t.name.toLowerCase().includes(s) || t.desc.toLowerCase().includes(s)) &&
      (!onlyTrending || t.trending) &&
      (!onlyHighPaying || t.salaryValue >= 170000)
    );
  });

  if (sortBy === 'demand') list = [...list].sort((a, b) => b.demand - a.demand);
  if (sortBy === 'salary') list = [...list].sort((a, b) => b.salaryValue - a.salaryValue);
  if (sortBy === 'growth') list = [...list].sort((a, b) => b.growthValue - a.growthValue);
  if (sortBy === 'alpha')  list = [...list].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    document.body.style.overflow = selectedTech ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedTech]);

  const handleRelatedClick = (id) => {
    const found = TECHS.find(t => t.id === id);
    if (found) setSelectedTech(found);
  };

  return (
    <div className="pb-16 space-y-6">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[11px] uppercase tracking-widest mb-2">
            <Icons.Layers size={13} /> Tech Directory
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discover Technologies</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-lg">
            Market demands, salary data, YoY growth, and learning guides for leading software technologies.
          </p>
        </div>
        <div className="relative w-full sm:w-72 shrink-0">
          <Icons.Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search technologies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-400 shadow-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <Icons.X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── SPOTLIGHT ───────────────────────────────────────────────────────── */}
      {!searchTerm && filter === 'All' && !onlyTrending && !onlyHighPaying && (
        <div
          onClick={() => setSelectedTech(spotlight)}
          className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden"
        >
          <div className={`absolute top-0 left-0 right-0 h-1 ${spotlightStyle.bar}`} />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mt-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <DynIcon name={spotlight.iconName} size={24} className="text-slate-700" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                    <Icons.Star size={9} className="fill-current" /> Highest Demand This Year
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-100 text-amber-700 border border-amber-200 uppercase">Hot</span>
                  {spotlight.trending && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase">↑ Trending</span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{spotlight.name}</h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-1 max-w-xl">{spotlight.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 lg:gap-10 shrink-0">
              {[
                { label: 'Demand',     val: spotlight.demand,                      green: false },
                { label: 'YoY Growth', val: spotlight.growth,                      green: true  },
                { label: 'Avg Salary', val: `${formatSalaryToINR(spotlight.salary?.split('-')[0])}+`,  green: false },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                  <p className={`text-xl font-black leading-none ${m.green ? 'text-emerald-600' : 'text-slate-900'}`}>{m.val}</p>
                </div>
              ))}
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                <Icons.ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FILTER BAR ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Row 1: Category tabs (scrollable) */}
        <div className="px-4 pt-3.5 pb-3 border-b border-slate-100 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {CATEGORIES.map(cat => {
              const isActive = filter === cat;
              const style    = getCatStyle(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                    isActive ? style.pill : INACTIVE_PILL
                  }`}
                >
                  <DynIcon name={style.icon} size={11} />
                  {cat}
                  {cat !== 'All' && (
                    <span className={`text-[9px] font-black px-1 py-0.5 rounded ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                      {TECHS.filter(t => t.category === cat).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Row 2: Sort + toggles */}
        <div className="px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Icons.ArrowUpDown size={11} /> Sort
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            <option value="demand">Market Demand</option>
            <option value="salary">Top Salary</option>
            <option value="growth">YoY Growth</option>
            <option value="alpha">Alphabetical</option>
          </select>
          <div className="w-px h-4 bg-slate-200" />
          <button
            onClick={() => setOnlyTrending(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              onlyTrending ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            <Icons.Flame size={12} className={onlyTrending ? 'fill-current text-amber-500' : ''} />
            Trending
          </button>
          <button
            onClick={() => setOnlyHighPaying(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              onlyHighPaying ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            <Icons.DollarSign size={12} />
            High Paying
          </button>
          <span className="ml-auto text-[11px] text-slate-400 font-medium tabular-nums">
            {list.length} / {TECHS.length}
          </span>
        </div>
      </div>

      {/* ── TABLE ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table head */}
        <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center px-5 py-2.5 border-b border-slate-100 bg-slate-50 gap-4">
          <span className="w-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">#</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Technology</span>
          <span className="w-28 text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</span>
          <span className="w-28 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Demand</span>
          <span className="w-28 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Salary</span>
          <span className="w-16 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Growth</span>
        </div>

        {list.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {list.map((tech, idx) => {
              const catStyle = getCatStyle(tech.category);
              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTech(tech)}
                  className="group flex md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="w-6 text-[11px] font-black text-slate-300 text-center shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <DynIcon name={tech.iconName} size={17} className="text-slate-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-black text-slate-900 leading-snug">{tech.name}</span>
                        {tech.trending && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-100 text-amber-600 border border-amber-200 uppercase">Hot</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xs md:max-w-sm">{tech.desc}</p>
                    </div>
                  </div>
                  <div className="w-28 hidden md:block">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${catStyle.badge}`}>
                      {tech.category.split(' ')[0]}
                    </span>
                  </div>
                  <div className="w-28 hidden md:flex justify-center">
                    <DemandBar demand={tech.demand} category={tech.category} />
                  </div>
                  <div className="w-28 hidden md:flex justify-center">
                    <span className="text-xs font-bold text-slate-700 tabular-nums">{formatSalaryToINR(tech.salary)}</span>
                  </div>
                  <div className="w-16 flex items-center justify-end gap-1.5">
                    <span className="text-xs font-black text-emerald-600 tabular-nums">{tech.growth}</span>
                    <Icons.ArrowUpRight size={13} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <Icons.SearchX size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-600">No technologies found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search term.</p>
            <button
              onClick={() => { setFilter('All'); setSearchTerm(''); setOnlyTrending(false); setOnlyHighPaying(false); }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-all"
            >
              <Icons.RefreshCw size={12} /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ── FULL-SCREEN DETAIL DRAWER ────────────────────────────────────────── */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex" style={{ animation: 'fadeInBg 0.2s ease' }}>

          {/* Dim backdrop */}
          <div
            className="flex-1 bg-slate-900/50 backdrop-blur-[2px] cursor-pointer"
            onClick={() => setSelectedTech(null)}
          />

          {/* Drawer: full viewport height, slides from right */}
          <div
            className="w-full max-w-2xl bg-white flex flex-col shadow-2xl border-l border-slate-200"
            style={{ animation: 'slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)' }}
            onClick={e => e.stopPropagation()}
          >

            {/* ── Sticky header ─────────────────────────────────────────────── */}
            <div className="shrink-0 border-b border-slate-200 bg-white">
              {/* Category colour bar */}
              <div className={`h-1 w-full ${getCatStyle(selectedTech.category).bar}`} />

              {/* Title row */}
              <div className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 ${getCatStyle(selectedTech.category).badge}`}>
                    <DynIcon name={selectedTech.iconName} size={28} className="opacity-80" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedTech.name}</h2>
                      {selectedTech.trending && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-700 border border-amber-300 uppercase">🔥 Hot</span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getCatStyle(selectedTech.category).badge}`}>
                        {selectedTech.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1 max-w-lg">{selectedTech.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTech(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
                >
                  <Icons.X size={17} />
                </button>
              </div>

              {/* 4-metric strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-100">
                {[
                  { label: 'Avg Salary',   val: formatSalaryToINR(selectedTech.salary),       color: 'text-slate-900'   },
                  { label: 'YoY Growth',   val: selectedTech.growth,       color: 'text-emerald-600' },
                  { label: 'Job Listings', val: selectedTech.jobListings,  color: 'text-slate-900'   },
                  { label: 'Difficulty',   val: selectedTech.level,        color: 'text-indigo-700'  },
                ].map((m, idx) => (
                  <div
                    key={m.label}
                    className={`px-4 py-3 text-center border-slate-100 ${
                      idx === 1 ? 'border-l' :
                      idx === 2 ? 'border-t sm:border-t-0 sm:border-l' :
                      idx === 3 ? 'border-l border-t sm:border-t-0' : ''
                    }`}
                  >
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                    <p className={`text-sm font-black leading-none ${m.color}`}>{m.val}</p>
                  </div>
                ))}
              </div>

              {/* Demand bar */}
              <div className="px-6 py-3 border-t border-slate-100">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1"><Icons.BarChart3 size={10} /> Market Demand Score</span>
                  <span className="font-black text-slate-800">{selectedTech.demand} / 100</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getCatStyle(selectedTech.category).bar} transition-all duration-700`}
                    style={{ width: `${selectedTech.demand}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ── Scrollable content ─────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-8">

                {/* Overview + Importance */}
                <Section icon="BookOpen" title="Overview">
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedTech.overview}</p>
                  {selectedTech.importance && (
                    <p className="text-sm text-slate-700 font-medium leading-relaxed mt-3 pl-4 border-l-2 border-indigo-300 italic">
                      {selectedTech.importance}
                    </p>
                  )}
                </Section>

                {/* Why it's trending */}
                {selectedTech.whyHot && (
                  <div className="flex gap-4 bg-sky-50 border border-sky-200 rounded-2xl p-5">
                    <div className="w-9 h-9 rounded-xl bg-sky-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Icons.Zap size={17} className="text-sky-700 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-sky-800 uppercase tracking-widest mb-2">Why It's Trending Right Now</p>
                      <p className="text-sm text-sky-900/80 leading-relaxed">{selectedTech.whyHot}</p>
                    </div>
                  </div>
                )}

                {/* Market insight */}
                {selectedTech.insight && (
                  <div className="flex gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="w-9 h-9 rounded-xl bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Icons.TrendingUp size={17} className="text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-2">Market Insight</p>
                      <p className="text-sm text-amber-900/80 leading-relaxed">{selectedTech.insight}</p>
                    </div>
                  </div>
                )}

                {/* Use Cases */}
                {selectedTech.useCases?.length > 0 && (
                  <Section icon="Target" title="Common Use Cases">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTech.useCases.map((uc, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3.5 border rounded-xl ${getCatStyle(selectedTech.category).badge}`}>
                          <Icons.ChevronRight size={14} className="opacity-60 shrink-0 mt-0.5" />
                          <p className="text-xs font-medium leading-snug">{uc}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Key Concepts */}
                {selectedTech.keyConcepts?.length > 0 && (
                  <Section icon="Layers" title="Key Concepts to Learn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedTech.keyConcepts.map((c, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                            <Icons.Check size={11} className="text-emerald-600 stroke-[3]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 leading-snug">{c}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Who + Prerequisites */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedTech.whoShouldLearn && (
                    <Section icon="Users" title="Who Should Learn">
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        {selectedTech.whoShouldLearn}
                      </p>
                    </Section>
                  )}
                  {selectedTech.prerequisites?.length > 0 && (
                    <Section icon="GitBranch" title="Prerequisites">
                      <div className="space-y-2">
                        {selectedTech.prerequisites.map((p, i) => (
                          <div key={i} className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <Icons.ArrowRight size={13} className="text-indigo-400 shrink-0" />
                            <span className="text-xs font-medium text-slate-700">{p}</span>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}
                </div>

                {/* Learning Resources */}
                {selectedTech.learningResources?.length > 0 && (
                  <Section icon="BookMarked" title="Learning Resources">
                    <div className="space-y-2.5">
                      {selectedTech.learningResources.map((r, i) => (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Icons.ExternalLink size={14} className="text-indigo-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">{r.name}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{r.url}</p>
                          </div>
                          <Icons.ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Official Links */}
                <Section icon="Link2" title="Official Links">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Documentation',    url: selectedTech.docsUrl,    icon: 'FileText', desc: 'Official docs & reference'  },
                      { label: 'Official Website',  url: selectedTech.url,        icon: 'Globe',    desc: 'Homepage & announcements'   },
                      { label: 'GitHub Repository', url: selectedTech.github,     icon: 'Github',   desc: 'Source code & issues'       },
                      { label: 'Roadmap Guide',     url: selectedTech.roadmapUrl, icon: 'Compass',  desc: 'Curated learning roadmap'   },
                    ].filter(l => l.url).map(l => {
                      const Ic = Icons[l.icon] || Icons.ExternalLink;
                      return (
                        <a
                          key={l.label}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <Ic size={15} className="text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{l.label}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{l.desc}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </Section>

                {/* Related Technologies */}
                {selectedTech.related?.length > 0 && (
                  <Section icon="Share2" title="Related Technologies">
                    <div className="flex flex-wrap gap-2">
                      {selectedTech.related.map(id => {
                        const rel = TECHS.find(t => t.id === id);
                        if (!rel) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => handleRelatedClick(id)}
                            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 rounded-xl text-xs font-bold text-slate-600 transition-all"
                          >
                            <DynIcon name={rel.iconName} size={13} className="text-slate-400" />
                            {rel.name}
                          </button>
                        );
                      })}
                    </div>
                  </Section>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInBg  { from { opacity: 0 }             to { opacity: 1 }          }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>

    </div>
  );
}
