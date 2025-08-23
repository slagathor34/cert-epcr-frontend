import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  CssBaseline,
  Button,
  Breadcrumbs,
  Link,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon, 
  Add as AddIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { ChatBot } from '../ui/ChatBot';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../auth/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Navy blue - matches SFD Cert primary
      light: '#3b82f6', // Sky blue
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b', // Amber accent
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#000000',
    },
    background: {
      default: '#f8fafc', // Very light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937', // Dark gray
      secondary: '#6b7280',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1e3a8a',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1e3a8a',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1e3a8a',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1e3a8a',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1e3a8a',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#1e3a8a',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#1f2937',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#6b7280',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        filled: {
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    handleClose();
    navigate(path);
  };

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'supervisor': return 'warning';
      case 'responder': return 'primary';
      case 'trainee': return 'info';
      case 'viewer': return 'default';
      default: return 'default';
    }
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          textTransform: 'none',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          px: 2,
          py: 1
        }}
      >
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '0.875rem'
          }}
        >
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </Avatar>
        <Box sx={{ textAlign: 'left', display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.2 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1 }}>
            {user.role} • {user.certificationLevel}
          </Typography>
        </Box>
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              size="small"
              label={user.role}
              color={getRoleColor(user.role) as any}
              variant="filled"
            />
            <Chip
              size="small"
              label={user.certificationLevel}
              variant="outlined"
              color="primary"
            />
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem onClick={() => handleNavigation('/profile')}>
          <ListItemIcon>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile & Settings</ListItemText>
        </MenuItem>

        {hasPermission('manage_users') && (
          <MenuItem onClick={() => handleNavigation('/admin/users')}>
            <ListItemIcon>
              <AdminIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>User Management</ListItemText>
          </MenuItem>
        )}

        {hasPermission('manage_system_settings') && (
          <MenuItem onClick={() => handleNavigation('/admin/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>System Settings</ListItemText>
          </MenuItem>
        )}

        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') return [{ label: 'Dashboard', path: '/dashboard' }];
    if (path === '/epcr/new') return [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'New Report', path: '/epcr/new' }
    ];
    if (path.includes('/epcr/') && path.includes('/edit')) return [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Edit Report', path: path }
    ];
    if (path.includes('/epcr/')) return [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'View Report', path: path }
    ];
    return [{ label: 'Dashboard', path: '/dashboard' }];
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="sticky" elevation={1}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <img 
                  src="/sfd-logo.png" 
                  alt="Sacramento Fire CERT Logo"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '4px'
                  }}
                />
                <Box>
                  <Typography variant="h6" component="div" sx={{ 
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    lineHeight: 1.2,
                    color: 'white'
                  }}>
                    Sacramento Fire CERT
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    Electronic Patient Care Records
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent' 
                }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={() => navigate('/epcr/new')}
                variant={location.pathname === '/epcr/new' ? 'outlined' : 'text'}
              >
                New Report
              </Button>
              <UserMenu />
            </Box>
          </Toolbar>
          
          {/* Breadcrumbs */}
          {location.pathname !== '/dashboard' && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Breadcrumbs separator="›" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {getBreadcrumbs().map((breadcrumb, index) => (
                  <Link
                    key={index}
                    color="inherit"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(breadcrumb.path);
                    }}
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {breadcrumb.label}
                  </Link>
                ))}
              </Breadcrumbs>
            </Box>
          )}
        </AppBar>
        
        <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'grey.50' }}>
          {children}
        </Box>
        
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            borderTop: '3px solid #f59e0b',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Sacramento Fire CERT
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Electronic Patient Care Records System
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  © {new Date().getFullYear()} Sacramento Fire CERT
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  All rights reserved. Sacramento Fire Department
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Chat Bot */}
        <ChatBot />
      </Box>
    </ThemeProvider>
  );
};