import React from 'react';
import { UserRole } from '../../types/auth';

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
  // TEMPORARY: Complete bypass for debugging
  console.log('BYPASSING AUTHENTICATION - DEVELOPMENT MODE');
  return <>{children}</>;
};

// Hook to check permissions (simplified for debugging)
export const usePermissions = () => {
  const hasPermission = (permission: string): boolean => {
    return true; // Allow everything for debugging
  };
  
  const hasRole = (role: UserRole): boolean => {
    return true; // Allow everything for debugging
  };
  
  const canAccessRoute = (requiredRole?: UserRole, requiredPermission?: string): boolean => {
    return true; // Allow everything for debugging
  };
  
  return {
    hasPermission,
    hasRole,
    canAccessRoute,
    userRole: 'admin' as UserRole,
    userPermissions: []
  };
};