'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockDB } from '@/lib/db';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for mock session
    const savedUser = localStorage.getItem('beautyflow_mock_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async () => {
    // Simulate login
    const mockUser: User = {
      uid: 'mock-user-id',
      email: 'grafica.cjs@gmail.com',
      displayName: 'Dra. Poliana',
      photoURL: 'https://i.pravatar.cc/150?u=poliana'
    };
    setUser(mockUser);
    localStorage.setItem('beautyflow_mock_user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('beautyflow_mock_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
