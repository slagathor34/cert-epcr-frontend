export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  badgeNumber?: string;
  certificationLevel: CertificationLevel;
  certificationExpiry?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
  phoneNumber?: string;
  emergencyContact?: EmergencyContact;
  preferences: UserPreferences;
  federatedProviders: FederatedProvider[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  autoSaveInterval: number; // in seconds
  defaultFormView: 'simple' | 'advanced' | 'pdf';
}

export interface FederatedProvider {
  provider: 'google' | 'facebook' | 'microsoft' | 'apple' | 'github';
  providerId: string;
  email: string;
  connectedAt: string;
}

export type UserRole = 'admin' | 'supervisor' | 'responder' | 'trainee' | 'viewer';

export type CertificationLevel = 'EMR' | 'EMT' | 'AEMT' | 'Paramedic' | 'First Aid' | 'CPR';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  department?: string;
  badgeNumber?: string;
  certificationLevel: CertificationLevel;
  certificationExpiry?: string;
  phoneNumber?: string;
  emergencyContact?: EmergencyContact;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithProvider: (provider: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  linkProvider: (provider: string) => Promise<void>;
  unlinkProvider: (provider: string) => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface AuthApiResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Role permissions
export const RolePermissions = {
  admin: [
    'manage_users',
    'view_all_reports',
    'edit_all_reports',
    'delete_reports',
    'manage_system_settings',
    'view_analytics',
    'export_data',
    'manage_certifications'
  ],
  supervisor: [
    'view_team_reports',
    'edit_team_reports',
    'view_analytics',
    'export_team_data',
    'review_reports',
    'manage_team_certifications'
  ],
  responder: [
    'create_reports',
    'edit_own_reports',
    'view_own_reports',
    'export_own_reports',
    'update_profile'
  ],
  trainee: [
    'create_reports',
    'view_own_reports',
    'update_profile'
  ],
  viewer: [
    'view_assigned_reports',
    'update_profile'
  ]
} as const;

export type Permission = typeof RolePermissions[keyof typeof RolePermissions][number];

// Certification levels with scope of practice
export const CertificationScopes = {
  'First Aid': ['basic_care', 'wound_care', 'cpr'],
  'CPR': ['cardiopulmonary_resuscitation', 'aed'],
  'EMR': ['basic_care', 'wound_care', 'cpr', 'aed', 'oxygen_therapy', 'basic_splinting'],
  'EMT': ['basic_care', 'wound_care', 'cpr', 'aed', 'oxygen_therapy', 'splinting', 'spinal_immobilization', 'basic_airway'],
  'AEMT': ['basic_care', 'wound_care', 'cpr', 'aed', 'oxygen_therapy', 'splinting', 'spinal_immobilization', 'advanced_airway', 'iv_therapy', 'basic_medications'],
  'Paramedic': ['basic_care', 'wound_care', 'cpr', 'aed', 'oxygen_therapy', 'splinting', 'spinal_immobilization', 'advanced_airway', 'iv_therapy', 'medications', 'cardiac_monitoring', 'advanced_procedures']
} as const;

// Federated login providers configuration
export const FederatedProviders = {
  google: {
    name: 'Google',
    icon: 'Google',
    color: '#4285f4',
    scopes: ['email', 'profile']
  },
  facebook: {
    name: 'Facebook',
    icon: 'Facebook',
    color: '#1877f2',
    scopes: ['email', 'public_profile']
  },
  microsoft: {
    name: 'Microsoft',
    icon: 'Microsoft',
    color: '#0078d4',
    scopes: ['User.Read']
  },
  apple: {
    name: 'Apple',
    icon: 'Apple',
    color: '#000000',
    scopes: ['name', 'email']
  },
  github: {
    name: 'GitHub',
    icon: 'GitHub',
    color: '#24292e',
    scopes: ['user:email', 'read:user']
  }
} as const;