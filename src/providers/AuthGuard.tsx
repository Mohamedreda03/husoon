'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (isLoading) return;

    if (!user && !isAuthPage) {
      // Not logged in, trying to access app -> go to login
      router.replace('/login');
    } else if (user && isAuthPage) {
      // Logged in, trying to access login/register -> go to dashboard
      // If coming from register, go to onboarding
      const destination = pathname === '/register' ? '/onboarding' : '/';
      router.replace(destination);
    }
  }, [user, isLoading, isAuthPage, router]);

  // Show nothing or a loader while deciding
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Prevent flash of protected content before redirect
  if (!user && !isAuthPage) return null;
  if (user && isAuthPage) return null;

  return <>{children}</>;
}
