'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/60 bg-slate-950 text-slate-400">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-6 md:px-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-[13px] font-extrabold text-white">
              PS
            </div>
            <p className="text-lg font-extrabold tracking-tight text-white">PrepSprint</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
            Build career clarity with personalized roadmaps, AI-powered tools, and structured mentorship. Stop guessing — start growing.
          </p>
          <div className="mt-6 flex gap-3">
            <SocialIcon icon={<Twitter size={16} />} />
            <SocialIcon icon={<Linkedin size={16} />} />
            <SocialIcon icon={<Github size={16} />} />
            <SocialIcon icon={<Mail size={16} />} />
          </div>
        </div>

        {/* Platform */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Platform</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/" className="transition hover:text-white">Home</Link></li>
            <li><Link href="/about" className="transition hover:text-white">About Us</Link></li>
            <li><Link href="/roadmap" className="transition hover:text-white">Roadmaps</Link></li>
            <li><Link href="/support" className="transition hover:text-white">Support Center</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Legal</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="transition hover:text-white">Terms & Conditions</Link></li>
            <li><Link href="/contact" className="transition hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>support@prepsprint.com</li>
            <li>+91 98765 43210</li>
            <li>Bengaluru, India</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-slate-600 md:flex-row">
          <p>© {year} PrepSprint. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-slate-400">Privacy</Link>
            <Link href="/terms" className="transition hover:text-slate-400">Terms</Link>
            <Link href="/contact" className="transition hover:text-slate-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
  return (
    <div className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-slate-800 text-slate-500 transition hover:border-slate-600 hover:text-white">
      {icon}
    </div>
  );
}
