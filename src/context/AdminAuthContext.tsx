import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  token: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  authHeaders: Record<string, string>;
  isChecking: boolean;
  changePassword?: (newPassword: string) => Promise<{ success: boolean }>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  token: null,
  login: async () => ({ success: false }),
  logout: () => {},
  authHeaders: {},
  isChecking: true,
});

// SHA-256 hash of default owner password ('241816')
const DEFAULT_OWNER_HASH = '44dc9c103da1ca79d903af1f578da230fa53a10efffaca3bcfd9c9b43b39f38a';
const TOKEN_KEY = 'nexusmc_owner_token';
const CUSTOM_PWD_HASH_KEY = 'nexusmc_custom_pwd_hash';

async function hashPassword(input: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Sync token state
  useEffect(() => {
    if (token) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanPassword = password.trim();
      const inputHash = await hashPassword(cleanPassword);
      const customHash = localStorage.getItem(CUSTOM_PWD_HASH_KEY);

      const isValid =
        (customHash && inputHash === customHash) ||
        inputHash === DEFAULT_OWNER_HASH ||
        cleanPassword === '241816';

      if (!isValid) {
        return { success: false, error: 'Incorrect owner password.' };
      }

      const activeToken = 'client-owner-session';
      setToken(activeToken);
      setIsAdmin(true);
      localStorage.setItem(TOKEN_KEY, activeToken);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Authentication verification error.' };
    }
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem(TOKEN_KEY);
  };

  const changePassword = async (newPassword: string): Promise<{ success: boolean }> => {
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false };
    }
    const hash = await hashPassword(newPassword.trim());
    localStorage.setItem(CUSTOM_PWD_HASH_KEY, hash);
    return { success: true };
  };

  const authHeaders: Record<string, string> = token
    ? {
        Authorization: `Bearer ${token}`,
        'x-owner-token': token,
      }
    : {};

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        token,
        login,
        logout,
        authHeaders,
        isChecking,
        changePassword,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
