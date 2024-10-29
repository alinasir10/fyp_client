'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/loading/spinner';
import {useUserStore} from "@/store/userStore";

const LogoutButton = () => {
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/logout');

      if (!data?.status) {
        return toast({
          title: 'Error',
          variant: 'destructive',
          description: data.message || 'Failed to log out. Try again.',
        });
      }

      clearUser();
      toast({ title: 'Logged out successfully', variant: 'success' });
      router.replace('/login');
    } catch (error: unknown) {
      console.error('Error logging out:', error);

      toast({
        title: 'Logout Failed',
        variant: 'destructive',
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={handleLogout}
      className="w-full max-w-xs mt-2"
      variant="destructive"
      aria-busy={isLoading}
    >
      {isLoading ? <Spinner /> : 'Log out'}
    </Button>
  );
};

export default LogoutButton;