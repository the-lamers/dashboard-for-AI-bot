import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7B1FA2'
    },
    secondary: {
      main: '#00E676'
    },
    background: {
      default: '#0A0A0A',
      paper: 'rgba(255, 255, 255, 0.07)'
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#BDBDBD'
    }
  },
  typography: {
    fontFamily: "'Poppins', 'Inter', sans-serif",
    h6: {
      fontWeight: 700,
      fontSize: '1.5rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.7rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.6)'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'transparent',
          backgroundImage: 'none',
          backdropFilter: 'blur(6px)',
          transition: 'background 0.3s ease'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(10px)'
        }
      }
    }
  }
});

export default theme;
