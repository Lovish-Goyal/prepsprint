'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react';

export default function ContactUs() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Message received! Our team will respond within one business day.');
  };

  return (
    <div className="w-full overflow-hidden">

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative px-6 py-10 md:py-14">
        <div className="glow-blob w-[500px] h-[500px] bg-blue-400 -top-40 -right-40 opacity-15" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">Contact Us</p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl leading-tight">
            We are here to help you move forward.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
            Have questions about onboarding, tools, or partnerships? Reach out and we will guide you quickly.
          </p>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Contact Info Cards ────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
          <ContactInfoCard
            icon={<Mail size={24} />}
            title="Email Us"
            detail="support@prepsprint.com"
            sub="We respond within 24 hours"
          />
          <ContactInfoCard
            icon={<Phone size={24} />}
            title="Call Us"
            detail="+91 98765 43210"
            sub="Mon–Fri, 9 AM – 6 PM IST"
          />
          <ContactInfoCard
            icon={<MapPin size={24} />}
            title="Visit Us"
            detail="Bengaluru, India"
            sub="100 Tech Park, Karnataka 560001"
          />
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Contact Form ─────────────────────────────── */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">Send a Message</p>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl leading-tight">
              Tell us what you need. We will take it from here.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-500">
              Whether you are a student looking for guidance, a company interested in partnerships, or a developer with feedback — we want to hear from you. Fill out the form and our team will get back to you within one business day.
            </p>

            <div className="mt-10 space-y-5 border-t border-slate-200 pt-10">
              <InfoRow label="General inquiries" value="hello@prepsprint.com" />
              <InfoRow label="Technical support" value="support@prepsprint.com" />
              <InfoRow label="Partnerships" value="partners@prepsprint.com" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_48px_-16px_rgba(15,23,42,.08)] md:p-10">
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="First Name" type="text" placeholder="John" />
                <FormField label="Last Name" type="text" placeholder="Doe" />
              </div>
              <FormField label="Email" type="email" placeholder="john@company.com" />
              <FormField label="Subject" type="text" placeholder="How can we help?" />
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us more about your question or request..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 resize-y"
                />
              </div>
              <button
                type="submit"
                className="premium-btn w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white"
              >
                Send Message <Send size={16} />
              </button>
              {status && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-emerald-800">{status}</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* ── FAQ mini-section ──────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 text-center mb-10">Common Questions</h3>
          <div className="space-y-4">
            <FaqItem q="What are your support hours?" a="Our team is available Monday through Friday, 9 AM to 6 PM IST. We aim to respond to all inquiries within 24 hours." />
            <FaqItem q="Do you offer phone support?" a="Phone support is available during business hours for all premium users. Free-tier users can reach us via email." />
            <FaqItem q="Can I request a product demo?" a="Absolutely! Send us a message with your requirements and our team will schedule a personalized walkthrough." />
          </div>
        </div>
      </section>

    </div>
  );
}

function ContactInfoCard({ icon, title, detail, sub }) {
  return (
    <div className="card-hover rounded-3xl border border-slate-200 bg-white p-8 text-center">
      <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-base font-semibold text-slate-700">{detail}</p>
      <p className="mt-1 text-sm text-slate-500">{sub}</p>
    </div>
  );
}

function FormField({ label, type, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
      />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function FaqItem({ q, a }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h4 className="text-base font-semibold text-slate-900">{q}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{a}</p>
    </div>
  );
}
