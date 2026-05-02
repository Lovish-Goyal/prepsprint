import Link from 'next/link';
import { Target, Users, Zap, Shield, ArrowRight, Heart, Lightbulb, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full overflow-hidden">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative px-6 py-10 md:py-14">
        <div className="glow-blob w-[500px] h-[500px] bg-blue-400 -top-40 right-0 opacity-15" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">About PrepSprint</p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl leading-tight">
            A professional growth platform built for modern careers.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-slate-500 md:text-xl">
            We help students and developers transition into tech careers with clarity, structure, and guidance — so no one has to navigate the journey alone.
          </p>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Our Story ────────────────────────────────── */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">Our Story</p>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl leading-tight">
              Born from frustration. Built with purpose.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-500">
              <p>
                PrepSprint started because we watched too many talented people waste months — sometimes years — jumping between random tutorials, unsure of what to learn next. The tech landscape is overwhelming, and there was no single place that combined roadmap clarity with practical execution tools.
              </p>
              <p>
                We are a team of engineers, designers, and career strategists who believe that career growth should not require expensive bootcamps or knowing the right people. We built PrepSprint to give every developer a structured, actionable plan backed by AI tools and human mentorship.
              </p>
              <p>
                Today, over 12,000 developers use PrepSprint to plan their careers, build resumes, track skills, and prepare for interviews — all in one focused workspace.
              </p>
            </div>
          </div>

          {/* Visual card stack */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-slate-50 p-8 md:p-10">
              <div className="space-y-6">
                <MilestoneItem year="2023" text="Idea born from watching peers struggle with career direction." />
                <MilestoneItem year="2024" text="MVP launched. First 500 users onboarded within 3 months." />
                <MilestoneItem year="2025" text="AI Resume Builder and Mentor Support modules launched." />
                <MilestoneItem year="2026" text="12,000+ active users. Growing across 15+ countries." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Core Values ──────────────────────────────── */}
      <section className="relative px-6 py-10 md:py-14">
        <div className="glow-blob w-[400px] h-[400px] bg-violet-400 bottom-0 left-0 opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">Core Values</p>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              The principles that guide everything we build
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ValueCard icon={<Target size={24} />} title="Clarity Over Volume" text="We curate the best path instead of overwhelming you with endless options and random resources." />
            <ValueCard icon={<Zap size={24} />} title="Action-Oriented" text="Theory is good, but execution is what gets you hired. We focus on practical building and real projects." />
            <ValueCard icon={<Shield size={24} />} title="Honest Feedback" text="Growth requires knowing where you fall short. Our tools provide constructive, realistic assessments." />
            <ValueCard icon={<Heart size={24} />} title="Accessible to All" text="High-quality career mentorship should not be locked behind expensive paywalls or exclusive networks." />
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Vision Cards ─────────────────────────────── */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">What We Stand For</p>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Vision, Method, and Promise
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <VisionCard
              icon={<Lightbulb size={28} />}
              title="Our Vision"
              text="Make high-quality career strategy available to every aspiring and working developer, regardless of background."
            />
            <VisionCard
              icon={<Users size={28} />}
              title="Our Method"
              text="Blend mentorship expertise with product-driven execution. Structured roadmaps meet practical, hands-on guidance."
            />
            <VisionCard
              icon={<Globe size={28} />}
              title="Our Promise"
              text="Trust, practical outcomes, and measurable progress. Every feature is designed to move the needle on your career."
            />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-10 text-center text-white shadow-2xl md:p-16 relative overflow-hidden">
          <div className="glow-blob w-[400px] h-[400px] bg-blue-600 -top-20 -right-20 opacity-25" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Join us on our mission</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-blue-200">
              Whether you are looking to accelerate your own career or help others do the same, there is a place for you at PrepSprint.
            </p>
            <Link
              href="/auth/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition hover:bg-blue-50"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function MilestoneItem({ year, text }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-0.5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-xs font-bold text-white">{year}</div>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

function ValueCard({ icon, title, text }) {
  return (
    <article className="card-hover rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-8">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{text}</p>
    </article>
  );
}

function VisionCard({ icon, title, text }) {
  return (
    <article className="card-hover rounded-3xl border border-blue-100 bg-white p-8 md:p-10">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">{icon}</div>
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <p className="mt-4 text-base leading-relaxed text-slate-500">{text}</p>
    </article>
  );
}
