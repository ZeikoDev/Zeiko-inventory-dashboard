import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { getTheme } from '../styles/theme';

const STORAGE_KEY = 'zeiko-color-mode';

interface ColorModeContextValue {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleColorMode: () => {},
});

// localStorage puede estar bloqueado (cookies deshabilitadas, iframes, etc.)
const safeGetStoredMode = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const safeStoreMode = (mode: PaletteMode) => {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // sin persistencia disponible; el toggle sigue funcionando en la sesión
  }
};

const getInitialMode = (): PaletteMode => {
  const stored = safeGetStoredMode();
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => {
          const next: PaletteMode = prev === 'dark' ? 'light' : 'dark';
          safeStoreMode(next);
          return next;
        }),
    }),
    [mode]
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
