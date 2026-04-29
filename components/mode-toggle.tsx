'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all flex items-center justify-center shadow-sm"
      aria-label="Alternar modo Escuro/Claro"
    >
      {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
