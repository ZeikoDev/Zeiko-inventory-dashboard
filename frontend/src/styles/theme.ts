import { createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';

// Paleta sobria inspirada en admins de ecommerce (Shopify/Primer):
// neutros dominantes, un solo azul corporativo como acento, sin gradientes ni glows.
export const getTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark';

  const divider = isDark ? '#2d333b' : '#d8dee4';

  return createTheme({
    palette: {
      mode,
      primary: isDark
        ? { main: '#539bf5', light: '#6cb6ff', dark: '#316dca', contrastText: '#ffffff' }
        : { main: '#0b57d0', light: '#3b82f6', dark: '#0842a0', contrastText: '#ffffff' },
      secondary: isDark
        ? { main: '#909dab', light: '#adbac7', dark: '#768390', contrastText: '#0d1117' }
        : { main: '#57606a', light: '#6e7781', dark: '#424a53', contrastText: '#ffffff' },
      success: isDark
        ? { main: '#57ab5a', light: '#6bc46d', dark: '#347d39', contrastText: '#0d1117' }
        : { main: '#1a7f37', light: '#2da44e', dark: '#116329', contrastText: '#ffffff' },
      warning: isDark
        ? { main: '#c69026', light: '#daaa3f', dark: '#966600', contrastText: '#0d1117' }
        : { main: '#9a6700', light: '#bf8700', dark: '#7d4e00', contrastText: '#ffffff' },
      error: isDark
        ? { main: '#e5534b', light: '#f47067', dark: '#c93c37', contrastText: '#ffffff' }
        : { main: '#cf222e', light: '#e5534b', dark: '#a40e26', contrastText: '#ffffff' },
      info: isDark
        ? { main: '#539bf5', light: '#6cb6ff', dark: '#316dca', contrastText: '#ffffff' }
        : { main: '#0969da', light: '#218bff', dark: '#0550ae', contrastText: '#ffffff' },
      background: isDark
        ? { default: '#0d1117', paper: '#161b22' }
        : { default: '#f6f8fa', paper: '#ffffff' },
      text: isDark
        ? { primary: '#e6edf3', secondary: '#909dab' }
        : { primary: '#1f2328', secondary: '#59636e' },
      divider,
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${divider}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            border: 'none',
            borderBottom: `1px solid ${divider}`,
            boxShadow: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: isDark ? '#316dca' : '#0842a0',
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: divider,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#768390' : '#8c959f',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${divider}`,
          },
          head: {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isDark ? '#909dab' : '#59636e',
            backgroundColor: isDark ? '#1c2128' : '#f6f8fa',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:last-child td': {
              borderBottom: 'none',
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            border: `1px solid ${divider}`,
            boxShadow: isDark
              ? '0 16px 48px rgba(0, 0, 0, 0.5)'
              : '0 16px 48px rgba(31, 35, 40, 0.15)',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
    },
  });
};
