'use client';

import { useEffect } from 'react';
import { checkSession, getMe } from '../../lib/api/clientApi';
import { useAuthStore } from '../../lib/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await checkSession();
        if (session.success) {
          const user = await getMe();
          setUser(user);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    };

    checkAuth();
  }, [setUser, clearAuth]);

  return <>{children}</>;
}