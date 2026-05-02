import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="w-full overflow-hidden">

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative px-6 py-28 md:py-36">
        <div className="glow-blob w-[400px] h-[400px] bg-blue-400 -top-32 right-0 opacity-10" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">Privacy Policy</p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl leading-tight">
            Your data, handled with care and transparency.
          </h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: May 2, 2026</p>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Content ──────────────────────────────────── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl prose-custom">

          <p className="text-lg leading-relaxed text-slate-500 mb-10">
            At PrepSprint, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully to understand our views and practices regarding your personal data.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you:</p>
          <ul>
            <li>Register for an account on our platform.</li>
            <li>Fill out forms or assessments to generate a learning roadmap.</li>
            <li>Interact with our AI mentoring and resume building tools.</li>
            <li>Contact our customer support team via email, form, or chat.</li>
            <li>Participate in surveys, promotions, or events.</li>
          </ul>
          <p>This information may include your name, email address, professional background, current skill levels, learning goals, and any content you submit through our tools.</p>

          <h2>2. Automatically Collected Information</h2>
          <p>When you access our platform, we automatically collect certain information about your device and usage, including:</p>
          <ul>
            <li>Browser type, operating system, and device identifiers.</li>
            <li>IP address and approximate geographic location.</li>
            <li>Pages viewed, features used, and time spent on each section.</li>
            <li>Referring URLs and search terms used to find our platform.</li>
          </ul>
          <p>We use this information to understand how our platform is used and to improve your experience.</p>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect primarily to provide, maintain, and improve our services. Specifically, we use it to:</p>
          <ul>
            <li>Generate personalized career and learning roadmaps tailored to your goals.</li>
            <li>Provide contextually relevant AI mentorship and constructive feedback.</li>
            <li>Process transactions and send related information, including confirmations and receipts.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and customer service requests.</li>
            <li>Monitor and analyze trends, usage patterns, and platform performance.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures designed to protect your personal information from unauthorized access, use, alteration, and disclosure. These measures include encryption of data in transit and at rest, regular security audits, and strict access controls for our team members.
          </p>
          <p>
            However, no method of transmission over the Internet, or method of electronic storage, is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>

          <h2>5. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our platform, conducting our business, or providing services to you, so long as those parties agree to keep this information confidential. These providers include cloud hosting, analytics, and customer support tools.
          </p>

          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>7. Your Rights and Choices</h2>
          <p>
            You can access and update your personal information through your account settings at any time. You may also opt-out of receiving promotional communications from us by following the unsubscribe instructions in those emails. Please note that even if you opt-out, we may still send you non-promotional messages relating to your account or our ongoing business relationship.
          </p>
          <p>
            Depending on your jurisdiction, you may have additional rights under applicable data protection laws, including the right to request deletion of your data, data portability, or restriction of processing.
          </p>

          <h2>8. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide you with our services. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our platform is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information from our servers immediately.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@prepsprint.com">privacy@prepsprint.com</a> or visit our <Link href="/contact">Contact Us</Link> page.
          </p>

        </div>
      </section>

    </div>
  );
}
