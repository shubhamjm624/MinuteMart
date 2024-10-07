"use client"

import AuthenticatedHeader from '@/components/header/AuthenticatedHeader';
import NonAuthenticatedHeader from '@/components/header/NonAuthenticatedHeader';
import { useAuth } from '@clerk/nextjs';

export default function Page() {
  const { isLoaded, userId } = useAuth();

  // Show a loading state while Clerk loads
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const isLoggedIn = !!userId;

  return (
    <div>
      {isLoggedIn ? <AuthenticatedHeader /> : <NonAuthenticatedHeader />}
    </div>
  );
}