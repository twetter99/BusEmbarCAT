'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { mockUsers, demoCredentials } from '@/lib/data';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ user: User | null; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie helpers
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// This is a mock authentication provider. In a real application,
// this would be replaced with a real authentication service.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from a previous session (cookie or sessionStorage)
    const checkUser = () => {
      setLoading(true);
      try {
        // First check cookie (for "remember me")
        const cookieUser = getCookie('demo_auth');
        if (cookieUser) {
          const parsed = JSON.parse(cookieUser);
          setUser(parsed);
          setLoading(false);
          return;
        }
        
        // Then check sessionStorage (for session-only login)
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from storage", error);
        sessionStorage.removeItem('user');
        deleteCookie('demo_auth');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{ user: User | null; error?: string }> => {
    setLoading(true);
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate credentials
        const credential = demoCredentials[email.toLowerCase()];
        
        if (!credential) {
          setLoading(false);
          resolve({ user: null, error: "No s'ha trobat l'usuari amb aquest correu." });
          return;
        }
        
        if (credential.password !== password) {
          setLoading(false);
          resolve({ user: null, error: "La contrasenya és incorrecta." });
          return;
        }
        
        const foundUser = mockUsers.find(u => u.id === credential.userId);
        if (foundUser) {
          setUser(foundUser);
          
          // Store based on rememberMe preference
          if (rememberMe) {
            setCookie('demo_auth', JSON.stringify(foundUser), 30); // 30 days
          } else {
            sessionStorage.setItem('user', JSON.stringify(foundUser));
          }
          
          resolve({ user: foundUser });
        } else {
          resolve({ user: null, error: "Error intern: usuari no trobat." });
        }
        setLoading(false);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    deleteCookie('demo_auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
