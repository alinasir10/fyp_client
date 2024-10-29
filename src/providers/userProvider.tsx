'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { getUserDetails } from '@/lib/api';
import React, { useEffect } from 'react';

import Spinner from "@/components/loading/spinner";

interface User {
  id: string;
  email: string;
  username: string;
  profileUrl?: string;
  isVerified: boolean;
  oauthProvider?: string;
}

interface UserResponse {
  user: User;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useUserStore((state) => state.setUser);

  const { data, error, isLoading, status } = useQuery<UserResponse>({
    queryKey: ['user'],
    queryFn: getUserDetails,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: pathname !== '/login' && pathname !== '/register',
  });

  useEffect(() => {
    if (status === 'success' && data?.user) {
      setUser(data.user);
    }
  }, [status, data, setUser]);

  useEffect(() => {
    if (status === 'error') {
      console.error('Error fetching user:', error);
      setUser(null);
      router.replace('/login');
    }
  }, [status, error, setUser, router]);

  if (isLoading && pathname !== '/login' && pathname !== '/register') {
    return (
      <div className={'w-full min-h-screen flex justify-center items-center'}>
        <Spinner/>
      </div>
    );
  }

  return <>{children}</>;
}