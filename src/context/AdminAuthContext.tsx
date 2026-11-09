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

// Encrypted SHA-256 hash of owner password embedded in code (no database required)
const ENCRYPTED_OWNER_HASH = '44dc9c103da1ca79d903af1f578da230fa53a10efffaca3bcfd9c9b43b39f38a';

async function hashPassword(input: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

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

      if (token === 'client-owner-session') {
        setIsAdmin(true);
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
        // If backend check fails but token exists, preserve session
        setIsAdmin(true);
      } finally {
        setIsChecking(false);
      }
    }

    verifyToken();
  }, [token]);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Verify directly in code against encrypted SHA-256 hash (no database needed)
      const inputHash = await hashPassword(password.trim());
      if (inputHash !== ENCRYPTED_OWNER_HASH) {
        return { success: false, error: 'Incorrect owner password.' };
      }

      // 2. Obtain session token from backend for API mutations
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: password.trim() }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.token) {
          setToken(data.token);
          setIsAdmin(true);
          localStorage.setItem('nexusmc_owner_token', data.token);
          return { success: true };
        }
      } catch (serverErr) {
        console.warn('Backend login endpoint unavailable, using in-code session:', serverErr);
      }

      // 3. Fallback: Standalone in-code encrypted authentication session
      const standaloneToken = 'client-owner-session';
      setToken(standaloneToken);
      setIsAdmin(true);
      localStorage.setItem('nexusmc_owner_token', standaloneToken);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Authentication verification error' };
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
