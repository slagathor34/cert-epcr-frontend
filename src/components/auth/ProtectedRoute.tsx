import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, RolePermissions } from '../../types/auth';


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requiredPermission,
  fallback
}: ProtectedRouteProps): React.ReactElement | null => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
        }}
      >
        <img 
          src="/sfd-logo.png" 
          alt="Sacramento Fire CERT Logo"
          style={{ 
            width: '80px', 
            height: '80px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '8px',
            marginBottom: '24px'
          }}
        />
        <CircularProgress size={40} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="body1" sx={{ color: 'white' }}>
          Loading Sacramento Fire CERT ePCR System...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user account is active
  if (!user.isActive) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
          color: 'white',
          textAlign: 'center',
          p: 4
        }}
      >
        <img 
          src="/sfd-logo.png" 
          alt="Sacramento Fire CERT Logo"
          style={{ 
            width: '80px', 
            height: '80px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '8px',
            marginBottom: '24px'
          }}
        />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Account Inactive
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 400 }}>
          Your account has been deactivated. Please contact your system administrator 
          to reactivate your access to the Sacramento Fire CERT ePCR system.
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Contact: admin@sacfire.cert
        </Typography>
      </Box>
    );
  }

  // Check role-based access
  if (requiredRole) {
    const roleHierarchy: UserRole[] = ['viewer', 'trainee', 'responder', 'supervisor', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    
    if (userRoleIndex < requiredRoleIndex) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
            color: 'white',
            textAlign: 'center',
            p: 4
          }}
        >
          <img 
            src="/sfd-logo.png" 
            alt="Sacramento Fire CERT Logo"
            style={{ 
              width: '80px', 
              height: '80px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '8px',
              marginBottom: '24px'
            }}
          />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 400 }}>
            You don't have sufficient permissions to access this resource. 
            This area requires {requiredRole} level access or higher.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Your current role: {user.role}
          </Typography>
        </Box>
      );
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const userPermissions = RolePermissions[user.role] || [];
    const hasPermission = (userPermissions as readonly string[]).includes(requiredPermission);
    if (!hasPermission) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
            color: 'white',
            textAlign: 'center',
            p: 4
          }}
        >
          <img 
            src="/sfd-logo.png" 
            alt="Sacramento Fire CERT Logo"
            style={{ 
              width: '80px', 
              height: '80px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '8px',
              marginBottom: '24px'
            }}
          />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Permission Denied
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 400 }}>
            You don't have the required permission to access this feature: {requiredPermission}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Your current role: {user.role}
          </Typography>
        </Box>
      );
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

// Hook to check permissions
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = RolePermissions[user.role] || [];
    return (userPermissions as readonly string[]).includes(permission);
  };
  
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    const roleHierarchy: UserRole[] = ['viewer', 'trainee', 'responder', 'supervisor', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(role);
    return userRoleIndex >= requiredRoleIndex;
  };
  
  const canAccessRoute = (requiredRole?: UserRole, requiredPermission?: string): boolean => {
    if (requiredRole && !hasRole(requiredRole)) return false;
    if (requiredPermission && !hasPermission(requiredPermission)) return false;
    return true;
  };
  
  return {
    hasPermission,
    hasRole,
    canAccessRoute,
    userRole: user?.role,
    userPermissions: user ? RolePermissions[user.role] || [] : []
  };
};