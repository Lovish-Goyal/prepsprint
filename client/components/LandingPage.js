'use client';

import Link from 'next/link';
import {
  ArrowRight, FileText, Map, Users, Layers, Sparkles,
  Compass, CheckCircle2, Brain, BarChart3, Star, MessageSquare,
  ChevronRight, Zap, Target, Globe
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="w-full overflow-hidden">

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Decorative blobs */}
        <div className="glow-blob w-[600px] h-[600px] bg-blue-500 -top-40 -right-40" />
        <div className="glow-blob w-[500px] h-[500px] bg-violet-500 top-60 -left-40 opacity-20" />
        <div className="glow-blob w-[300px] h-[300px] bg-blue-400 bottom-20 right-1/4 opacity-15" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-12 py-24 lg:py-32">
          <div className="max-w-4xl">
            <div className="fade-in inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-blue-700 backdrop-blur-sm">
              <Sparkles size={13} /> Career Acceleration Platform
            </div>

            <h1 className="fade-in fade-in-d1 mt-8 text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-6xl lg:text-7xl xl:text-[5.2rem]">
              Build Your Tech Career
              <br />
              <span className="gradient-text">With Structure, Not Guesswork</span>
            </h1>

            <p className="fade-in fade-in-d2 mt-8 max-w-2xl text-lg leading-relaxed text-slate-500 md:text-xl md:leading-relaxed">
              Create resumes, follow personalized roadmaps, master tech stacks, and connect with mentors — all in one focused workspace designed to accelerate your career.
            </p>

            <div className="fade-in fade-in-d3 mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={user ? '/dashboard' : '/auth/signup'}
                className="premium-btn inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-base font-semibold text-white"
              >
                {user ? 'Open Dashboard' : 'Get Started Free'}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/roadmap"
                className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                Explore Roadmaps
                <ChevronRight size={16} className="text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-slate-200/60 bg-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-0 divide-y divide-slate-100 px-6 md:px-12 py-0 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <StatBlock value="12K+" label="Roadmaps Created" />
          <StatBlock value="94%" label="Interview Readiness" />
          <StatBlock value="3.2x" label="Average Skill Growth" />
          <StatBlock value="4.8/5" label="Mentor Satisfaction" />
        </div>
      </section>

      {/* ═══════════════════ 3. FEATURES ═══════════════════ */}
      <section className="relative px-6 py-10 md:py-14">
        <div className="glow-blob w-[400px] h-[400px] bg-blue-400 -top-20 left-1/3 opacity-15" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12">
          <SectionHeader
            tag="Core Features"
            title="Everything You Need to Succeed"
            subtitle="Four powerful modules designed to take you from zero to hired — structured, guided, and measurable."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <FeatureCard
              icon={<FileText size={28} />}
              title="AI Resume Builder"
              description="Generate ATS-optimized resumes tailored to specific roles. Our AI analyzes job descriptions and crafts targeted bullet points that highlight your strengths."
              color="blue"
            />
            <FeatureCard
              icon={<Map size={28} />}
              title="Career Roadmaps"
              description="Step-by-step structured learning paths designed around real hiring patterns. Each roadmap breaks your journey into weekly sprints with clear deliverables."
              color="violet"
            />
            <FeatureCard
              icon={<Users size={28} />}
              title="Mentor Support"
              description="Get guidance from experienced engineers who have walked the path. Structured feedback sessions help you avoid common pitfalls and accelerate growth."
              color="emerald"
            />
            <FeatureCard
              icon={<Layers size={28} />}
              title="Tech Stack Planner"
              description="Know exactly which technologies to learn for your target role. Our planner maps skills to career goals so you never waste time on irrelevant tools."
              color="amber"
            />
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ═══════════════════ 4. HOW IT WORKS ═══════════════════ */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <SectionHeader
            tag="How It Works"
            title="From Confusion to Clarity in 4 Steps"
            subtitle="A simple, repeatable process that turns ambition into action."
          />

          <div className="mt-16 grid gap-0 md:grid-cols-4">
            <StepCard
              num="01"
              title="Choose Career Goal"
              description="Select your target role — frontend, backend, data science, DevOps — and your current experience level."
              isLast={false}
            />
            <StepCard
              num="02"
              title="Get Your Roadmap"
              description="Receive a personalized plan with weekly milestones, curated resources, and clear priorities."
              isLast={false}
            />
            <StepCard
              num="03"
              title="Learn & Build"
              description="Follow the path: study key concepts, complete hands-on projects, and get AI-powered feedback."
              isLast={false}
            />
            <StepCard
              num="04"
              title="Apply with Confidence"
              description="Build a polished resume, prep for interviews, and start applying with a strong, structured profile."
              isLast={true}
            />
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ═══════════════════ 5. WHY PREPSPRINT ═══════════════════ */}
      <section className="relative px-6 py-10 md:py-14">
        <div className="glow-blob w-[500px] h-[500px] bg-violet-400 bottom-0 right-0 opacity-10" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12">
          <SectionHeader
            tag="Why PrepSprint"
            title="The Smarter Way to Build Your Career"
            subtitle="Stop wasting months on scattered tutorials. Start making real, measurable progress."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              icon={<Compass size={24} />}
              title="Eliminate Confusion"
              description="No more guessing what to learn next. Get a clear, opinionated path built around real market demands."
            />
            <BenefitCard
              icon={<Target size={24} />}
              title="Structured Roadmaps"
              description="Every roadmap is designed by career strategists and aligned with actual job requirements and interview patterns."
            />
            <BenefitCard
              icon={<Zap size={24} />}
              title="Save Months of Time"
              description="Focus only on what matters. Our curated approach cuts learning time by helping you skip the irrelevant noise."
            />
            <BenefitCard
              icon={<Globe size={24} />}
              title="Industry-Aligned"
              description="Learn the exact stacks, tools, and practices that top companies use and hiring managers look for."
            />
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ═══════════════════ 6. ABOUT PREVIEW ═══════════════════ */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-10 md:p-16 shadow-[0_32px_64px_-24px_rgba(15,23,42,.08)]">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">Our Mission</p>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl leading-tight">
              Helping students and developers transition into tech careers with clarity, structure, and guidance.
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-slate-500">
              PrepSprint was born from a simple frustration: too many talented people waste months — sometimes years — jumping between tutorials without a clear direction. We built this platform to give every developer a structured, actionable plan for career growth, backed by AI tools and human mentorship.
            </p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-500">
              Whether you are a college student choosing your first stack, a bootcamp graduate preparing for interviews, or a mid-career professional switching to tech — PrepSprint gives you the roadmap, the tools, and the confidence to move forward.
            </p>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 text-base font-semibold text-blue-600 transition hover:gap-3"
            >
              Read our full story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ═══════════════════ 7. TESTIMONIALS ═══════════════════ */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <SectionHeader
            tag="Testimonials"
            title="Trusted by Developers Worldwide"
            subtitle="Real stories from real people who transformed their careers with PrepSprint."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="I was stuck in tutorial hell for over a year. PrepSprint gave me a clear roadmap and within 4 months I landed my first frontend role. The structured approach changed everything."
              name="Riya Sharma"
              role="Frontend Engineer at Razorpay"
              stars={5}
            />
            <TestimonialCard
              quote="The AI resume builder alone is worth it. I went from getting zero callbacks to three interviews in my first week after rebuilding my resume with PrepSprint."
              name="Aman Gupta"
              role="Backend Developer at Flipkart"
              stars={5}
            />
            <TestimonialCard
              quote="As a career switcher from marketing to tech, I had no idea where to start. The mentor support and step-by-step roadmap made the transition feel manageable and real."
              name="Priya Mehta"
              role="Full Stack Developer"
              stars={5}
            />
            <TestimonialCard
              quote="PrepSprint's tech stack planner helped me understand exactly what to learn for my target role. No more wasting time on irrelevant tutorials."
              name="Karthik R."
              role="Data Engineer at Swiggy"
              stars={5}
            />
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ═══════════════════ 8. CONTACT PREVIEW ═══════════════════ */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">Get in Touch</p>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Have a question? We would love to hear from you.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Whether it is about onboarding, partnerships, or feedback — our team responds within one business day.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="premium-btn inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
            <Link
              href="/support"
              className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              Visit Support Center
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 9. FINAL CTA ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div className="glow-blob w-[600px] h-[600px] bg-blue-600 top-0 right-0 opacity-20" />
        <div className="glow-blob w-[400px] h-[400px] bg-violet-600 bottom-0 left-0 opacity-15" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-14 text-center md:py-20">
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Ready to accelerate
            <br />
            your career?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200 md:text-xl">
            Join thousands of developers who stopped guessing and started building their careers with clarity and confidence.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={user ? '/dashboard' : '/auth/signup'}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition hover:bg-blue-50"
            >
              {user ? 'Go to Dashboard' : 'Start Free Today'}
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}


/* ─── Sub-components ──────────────────────────────────── */

function SectionHeader({ tag, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">{tag}</p>
      <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-relaxed text-slate-500 md:text-xl">{subtitle}</p>
    </div>
  );
}

function StatBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <p className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">{value}</p>
      <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

const featureColors = {
  blue:    { bg: 'bg-blue-600',    light: 'bg-blue-50',  text: 'text-blue-600',    border: 'border-blue-100' },
  violet:  { bg: 'bg-violet-600',  light: 'bg-violet-50', text: 'text-violet-600',  border: 'border-violet-100' },
  emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50',text: 'text-emerald-600', border: 'border-emerald-100' },
  amber:   { bg: 'bg-amber-600',   light: 'bg-amber-50', text: 'text-amber-600',   border: 'border-amber-100' },
};

function FeatureCard({ icon, title, description, color = 'blue' }) {
  const c = featureColors[color];
  return (
    <article className={`card-hover group rounded-3xl border ${c.border} bg-white p-8 md:p-10`}>
      <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} text-white shadow-lg transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <p className="mt-4 text-base leading-relaxed text-slate-500">{description}</p>
      <div className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} opacity-0 transition-opacity group-hover:opacity-100`}>
        Learn more <ChevronRight size={14} />
      </div>
    </article>
  );
}

function StepCard({ num, title, description, isLast }) {
  return (
    <div className="relative flex flex-col items-center px-6 py-10 text-center">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute right-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-200 to-transparent md:block" />
      )}

      <div className="stat-glow relative z-10 mb-6 grid h-16 w-16 place-items-center rounded-full bg-blue-600 text-lg font-bold text-white">
        {num}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function BenefitCard({ icon, title, description }) {
  return (
    <article className="card-hover rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-8">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
    </article>
  );
}

function TestimonialCard({ quote, name, role, stars = 5 }) {
  return (
    <article className="card-hover flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8">
      <div>
        <div className="mb-5 flex gap-1">
          {Array.from({ length: stars }).map((_, i) => (
            <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-base leading-relaxed text-slate-600">"{quote}"</p>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </article>
  );
}
