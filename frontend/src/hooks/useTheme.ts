import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('navops_theme');
    return (saved as Theme) || 'dark'; // Dark as default as per initial screenshots
  });

  useEffect(() => {
    // Aplicar el tema al documento global
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('navops_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
