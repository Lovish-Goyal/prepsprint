'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth';

const publicRoutes = ['/', '/about', '/contact', '/support', '/auth/login', '/auth/signup', '/privacy', '/terms'];

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isPublicRoute = publicRoutes.includes(pathname);
      const hasToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      if (!isPublicRoute && !hasToken) {
        router.push('/auth/login');
      }
    }
  }, [loading, pathname, router]);

  // Optionally show a loading spinner while checking auth status on private routes
  if (loading && !publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
