import './globals.css';
import { AuthProvider } from '../lib/auth';
import LayoutContent from '../components/LayoutContent';
import AuthGuard from '../components/AuthGuard';

export const metadata = {
  title: 'PrepSprint — Build Your Tech Career With Structure',
  description: 'PrepSprint is an Ambala Cantt, Haryana based career acceleration platform developed by Techversoft Innovations, offering an AI resume builder, personalized roadmaps, and tech stack guidance.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366f1" /><stop offset="50%" stop-color="%232563eb" /><stop offset="100%" stop-color="%234338ca" /></linearGradient></defs><rect width="100" height="100" rx="28" fill="url(%23g)" /><path d="M52 40V12L16 56h28v28l36-44H48z" fill="white" /></svg>',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50">
        <AuthProvider>
          <AuthGuard>
            <LayoutContent>
              {children}
            </LayoutContent>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
