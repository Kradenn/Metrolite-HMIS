
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  description?: string;
  isDark: boolean;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textMuted: string;
    border: string;
    inputBg: string;
    inputBorder: string;
    accent: string;
  };
}

const themes: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Default (Enterprise)',
    description: 'The standard UltraHub HMIS interface.',
    isDark: false,
    colors: {
      primary: '#2563eb', // blue-600
      primaryHover: '#1d4ed8', // blue-700
      secondary: '#475569', // slate-600
      background: '#f4f7f6',
      surface: '#ffffff',
      surfaceHover: '#f8fafc',
      text: '#1e293b', // slate-800
      textMuted: '#64748b', // slate-500
      border: '#e2e8f0', // slate-200
      inputBg: '#ffffff',
      inputBorder: '#d1d5db',
      accent: '#ec4899', // mch color
    }
  },
  light: {
    id: 'light',
    name: 'Clean Light',
    description: 'A high-contrast light theme for bright environments.',
    isDark: false,
    colors: {
      primary: '#0f172a', // slate-900
      primaryHover: '#000000',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      text: '#000000',
      textMuted: '#475569',
      border: '#cbd5e1',
      inputBg: '#ffffff',
      inputBorder: '#94a3b8',
      accent: '#2563eb',
    }
  },
  dark: {
    id: 'dark',
    name: 'Midnight Dark',
    description: 'Easy on the eyes for night shifts.',
    isDark: true,
    colors: {
      primary: '#3b82f6', // blue-500
      primaryHover: '#60a5fa',
      secondary: '#94a3b8',
      background: '#020617', // slate-950
      surface: '#0f172a', // slate-900
      surfaceHover: '#1e293b',
      text: '#f1f5f9', // slate-100
      textMuted: '#94a3b8',
      border: '#1e293b',
      inputBg: '#1e293b',
      inputBorder: '#334155',
      accent: '#ec4899',
    }
  },
  classic: {
    id: 'classic',
    name: 'Classic HMIS',
    description: 'Traditional medical software aesthetic.',
    isDark: false,
    colors: {
      primary: '#0056b3',
      primaryHover: '#004494',
      secondary: '#6c757d',
      background: '#e9ecef',
      surface: '#ffffff',
      surfaceHover: '#f1f3f5',
      text: '#212529',
      textMuted: '#6c757d',
      border: '#dee2e6',
      inputBg: '#ffffff',
      inputBorder: '#ced4da',
      accent: '#28a745',
    }
  }
};

interface ThemeContextType {
  activeTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
  installTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('app-theme') || 'default';
  });
  const [customThemes, setCustomThemes] = useState<Record<string, Theme>>({});

  const allThemes = { ...themes, ...customThemes };
  const activeTheme = allThemes[activeThemeId] || themes.default;

  useEffect(() => {
    localStorage.setItem('app-theme', activeThemeId);
    applyTheme(activeTheme);
  }, [activeThemeId, activeTheme]);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    const body = document.body;

    // Apply CSS Variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Handle Dark Mode Class
    if (theme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set data-theme attribute for CSS targeting
    root.setAttribute('data-theme', theme.id);
  };

  const setTheme = (themeId: string) => {
    if (allThemes[themeId]) {
      setActiveThemeId(themeId);
    }
  };

  const installTheme = (theme: Theme) => {
    setCustomThemes(prev => ({ ...prev, [theme.id]: theme }));
  };

  return (
    <ThemeContext.Provider value={{ 
      activeTheme, 
      setTheme, 
      availableThemes: Object.values(allThemes),
      installTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
