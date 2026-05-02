import './globals.css';
import { AuthProvider } from '../lib/auth';
import LayoutContent from '../components/LayoutContent';
import AuthGuard from '../components/AuthGuard';

export const metadata = {
  title: 'PrepSprint — Build Your Tech Career With Structure',
  description: 'Career acceleration platform with AI resume builder, personalized roadmaps, mentor support, and tech stack guidance. Stop guessing, start growing.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
