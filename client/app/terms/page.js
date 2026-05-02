import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="w-full overflow-hidden">

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative px-6 py-28 md:py-36">
        <div className="glow-blob w-[400px] h-[400px] bg-violet-400 -top-32 left-0 opacity-10" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">Terms & Conditions</p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl leading-tight">
            Clear terms for responsible and fair platform use.
          </h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: May 2, 2026</p>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Content ──────────────────────────────────── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl prose-custom">

          <p className="text-lg leading-relaxed text-slate-500 mb-10">
            Welcome to PrepSprint. By accessing or using our platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. Please read these terms carefully before using our services.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            These Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and PrepSprint, concerning your access to and use of the platform. If you do not agree with all of these Terms, then you are expressly prohibited from using the platform and you must discontinue use immediately.
          </p>
          <p>
            Supplemental terms and conditions or documents that may be posted on the platform from time to time are hereby expressly incorporated herein by reference. We reserve the right to make changes to these Terms at any time and for any reason.
          </p>

          <h2>2. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
          <ul>
            <li>You are responsible for safeguarding the password that you use to access the service.</li>
            <li>You agree not to disclose your password to any third party.</li>
            <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
            <li>You may not use as a username the name of another person or entity that is not lawfully available for use.</li>
          </ul>

          <h2>3. Acceptable Use</h2>
          <p>You may not access or use the platform for any purpose other than that for which we make it available. As a user of the platform, you agree not to:</p>
          <ul>
            <li>Systematically retrieve data or content from the platform to create or compile a collection, compilation, database, or directory without written permission.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the platform.</li>
            <li>Engage in unauthorized framing of or linking to the platform.</li>
            <li>Make improper use of our support services or submit false reports of abuse.</li>
            <li>Engage in any automated use of the system, such as using scripts to send comments or messages.</li>
            <li>Interfere with, disrupt, or create an undue burden on the platform or the networks connected to the platform.</li>
            <li>Attempt to bypass any measures designed to prevent or restrict access to the platform.</li>
            <li>Use the platform to advertise or sell goods and services without our prior consent.</li>
          </ul>

          <h2>4. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the platform is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the platform (collectively, the &quot;Content&quot;) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
          </p>
          <p>
            The Content and the platform are provided &quot;AS IS&quot; for your information and personal use only. Except as expressly provided in these Terms, no part of the platform may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, or distributed in any form or by any means.
          </p>

          <h2>5. User Generated Content</h2>
          <p>
            The platform may invite you to submit content such as resumes, skill assessments, roadmap preferences, and mentor chat messages. By submitting content, you grant us a non-exclusive, royalty-free license to use, modify, and display that content solely for the purpose of providing our services to you.
          </p>
          <p>
            You represent and warrant that you own or control all rights to the content you post and that the content is accurate and not misleading.
          </p>

          <h2>6. Subscriptions and Payments</h2>
          <p>
            Certain features of the platform may be available only through paid subscriptions. By subscribing, you agree to pay all applicable fees. Subscription fees are billed in advance on a monthly or annual basis depending on the plan you select. All payments are non-refundable except where required by law.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The platform is provided on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; basis. You agree that your use of the platform and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the platform and your use thereof, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profits, lost revenue, loss of data, or other damages arising from your use of the platform, even if we have been advised of the possibility of such damages.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed by and defined following the laws of India. PrepSprint and yourself irrevocably consent that the courts of Bengaluru, Karnataka shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Terms.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. Upon termination, your right to use the platform will cease immediately.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have any questions or concerns regarding these Terms, please contact us at <a href="mailto:legal@prepsprint.com">legal@prepsprint.com</a> or visit our <Link href="/contact">Contact Us</Link> page.
          </p>

        </div>
      </section>

    </div>
  );
}
