import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  User, 
  AuthState, 
  AuthContextType, 
  LoginCredentials, 
  RegisterData 
} from '../types/auth';
import { authService, initializeAuthSystem } from '../services/authService';

// Auth reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? state.error : null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('=== AuthContext Initialization ===');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Initialize auth system with default users
        console.log('Calling initializeAuthSystem...');
        await initializeAuthSystem();
        
        // Check for existing session
        const token = localStorage.getItem('cert_epcr_token');
        const user = await authService.getCurrentUser();
        console.log('Found token:', !!token);
        console.log('Found user:', user);
        
        // Additional debug info
        console.log('All localStorage keys:', Object.keys(localStorage));
        console.log('cert_epcr_users exists:', !!localStorage.getItem('cert_epcr_users'));
        console.log('cert_epcr_current_user exists:', !!localStorage.getItem('cert_epcr_current_user'));
        
        if (token && user && user.isActive) {
          console.log('User is valid and active, logging in...');
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, token } 
          });
          console.log('LOGIN_SUCCESS dispatched');
        } else if (token) {
          console.log('Token exists but user is invalid, clearing...');
          // Clear invalid token
          await authService.logout();
        } else {
          console.log('No valid session found');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
      } finally {
        console.log('Auth initialization complete');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token
  useEffect(() => {
    if (state.isAuthenticated && state.token) {
      const refreshInterval = setInterval(async () => {
        try {
          const response = await authService.refreshToken(state.token!);
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user: response.user, token: response.token } 
          });
        } catch (error) {
          console.error('Token refresh failed:', error);
          dispatch({ type: 'LOGOUT' });
        }
      }, 30 * 60 * 1000); // Refresh every 30 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [state.isAuthenticated, state.token]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    console.log('AuthContext login called with:', credentials);
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      console.log('Calling authService.login...');
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
      console.log('Login success dispatched');
    } catch (error) {
      console.log('Login error caught:', error);
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const loginWithProvider = async (provider: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // In a real implementation, you would integrate with OAuth providers
      // For demo, we'll simulate the flow
      const mockToken = `mock_${provider}_token_${Date.now()}`;
      const response = await authService.loginWithProvider(provider, mockToken);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : `${provider} login failed`;
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authService.register(data);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) throw new Error('No user logged in');
    
    try {
      const updatedUser = await authService.updateProfile(state.user.id, updates);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!state.user) throw new Error('No user logged in');
    
    try {
      await authService.changePassword(state.user.id, currentPassword, newPassword);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password change failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await authService.resetPassword(email);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const linkProvider = async (provider: string): Promise<void> => {
    if (!state.user) throw new Error('No user logged in');
    
    try {
      // In a real implementation, you would handle OAuth flow
      const mockToken = `mock_${provider}_token_${Date.now()}`;
      await authService.linkProvider(state.user.id, provider, mockToken);
      
      // Refresh user data
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : `Failed to link ${provider}`;
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const unlinkProvider = async (provider: string): Promise<void> => {
    if (!state.user) throw new Error('No user logged in');
    
    try {
      await authService.unlinkProvider(state.user.id, provider);
      
      // Refresh user data
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : `Failed to unlink ${provider}`;
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const refreshToken = async (): Promise<void> => {
    if (!state.token) throw new Error('No token available');
    
    try {
      const response = await authService.refreshToken(state.token);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    loginWithProvider,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    linkProvider,
    unlinkProvider,
    refreshToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};