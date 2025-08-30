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
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon, 
  Add as AddIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Group as GroupIcon,
  Inventory as LogisticsIcon,
  EventNote as PlanningIcon,
  LocalHospital as MedicalIcon,
  Security as OperationsIcon,
} from '@mui/icons-material';
import { ChatBot } from '../ui/ChatBot';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../auth/ProtectedRoute';


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

  // TEMPORARY: Create a mock user for development when no user is authenticated
  const mockUser = user || {
    id: 'dev-user',
    firstName: 'Dev',
    lastName: 'User',
    email: 'dev@sacfire.cert',
    role: 'admin' as const,
    certificationLevel: 'Paramedic',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      theme: 'auto',
      language: 'en',
      timezone: 'America/Los_Angeles',
      emailNotifications: true,
      autoSaveInterval: 30,
      defaultFormView: 'advanced'
    },
    federatedProviders: []
  };

  if (!user && !mockUser) return null;

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
          {mockUser.firstName.charAt(0)}{mockUser.lastName.charAt(0)}
        </Avatar>
        <Box sx={{ textAlign: 'left', display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.2 }}>
            {mockUser.firstName} {mockUser.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1 }}>
            {mockUser.role} • {mockUser.certificationLevel}
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
              {mockUser.firstName.charAt(0)}{mockUser.lastName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {mockUser.firstName} {mockUser.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {mockUser.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              size="small"
              label={mockUser.role}
              color={getRoleColor(mockUser.role) as any}
              variant="filled"
            />
            <Chip
              size="small"
              label={mockUser.certificationLevel}
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

        <MenuItem onClick={() => handleNavigation('/members')}>
          <ListItemIcon>
            <GroupIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>CERT Members</ListItemText>
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
    if (path === '/dashboard') return [{ label: 'Unified Command Center', path: '/dashboard' }];
    if (path === '/medical') return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'Medical', path: '/medical' }
    ];
    if (path === '/logistics') return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'Logistics', path: '/logistics' }
    ];
    if (path === '/planning') return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'Planning', path: '/planning' }
    ];
    if (path === '/members') return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'CERT Members', path: '/members' }
    ];
    if (path === '/members/new') return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'CERT Members', path: '/members' },
      { label: 'Add Member', path: '/members/new' }
    ];
    if (path.includes('/members/') && path.includes('/edit')) return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'CERT Members', path: '/members' },
      { label: 'Edit Member', path: path }
    ];
    if (path.includes('/members/')) return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'CERT Members', path: '/members' },
      { label: 'Member Profile', path: path }
    ];
    if (path === '/epcr/new') return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'New Report', path: '/epcr/new' }
    ];
    if (path.includes('/epcr/') && path.includes('/edit')) return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'Edit Report', path: path }
    ];
    if (path.includes('/epcr/')) return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'View Report', path: path }
    ];
    if (path === '/admin/users') return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'User Management', path: '/admin/users' }
    ];
    if (path === '/admin/settings') return [
      { label: 'Unified Command Center', path: '/dashboard' },
      { label: 'System Settings', path: '/admin/settings' }
    ];
    return [{ label: 'Unified Command Center', path: '/dashboard' }];
  };

  return (
    <>
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
                    Command Center
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent' 
                }}
              >
                Command
              </Button>
              <Button
                color="inherit"
                startIcon={<MedicalIcon />}
                onClick={() => navigate('/medical')}
                sx={{ 
                  backgroundColor: location.pathname.startsWith('/medical') ? 'rgba(255,255,255,0.1)' : 'transparent' 
                }}
              >
                Medical
              </Button>
              <Button
                color="inherit"
                startIcon={<OperationsIcon />}
                onClick={() => navigate('/operations')}
                sx={{ 
                  backgroundColor: location.pathname.startsWith('/operations') ? 'rgba(255,255,255,0.1)' : 'transparent' 
                }}
              >
                Operations
              </Button>
              <Button
                color="inherit"
                startIcon={<LogisticsIcon />}
                onClick={() => navigate('/logistics')}
                sx={{ 
                  backgroundColor: location.pathname.startsWith('/logistics') ? 'rgba(255,255,255,0.1)' : 'transparent' 
                }}
              >
                Logistics
              </Button>
              <Button
                color="inherit"
                startIcon={<PlanningIcon />}
                onClick={() => navigate('/planning')}
                sx={{ 
                  backgroundColor: location.pathname.startsWith('/planning') ? 'rgba(255,255,255,0.1)' : 'transparent' 
                }}
              >
                Planning
              </Button>
              <Button
                color="inherit"
                startIcon={<GroupIcon />}
                onClick={() => navigate('/members')}
                sx={{ 
                  backgroundColor: location.pathname.startsWith('/members') ? 'rgba(255,255,255,0.1)' : 'transparent' 
                }}
              >
                Members
              </Button>
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={() => navigate('/epcr/new')}
                variant={location.pathname === '/epcr/new' ? 'outlined' : 'text'}
              >
                New Report
              </Button>
              <ThemeToggle />
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
                  CERT Command Center
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Incident Command and Control v14
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
    </>
  );
};