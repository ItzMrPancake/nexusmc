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
  isChecking: false,
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
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('nexusmc_admin_session') === 'true';
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('nexusmc_owner_token') || 'local-owner-token';
  });

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Verify directly against encrypted SHA-256 hash in pure code (no database needed)
      const inputHash = await hashPassword(password.trim());
      if (inputHash !== ENCRYPTED_OWNER_HASH) {
        return { success: false, error: 'Incorrect owner password.' };
      }

      // 2. Set authenticated state immediately locally
      setIsAdmin(true);
      setToken('local-owner-token');
      localStorage.setItem('nexusmc_admin_session', 'true');
      localStorage.setItem('nexusmc_owner_token', 'local-owner-token');

      // 3. Optional background server session creation (non-blocking)
      fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.token) {
            setToken(data.token);
            localStorage.setItem('nexusmc_owner_token', data.token);
          }
        })
        .catch(() => {});

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Authentication verification failed' };
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setToken(null);
    localStorage.removeItem('nexusmc_admin_session');
    localStorage.removeItem('nexusmc_owner_token');
  };

  const authHeaders: Record<string, string> = {
    Authorization: `Bearer ${token || 'local-owner-token'}`,
    'x-owner-token': token || 'local-owner-token',
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
        isChecking: false,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
