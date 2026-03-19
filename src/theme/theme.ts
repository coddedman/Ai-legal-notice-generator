import { PaletteMode } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
          },
          primary: {
            main: '#1a237e', // Deep Indigo
            light: '#534bae',
            dark: '#000051',
          },
          secondary: {
            main: '#c5a059', // Antique Gold
            light: '#f7d188',
            dark: '#93722d',
          },
          success: {
            main: '#00796b',
          },
          error: {
            main: '#b71c1c',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
          },
          divider: 'rgba(0, 0, 0, 0.05)',
        }
      : {
          background: {
            default: '#0a0b10', // Deep Obsidian
            paper: '#12141c',
          },
          primary: {
            main: '#7986cb',
            light: '#9fa8da',
            dark: '#3f51b5',
          },
          secondary: {
            main: '#d4af37', // Gold
            light: '#f9e076',
            dark: '#996515',
          },
          success: {
            main: '#4db6ac',
          },
          error: {
            main: '#e57373',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
          },
          divider: 'rgba(255, 255, 255, 0.05)',
        }),
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "system-ui", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em', fontSize: '3.75rem', lineHeight: 1.1 },
    h2: { fontWeight: 800, letterSpacing: '-0.03em', fontSize: '2.75rem', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2rem' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600, fontSize: '0.925rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em', fontSize: '0.9rem' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 28px',
          borderRadius: 12,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: mode === 'dark' 
              ? '0px 10px 25px rgba(121, 134, 203, 0.25)'
              : '0px 10px 25px rgba(18, 24, 81, 0.15)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
        containedPrimary: {
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #7986cb 0%, #3f51b5 100%)'
            : 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#12141c' : '#ffffff',
          borderRadius: 24,
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: mode === 'dark' 
            ? '0 10px 40px -10px rgba(0,0,0,0.5)' 
            : '0 10px 40px -10px rgba(26, 35, 126, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s ease',
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.1)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },
});
