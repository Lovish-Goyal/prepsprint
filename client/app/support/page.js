import Link from 'next/link';
import { Search, Book, User, Settings, CreditCard, LifeBuoy, FileText, ArrowRight, Mail, Headphones } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="w-full overflow-hidden">

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative px-6 py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div className="glow-blob w-[600px] h-[600px] bg-blue-600 top-0 right-0 opacity-20" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-400">Support Center</p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
            How can we help you?
          </h1>
          <p className="mt-6 text-lg text-blue-200">
            Search our knowledge base or browse by category to find the answers you need.
          </p>

          {/* Search bar */}
          <div className="mt-10 relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for articles, tutorials, or topics..."
              className="w-full rounded-2xl bg-white/10 border border-white/20 px-12 py-4 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white/15 transition-all text-base backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Category Grid ────────────────────────────── */}
      <section className="px-6 py-20 -mt-8 relative z-20">
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CategoryCard icon={<User size={24} />} color="blue" title="Account Management" description="Login issues, profile updates, password resets, and email preferences." />
          <CategoryCard icon={<Book size={24} />} color="emerald" title="Learning Roadmaps" description="How to generate, customize, and track your personalized career plans." />
          <CategoryCard icon={<Settings size={24} />} color="violet" title="Technical Issues" description="Troubleshooting integration problems, bugs, and platform errors." />
          <CategoryCard icon={<CreditCard size={24} />} color="amber" title="Billing & Plans" description="Managing your subscription, invoices, upgrades, and payment methods." />
          <CategoryCard icon={<FileText size={24} />} color="rose" title="Resume & Interview" description="Using the AI resume builder and mock interview preparation tools." />
          <CategoryCard icon={<LifeBuoy size={24} />} color="teal" title="Getting Started" description="Onboarding guides, best practices, and first-steps walkthroughs." />
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Popular Articles ──────────────────────────── */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-10">Popular Articles</h2>
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <ArticleRow title="How to reset your password if you lost access to your email" category="Account" />
            <ArticleRow title="Understanding the AI Mentor feedback on your code and projects" category="Roadmaps" />
            <ArticleRow title="Upgrading from the free tier to a Pro subscription" category="Billing" />
            <ArticleRow title="Connecting your GitHub account for automated skill tracking" category="Technical" />
            <ArticleRow title="How to prepare for your first AI mock interview session" category="Interview" />
            <ArticleRow title="Customizing your career roadmap after initial generation" category="Roadmaps" />
            <ArticleRow title="Exporting your resume in PDF and DOCX formats" category="Resume" last />
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Contact Support CTA ───────────────────────── */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
          <div className="card-hover rounded-3xl border border-slate-200 bg-white p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Mail size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Email Support</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-500">
                Send us a detailed message and our support team will respond within one business day with a clear resolution.
              </p>
            </div>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:gap-3">
              Contact us <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card-hover rounded-3xl border border-slate-200 bg-white p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Headphones size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Priority Support</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-500">
                Pro users get priority escalation with faster response times and dedicated assistance for critical issues.
              </p>
            </div>
            <Link href="/auth/signup" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:gap-3">
              Upgrade to Pro <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

const categoryColors = {
  blue:    { icon: 'bg-blue-50 text-blue-600',     border: 'border-blue-100' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  violet:  { icon: 'bg-violet-50 text-violet-600',   border: 'border-violet-100' },
  amber:   { icon: 'bg-amber-50 text-amber-600',     border: 'border-amber-100' },
  rose:    { icon: 'bg-rose-50 text-rose-600',       border: 'border-rose-100' },
  teal:    { icon: 'bg-teal-50 text-teal-600',       border: 'border-teal-100' },
};

function CategoryCard({ icon, color, title, description }) {
  const c = categoryColors[color] || categoryColors.blue;
  return (
    <div className={`card-hover cursor-pointer rounded-3xl border ${c.border} bg-white p-8 group`}>
      <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${c.icon} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function ArticleRow({ title, category, last = false }) {
  return (
    <div className={`group flex items-center justify-between p-6 transition-colors hover:bg-slate-50 cursor-pointer ${!last ? 'border-b border-slate-100' : ''}`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">{category}</p>
        <h4 className="text-base font-medium text-slate-800 transition-colors group-hover:text-blue-700">{title}</h4>
      </div>
      <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-4" size={18} />
    </div>
  );
}
