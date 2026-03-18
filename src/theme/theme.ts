import { PaletteMode } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
          },
          primary: {
            main: '#4f46e5',
            light: '#6366f1',
            dark: '#3730a3',
          },
          secondary: {
            main: '#7c3aed',
            light: '#8b5cf6',
            dark: '#5b21b6',
          },
          success: {
            main: '#059669',
          },
          error: {
            main: '#dc2626',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
          },
          divider: 'rgba(0, 0, 0, 0.08)',
        }
      : {
          // palette values for dark mode
          background: {
            default: '#0f1115',
            paper: '#1e2128',
          },
          primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
          },
          secondary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
          },
          success: {
            main: '#10b981',
          },
          error: {
            main: '#ef4444',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
          },
          divider: 'rgba(255, 255, 255, 0.08)',
        }),
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '3.5rem' },
    h2: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '2.5rem' },
    h3: { fontWeight: 600, fontSize: '2rem' },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          padding: '10px 24px',
          '&:hover': {
            boxShadow: mode === 'dark' 
              ? '0px 0px 20px rgba(99, 102, 241, 0.4)'
              : '0px 4px 14px rgba(79, 70, 229, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            backdropFilter: 'blur(10px)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&.Mui-focused': {
              boxShadow: mode === 'dark' ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : '0 0 0 2px rgba(79, 70, 229, 0.2)',
            },
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#1e2128' : '#ffffff',
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});
