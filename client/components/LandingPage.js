'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, FileText, Map, Users, Layers, Sparkles,
  Compass, CheckCircle2, Brain, BarChart3, Star, MessageSquare,
  ChevronRight, ChevronLeft, Zap, Target, Globe
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const TESTIMONIALS_DATA = [
  {
    quote: "I was stuck in tutorial hell for over a year. PrepSprint gave me a clear roadmap and within 4 months I landed my first frontend role. The structured approach changed everything.",
    name: "Riya Sharma",
    role: "Frontend Engineer at Razorpay",
    stars: 5
  },
  {
    quote: "The AI resume builder alone is worth it. I went from getting zero callbacks to three interviews in my first week after rebuilding my resume with PrepSprint.",
    name: "Aman Gupta",
    role: "Backend Developer at Flipkart",
    stars: 5
  },
  {
    quote: "As a career switcher from marketing to tech, I had no idea where to start. The mentor support and step-by-step roadmap made the transition feel manageable and real.",
    name: "Priya Mehta",
    role: "Full Stack Developer",
    stars: 5
  },
  {
    quote: "PrepSprint's tech stack planner helped me understand exactly what to learn for my target role. No more wasting time on irrelevant tutorials.",
    name: "Karthik R.",
    role: "Data Engineer at Swiggy",
    stars: 5
  },
  {
    quote: "I loved the AI-powered mock interviews. The feedback was extremely actionable and pinpointed exactly where I was failing the STAR method.",
    name: "Vikram Singh",
    role: "Software Engineer II at Microsoft",
    stars: 5
  },
  {
    quote: "The depth of the tech discovery protocol is insane. We use these architectural primitives to make critical engineering choices daily.",
    name: "Devika Menon",
    role: "Lead Developer at Freshworks",
    stars: 5
  },
  {
    quote: "I followed the Rust & systems roadmap religiously. Six months later, I cleared the systems interview at a tier-1 tech firm. Extremely structured.",
    name: "Siddharth Roy",
    role: "Systems Engineer",
    stars: 5
  },
  {
    quote: "Being able to visualize my progress using the skills tracker kept me motivated. The learning insights and progress rings are incredibly accurate.",
    name: "Anjali Verma",
    role: "Full Stack Engineer at Zomato",
    stars: 5
  },
  {
    quote: "PrepSprint was exactly what I needed to switch to a DevOps role. The Kubernetes and Terraform roadmap was completely production-aligned.",
    name: "Rahul Nair",
    role: "DevOps Engineer",
    stars: 5
  },
  {
    quote: "I built my confidence from ground zero with PrepSprint's AI career mentor. It's like having a senior engineer in your corner 24/7.",
    name: "Shreya Patel",
    role: "Software SDE at Jio",
    stars: 5
  },
  {
    quote: "The future scope market intelligence section let me pivot from simple web development to high-demand LLM engineering. Truly premium.",
    name: "Kunal Kapoor",
    role: "AI Engineer",
    stars: 5
  },
  {
    quote: "From creating my resume to passing the final architectural round, PrepSprint's separated modules had everything ready for me.",
    name: "Neha Saxena",
    role: "Technical Lead",
    stars: 5
  },
  {
    quote: "PrepSprint completely removes tutorial paralysis. Having specific weekly deliverables makes career advancement effortless.",
    name: "Arjun Das",
    role: "Senior Developer",
    stars: 5
  },
  {
    quote: "Their ATS-optimized resume builder gave me an 85%+ match on my target backend roles. My callback rates tripled instantly.",
    name: "Sanjay Rao",
    role: "Backend Engineer at Ola",
    stars: 5
  },
  {
    quote: "The interview feedback pinpointed my lack of clarity around complex system architectures. I passed my Google SDE interview because of it!",
    name: "Tanvi Goel",
    role: "SDE III at Google",
    stars: 5
  },
  {
    quote: "PrepSprint didn't just teach me what to learn—it gave me the exact timing and sequencing for every single technology.",
    name: "Sameer Khan",
    role: "Mobile Engineer at Swiggy",
    stars: 5
  },
  {
    quote: "No other platform matches the precision of PrepSprint's interactive skills analyzer. Pure engineering signal, zero noise.",
    name: "Nidhi Bhatt",
    role: "Data Platform Lead",
    stars: 5
  },
  {
    quote: "The UI is so beautiful and responsive. It's incredibly motivating to come here every morning and update my tracking.",
    name: "Ishaan Joshi",
    role: "UI/UX Developer",
    stars: 5
  },
  {
    quote: "I was able to map out my transition to Cloud Native architecture perfectly using the high-fidelity blueprints.",
    name: "Rohan Bansal",
    role: "Solutions Architect",
    stars: 5
  },
  {
    quote: "PrepSprint provides the clearest path to senior roles. The architectural dilemma and leadership blueprints are invaluable.",
    name: "Meera Iyer",
    role: "Principal SDE",
    stars: 5
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const [activeModalFeature, setActiveModalFeature] = useState(null);

  // Carousel State & Logic
  const [activeDot, setActiveDot] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const carouselRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const scrollAmount = container.clientWidth;
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const scrollToGroup = (dotIdx) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const scrollAmount = dotIdx * container.clientWidth;
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setActiveDot(dotIdx);
    }
  };

  const updateActiveDot = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const index = Math.round(scrollLeft / (clientWidth || 1));
      const totalDots = Math.ceil(TESTIMONIALS_DATA.length / cardsPerPage);
      const dotIndex = Math.min(totalDots - 1, index);
      if (dotIndex >= 0) {
        setActiveDot(dotIndex);
      }
    }
  };

  return (
    <div className="w-full overflow-hidden">

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-20 flex items-center">
        {/* Decorative blobs */}
        <div className="glow-blob w-[600px] h-[600px] bg-blue-500 -top-40 -right-40" />
        <div className="glow-blob w-[500px] h-[500px] bg-violet-500 top-60 -left-40 opacity-20" />
        <div className="glow-blob w-[300px] h-[300px] bg-blue-400 bottom-20 right-1/4 opacity-15" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 md:px-12">
          <div className="max-w-4xl">
            <div className="fade-in inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-blue-700 backdrop-blur-sm">
              <Sparkles size={13} /> Career Acceleration Platform
            </div>

            <h1 className="fade-in fade-in-d1 mt-6 text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[5.2rem] font-extrabold leading-[1.15] md:leading-[1.05] tracking-tight text-slate-900">
              Build Your Tech Career
              <br />
              <span className="gradient-text">With Structure, Not Guesswork</span>
            </h1>

            <p className="fade-in fade-in-d2 mt-4 md:mt-8 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-500 md:leading-relaxed">
              Create resumes, follow personalized roadmaps, master tech stacks, and connect with mentors — all in one focused workspace designed to accelerate your career.
            </p>

            <div className="fade-in fade-in-d3 mt-6 md:mt-10 flex flex-wrap items-center gap-4">
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
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-px bg-slate-200/30 px-4 md:px-12 sm:grid-cols-2 lg:grid-cols-4">
          <StatBlock value="12K+" label="Roadmaps Created" />
          <StatBlock value="94%" label="Interview Readiness" />
          <StatBlock value="3.2x" label="Average Skill Growth" />
          <StatBlock value="4.8/5" label="Mentor Satisfaction" />
        </div>
      </section>

      {/* ═══════════════════ 3. FEATURES ═══════════════════ */}
      <section className="relative px-4 py-8 md:py-14">
        <div className="glow-blob w-[400px] h-[400px] bg-blue-400 -top-20 left-1/3 opacity-15" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-12">
          <SectionHeader
            tag="Core Features"
            title="Everything You Need to Succeed"
            subtitle="Six powerful modules designed to take you from zero to hired — structured, guided, and measurable."
          />

          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            <FeatureCard
              icon={<FileText size={28} />}
              title="AI Resume Builder"
              description="Generate ATS-optimized resumes tailored to specific roles. Our AI analyzes job descriptions and crafts targeted bullet points that highlight your strengths."
              color="blue"
              onClick={() => setActiveModalFeature('AI Resume Builder')}
            />
            <FeatureCard
              icon={<Map size={28} />}
              title="Career Roadmaps"
              description="Step-by-step structured learning paths designed around real hiring patterns. Each roadmap breaks your journey into weekly sprints with clear deliverables."
              color="violet"
              onClick={() => setActiveModalFeature('Career Roadmaps')}
            />
            <FeatureCard
              icon={<Users size={28} />}
              title="Mentor Support"
              description="Get guidance from experienced engineers who have walked the path. Structured feedback sessions help you avoid common pitfalls and accelerate growth."
              color="emerald"
              onClick={() => setActiveModalFeature('Mentor Support')}
            />
            <FeatureCard
              icon={<Layers size={28} />}
              title="Tech Stack Planner"
              description="Know exactly which technologies to learn for your target role. Our planner maps skills to career goals so you never waste time on irrelevant tools."
              color="amber"
              onClick={() => setActiveModalFeature('Tech Stack Planner')}
            />
            <FeatureCard
              icon={<Target size={28} />}
              title="Skill Analyzer"
              description="Test your knowledge on key development stacks and frameworks. Get a detailed scorecard identifying your weak areas and learning gaps."
              color="pink"
              onClick={() => setActiveModalFeature('Skill Analyzer')}
            />
            <FeatureCard
              icon={<Brain size={28} />}
              title="AI Mock Interviews"
              description="Practice real-world technical and behavioral interview questions. Get instantaneous diagnostic feedback aligned with industry grading systems."
              color="indigo"
              onClick={() => setActiveModalFeature('AI Mock Interviews')}
            />
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ═══════════════════ 4. HOW IT WORKS ═══════════════════ */}
      <section className="px-4 py-8 md:py-14">
        <div className="mx-auto max-w-[1440px] px-4 md:px-12">
          <SectionHeader
            tag="How It Works"
            title="From Confusion to Clarity in 4 Steps"
            subtitle="A simple, repeatable process that turns ambition into action."
          />

          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
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
      <section className="relative px-4 py-8 md:py-14">
        <div className="glow-blob w-[500px] h-[500px] bg-violet-400 bottom-0 right-0 opacity-10" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-12">
          <SectionHeader
            tag="Why PrepSprint"
            title="The Smarter Way to Build Your Career"
            subtitle="Stop wasting months on scattered tutorials. Start making real, measurable progress."
          />

          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
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
      <section className="px-4 py-8 md:py-14">
        <div className="mx-auto max-w-[1440px] px-4 md:px-12">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 md:p-16 shadow-[0_32px_64px_-24px_rgba(15,23,42,.08)]">
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
      <section className="px-4 py-8 md:py-14 relative overflow-hidden bg-slate-50/50">
        <div className="glow-blob w-[500px] h-[500px] bg-blue-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-35" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-12">
          <SectionHeader
            tag="Testimonials"
            title="Trusted by Developers Worldwide"
            subtitle="Real stories from real people who transformed their careers with PrepSprint."
          />

          {/* Carousel Wrapper */}
          <div className="relative mt-12 md:mt-16 group/carousel">
            {/* Fade Gradients for Desktop */}
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-50/50 to-transparent z-10 pointer-events-none hidden md:block" />
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-50/50 to-transparent z-10 pointer-events-none hidden md:block" />

            {/* Nav Buttons */}
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95 md:opacity-0 md:group-hover/carousel:opacity-100 focus:opacity-100 md:left-4"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95 md:opacity-0 md:group-hover/carousel:opacity-100 focus:opacity-100 md:right-4"
              aria-label="Next testimonials"
            >
              <ChevronRight size={20} />
            </button>

            {/* Scrollable Container */}
            <div
              ref={carouselRef}
              onScroll={updateActiveDot}
              className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-4 px-2 scrollbar-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {TESTIMONIALS_DATA.map((t, idx) => (
                <div 
                  key={idx} 
                  className="w-[280px] xs:w-[320px] md:w-[380px] shrink-0 snap-start h-auto"
                >
                  <TestimonialCard
                    quote={t.quote}
                    name={t.name}
                    role={t.role}
                    stars={t.stars}
                  />
                </div>
              ))}
            </div>

            {/* Progress / Dot Indicators */}
            <div className="mt-4 hidden md:flex justify-center gap-2">
              {Array.from({ length: Math.ceil(TESTIMONIALS_DATA.length / cardsPerPage) }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => scrollToGroup(dotIdx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeDot === dotIdx 
                      ? 'w-6 bg-blue-600' 
                      : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide page ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ═══════════════════ 8. CONTACT PREVIEW ═══════════════════ */}
      <section className="px-4 py-8 md:py-14">
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

      {/* Detail Modal overlay */}
      {activeModalFeature && FEATURE_DETAILS[activeModalFeature] && (
        <div 
          onClick={() => setActiveModalFeature(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 relative overflow-hidden"
          >
            {/* Top Accent Icon */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">
                {FEATURE_DETAILS[activeModalFeature].icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{FEATURE_DETAILS[activeModalFeature].title}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Feature Deep Dive</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              {FEATURE_DETAILS[activeModalFeature].desc}
            </p>

            {/* Bullet Points */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Capabilities</p>
              <ul className="space-y-3.5">
                {FEATURE_DETAILS[activeModalFeature].bullets.map((bullet, idx) => {
                  const [label, desc] = bullet.split(': ');
                  return (
                    <li key={idx} className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-900 font-bold">{label}</strong>: {desc}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Close Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setActiveModalFeature(null)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}

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
    <div className="flex flex-col items-center justify-center px-4 py-6 md:py-10 text-center bg-white">
      <p className="text-2xl md:text-5xl font-extrabold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-xs md:text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

const featureColors = {
  blue:    { bg: 'bg-blue-600',    light: 'bg-blue-50',  text: 'text-blue-600',    border: 'border-blue-100' },
  violet:  { bg: 'bg-violet-600',  light: 'bg-violet-50', text: 'text-violet-600',  border: 'border-violet-100' },
  emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50',text: 'text-emerald-600', border: 'border-emerald-100' },
  amber:   { bg: 'bg-amber-600',   light: 'bg-amber-50', text: 'text-amber-600',   border: 'border-amber-100' },
  pink:    { bg: 'bg-pink-600',    light: 'bg-pink-50',  text: 'text-pink-600',    border: 'border-pink-100' },
  indigo:  { bg: 'bg-indigo-600',  light: 'bg-indigo-50', text: 'text-indigo-600',  border: 'border-indigo-100' },
};

function FeatureCard({ icon, title, description, color = 'blue', onClick }) {
  const c = featureColors[color];
  return (
    <article className={`card-hover group rounded-2xl md:rounded-3xl border ${c.border} bg-white p-4 md:p-10 flex flex-col justify-between`}>
      <div>
        <div className={`mb-4 md:mb-6 inline-flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl ${c.bg} text-white shadow-lg transition-transform group-hover:scale-110`}>
          <div className="flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-7 md:[&>svg]:h-7">
            {icon}
          </div>
        </div>
        <h3 className="text-base md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>
        <p className="mt-2 md:mt-4 text-[11px] md:text-base leading-relaxed text-slate-500 line-clamp-3 md:line-clamp-none">{description}</p>
      </div>
      <button 
        onClick={onClick}
        className={`mt-4 md:mt-6 inline-flex items-center gap-1 text-[11px] md:text-sm font-semibold ${c.text} hover:underline w-fit text-left outline-none`}
      >
        Learn more <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
      </button>
    </article>
  );
}

const FEATURE_DETAILS = {
  'AI Resume Builder': {
    title: 'AI Resume Builder',
    icon: <FileText size={24} className="text-blue-600" />,
    desc: 'Build highly targeted, ATS-optimized resumes that stand out to tech recruiters globally.',
    bullets: [
      'ATS Optimization: Automatically parses target job descriptions to identify key search keywords and formats the text to pass recruiter parsing systems with a high match score.',
      'Modern Corporate Layouts: Populates Harvard/Ivy-League standard single-column and multi-column designs approved by global hiring leads.',
      'Smart Bullet Builder: Generate concise, metric-driven impact points following the Google XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).',
      'Direct PDF Exports: High-quality rendering directly in your browser with dynamic layout alignment, ensuring text remains searchable.'
    ]
  },
  'Career Roadmaps': {
    title: 'Career Roadmaps',
    icon: <Map size={24} className="text-violet-600" />,
    desc: 'Follow custom-sequenced technical curriculum maps calibrated against actual industry job specifications.',
    bullets: [
      'Weekly Sprints: Break your learning path into clear, digestible milestones with dedicated practice tasks and study guides.',
      'Milestone Projects: Build real-world portfolio assets to prove capability, structured to resemble enterprise codebases.',
      'Dynamic Personalization: Generates learning tasks based on your current experience level (Beginner, Intermediate, Advanced).',
      'Direct Concept Links: Explains topics in-depth with formatted key-value syntax and keywords highlighted in monospaced tags.'
    ]
  },
  'Mentor Support': {
    title: 'Mentor Support',
    icon: <Users size={24} className="text-emerald-600" />,
    desc: 'Receive direct asynchronous and live guidance from senior software engineers working at top tech firms.',
    bullets: [
      'Detailed Code Reviews: Get direct feedback on structural design patterns, test coverage, and clean coding best practices.',
      'System Design Sprints: Schedule interactive preparation sessions mapping complex service-oriented architectural designs.',
      'Mock Technical Screenings: Practice coding interviews with real engineers who evaluate execution, syntax logic, and scaling.',
      'Career Planning guidance: Map out transition frameworks from college or non-technical backgrounds directly into tech.'
    ]
  },
  'Tech Stack Planner': {
    title: 'Tech Stack Planner',
    icon: <Layers size={24} className="text-amber-600" />,
    desc: 'Map out exactly which languages, libraries, and architectural concepts match your specific career objectives.',
    bullets: [
      'Market Intelligence: Scrapes real-time global hiring data to identify high-demand frameworks and declining languages.',
      'Targeted Learning Paths: Highlights the exact list of tools required for backend, frontend, DevOps, or data engineering roles.',
      'Irrelevant Stack Filtering: Keeps learning pathways efficient by stripping out redundant tutorials and legacy technologies.',
      'Interactive Assessment: Maps frameworks visually inside interactive dependency cards to track technology coverage.'
    ]
  },
  'Skill Analyzer': {
    title: 'Skill Analyzer',
    icon: <Target size={24} className="text-pink-600" />,
    desc: 'Run interactive assessment test suites to verify technical competency levels across selected framework profiles.',
    bullets: [
      'Objective Evaluation: Evaluates syntax, memory management, scaling parameters, and caching logic in framework profiles.',
      'Target Profile Matching: Benchmarks your scorecard against actual industry requirements for senior and mid-level roles.',
      'Weak Spot Highlights: Pins down exact framework classes, methods, or database queries where your execution falls short.',
      'Visual Progression Tracker: Maps progress dynamically on rings showing relative maturity ratings across framework concepts.'
    ]
  },
  'AI Mock Interviews': {
    title: 'AI Mock Interviews',
    icon: <Brain size={24} className="text-indigo-600" />,
    desc: 'Simulate realistic mock software engineering interview processes with PrepSprint\'s automated career strategist.',
    bullets: [
      'Dynamic Behavioral Checks: Runs targeted behavioral checks to assess communication clarity and team fit.',
      'STAR Method Grading: Evaluates mock responses according to Situation, Task, Action, and Result formatting frameworks.',
      'Instant Diagnostics: Delivers immediate feedback indicating structure errors, timing issues, or lack of architectural depth.',
      'Detailed Mock transcripts: Saves historical transcripts with clear annotations detailing score progressions.'
    ]
  }
};

function StepCard({ num, title, description, isLast }) {
  return (
    <div className="relative flex flex-col items-center px-4 py-6 md:py-10 text-center">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute right-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-200 to-transparent md:block" />
      )}

      <div className="stat-glow relative z-10 mb-4 md:mb-6 grid h-12 w-12 md:h-16 md:w-16 place-items-center rounded-full bg-blue-600 text-base md:text-lg font-bold text-white">
        {num}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 md:mt-3 text-xs md:text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function BenefitCard({ icon, title, description }) {
  return (
    <article className="card-hover rounded-2xl md:rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-5 md:p-8">
      <div className="mb-4 md:mb-5 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 md:mt-3 text-xs md:text-sm leading-relaxed text-slate-500">{description}</p>
    </article>
  );
}

function TestimonialCard({ quote, name, role, stars = 5 }) {
  return (
    <article className="card-hover flex flex-col justify-between rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-5 md:p-8 h-full">
      <div>
        <div className="mb-4 md:mb-5 flex gap-1">
          {Array.from({ length: stars }).map((_, i) => (
            <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-sm md:text-base leading-relaxed text-slate-600">"{quote}"</p>
      </div>
      <div className="mt-6 md:mt-8 flex items-center gap-3">
        <div className="grid h-8 w-8 md:h-10 md:w-10 place-items-center rounded-full bg-blue-100 text-xs md:text-sm font-bold text-blue-700">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-xs md:text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-[10px] md:text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </article>
  );
}
