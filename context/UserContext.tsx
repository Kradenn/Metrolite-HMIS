import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  branch: string;
  loginCount: number;
  isShiftActive: boolean;
  isSuperuser: boolean;
  avatar?: string;
  theme: 'light' | 'dark';
}

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  logout: () => void;
  initials: string;
}

const DEFAULT_USER: UserProfile = {
  id: '898',
  name: 'John Doe Admin',
  email: 'admin@ultrahub.com',
  role: 'Administrator',
  designation: 'System Architect',
  branch: 'Nairobi Main',
  loginCount: 452,
  isShiftActive: true,
  isSuperuser: true,
  theme: (localStorage.getItem('ultrahub_theme') as 'light' | 'dark') || 'light',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  const setTheme = (theme: 'light' | 'dark') => {
    localStorage.setItem('ultrahub_theme', theme);
    setUser(prev => ({ ...prev, theme }));
  };

  const logout = () => {
    console.log('Logging out user:', user.id);
    window.location.href = '/'; 
  };

  const initials = useMemo(() => {
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, [user.name]);

  // Sync theme to body class for global CSS targeting
  useEffect(() => {
    const root = window.document.documentElement;
    if (user.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user.theme]);

  return (
    <UserContext.Provider value={{ user, setUser, setTheme, logout, initials }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};