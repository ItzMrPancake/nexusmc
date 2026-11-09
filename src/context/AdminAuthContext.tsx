import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  token: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  authHeaders: Record<string, string>;
  isChecking: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  token: null,
  login: async () => ({ success: false }),
  logout: () => {},
  authHeaders: {},
  isChecking: true,
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('nexusmc_owner_token') || null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Verify stored token on boot
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/check', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-owner-token': token,
          },
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setToken(null);
          localStorage.removeItem('nexusmc_owner_token');
        }
      } catch (err) {
        console.error('Failed to verify owner session:', err);
      } finally {
        setIsChecking(false);
      }
    }

    verifyToken();
  }, [token]);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setToken(data.token);
        setIsAdmin(true);
        localStorage.setItem('nexusmc_owner_token', data.token);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || 'Invalid owner password',
        };
      }
    } catch (err) {
      return { success: false, error: 'Network error connecting to backend' };
    }
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('nexusmc_owner_token');
  };

  const authHeaders: Record<string, string> = token
    ? {
        Authorization: `Bearer ${token}`,
        'x-owner-token': token,
        'Content-Type': 'application/json',
      }
    : {
        'Content-Type': 'application/json',
      };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        token,
        login,
        logout,
        authHeaders,
        isChecking,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
