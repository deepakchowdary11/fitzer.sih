import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Always light mode

  useEffect(() => {
    // Always set light mode
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleTheme = () => {
    // Disabled - always stay in light mode
  };

  const theme = {
    isDarkMode: false, // Always false
    toggleTheme,
    colors: {
      // Light theme colors only - Clean and professional
      light: {
        bg: 'bg-white',
        bgSecondary: 'bg-gray-50',
        bgTertiary: 'bg-gray-100',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        border: 'border-gray-200',
        borderSecondary: 'border-gray-300',
        cardBg: 'bg-white',
        cardBgSecondary: 'bg-gray-50',
        cardBgHover: 'bg-gray-100',
        backdrop: 'bg-white/95',
        selection: 'selection:bg-blue-200',
        accent: 'text-blue-600',
        accentBg: 'bg-blue-50',
        accentRing: 'ring-blue-200',
        accentHover: 'hover:bg-blue-100',
        accentShadow: 'rgba(59, 130, 246, 0.3)',
        accentShadowStrong: 'rgba(59, 130, 246, 0.5)',
        accentShadowLight: 'rgba(59, 130, 246, 0.2)',
        accentTextShadow: 'rgba(59, 130, 246, 0.4)',
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
