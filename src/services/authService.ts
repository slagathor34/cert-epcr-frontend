import { User, LoginCredentials, RegisterData, AuthApiResponse, FederatedProvider } from '../types/auth';

export interface AuthServiceInterface {
  login: (credentials: LoginCredentials) => Promise<AuthApiResponse>;
  loginWithProvider: (provider: string, token: string) => Promise<AuthApiResponse>;
  register: (data: RegisterData) => Promise<AuthApiResponse>;
  logout: () => Promise<void>;
  refreshToken: (token: string) => Promise<AuthApiResponse>;
  getCurrentUser: () => Promise<User | null>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<User>;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  linkProvider: (userId: string, provider: string, token: string) => Promise<void>;
  unlinkProvider: (userId: string, provider: string) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<User>;
}

// Mock implementation with localStorage for development
class MockAuthService implements AuthServiceInterface {
  private storageKey = 'cert_epcr_users';
  private tokenKey = 'cert_epcr_token';
  private currentUserKey = 'cert_epcr_current_user';

  private getUsersFromStorage(): User[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
      return [];
    }
  }

  private saveUsersToStorage(users: User[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
      throw new Error('Failed to save user data. Please try again.');
    }
  }

  private generateToken(): string {
    return btoa(JSON.stringify({
      timestamp: Date.now(),
      random: Math.random().toString(36).substring(2)
    }));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private hashPassword(password: string): string {
    // Simple hash for demo - use proper hashing in production
    return btoa(password + 'salt');
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  async login(credentials: LoginCredentials): Promise<AuthApiResponse> {
    console.log('Login attempt for:', credentials.email);
    const users = this.getUsersFromStorage();
    console.log('All users in storage:', users);
    console.log('Looking for user with email:', credentials.email.toLowerCase());
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found in storage');
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is disabled. Please contact administrator.');
    }

    // For demo purposes, we'll check if password exists in localStorage
    const storedPassword = localStorage.getItem(`pwd_${user.id}`);
    if (!storedPassword || !this.verifyPassword(credentials.password, storedPassword)) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    const updatedUser: User = {
      ...user,
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    this.saveUsersToStorage(updatedUsers);

    const token = this.generateToken();
    const authResponse: AuthApiResponse = {
      user: updatedUser,
      token,
      refreshToken: this.generateToken(),
      expiresIn: 86400 // 24 hours
    };

    // Store auth data
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));

    if (credentials.rememberMe) {
      localStorage.setItem('cert_epcr_remember', 'true');
    }

    return authResponse;
  }

  async loginWithProvider(provider: string, token: string): Promise<AuthApiResponse> {
    // Mock federated login - in production, verify token with provider
    const mockUserData = {
      email: `user@${provider}.com`,
      firstName: 'Federated',
      lastName: 'User',
      profilePicture: `https://via.placeholder.com/100?text=${provider.charAt(0).toUpperCase()}`
    };

    const users = this.getUsersFromStorage();
    let user = users.find(u => u.federatedProviders.some(fp => fp.provider === provider as any));

    if (!user) {
      // Create new user for federated login
      const newUser: User = {
        id: this.generateId(),
        email: mockUserData.email,
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        role: 'responder',
        certificationLevel: 'EMR',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profilePicture: mockUserData.profilePicture,
        preferences: {
          theme: 'auto',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          emailNotifications: true,
          autoSaveInterval: 30,
          defaultFormView: 'advanced'
        },
        federatedProviders: [{
          provider: provider as any,
          providerId: token,
          email: mockUserData.email,
          connectedAt: new Date().toISOString()
        }]
      };

      users.push(newUser);
      this.saveUsersToStorage(users);
      user = newUser;
    } else {
      // Update last login
      user.lastLogin = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
      const updatedUsers = users.map(u => u.id === user!.id ? user! : u);
      this.saveUsersToStorage(updatedUsers);
    }

    const authToken = this.generateToken();
    const authResponse: AuthApiResponse = {
      user,
      token: authToken,
      refreshToken: this.generateToken(),
      expiresIn: 86400
    };

    localStorage.setItem(this.tokenKey, authToken);
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));

    return authResponse;
  }

  async register(data: RegisterData): Promise<AuthApiResponse> {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const users = this.getUsersFromStorage();
    
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: this.generateId(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'responder',
      department: data.department,
      badgeNumber: data.badgeNumber,
      certificationLevel: data.certificationLevel,
      certificationExpiry: data.certificationExpiry,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phoneNumber: data.phoneNumber,
      emergencyContact: data.emergencyContact,
      preferences: {
        theme: 'auto',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        emailNotifications: true,
        autoSaveInterval: 30,
        defaultFormView: 'advanced'
      },
      federatedProviders: []
    };

    users.push(newUser);
    this.saveUsersToStorage(users);

    // Store password hash
    localStorage.setItem(`pwd_${newUser.id}`, this.hashPassword(data.password));

    const token = this.generateToken();
    const authResponse: AuthApiResponse = {
      user: newUser,
      token,
      refreshToken: this.generateToken(),
      expiresIn: 86400
    };

    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));

    return authResponse;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem('cert_epcr_remember');
  }

  async refreshToken(token: string): Promise<AuthApiResponse> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No current user');
    }

    const newToken = this.generateToken();
    const authResponse: AuthApiResponse = {
      user: currentUser,
      token: newToken,
      refreshToken: this.generateToken(),
      expiresIn: 86400
    };

    localStorage.setItem(this.tokenKey, newToken);
    return authResponse;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const stored = localStorage.getItem(this.currentUserKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = this.getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    this.saveUsersToStorage(users);

    // Update current user if it's the same user
    const currentUser = await this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));
    }

    return updatedUser;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const storedPassword = localStorage.getItem(`pwd_${userId}`);
    if (!storedPassword || !this.verifyPassword(currentPassword, storedPassword)) {
      throw new Error('Current password is incorrect');
    }

    localStorage.setItem(`pwd_${userId}`, this.hashPassword(newPassword));
  }

  async resetPassword(email: string): Promise<void> {
    const users = this.getUsersFromStorage();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('User not found');
    }

    // In production, this would send an email with reset link
    const tempPassword = Math.random().toString(36).slice(-8);
    localStorage.setItem(`pwd_${user.id}`, this.hashPassword(tempPassword));
    
    // Log the temporary password for demo purposes
    console.log(`Temporary password for ${email}: ${tempPassword}`);
    alert(`Temporary password for ${email}: ${tempPassword}\nPlease change it after logging in.`);
  }

  async linkProvider(userId: string, provider: string, token: string): Promise<void> {
    const users = this.getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const federatedProvider: FederatedProvider = {
      provider: provider as any,
      providerId: token,
      email: users[userIndex].email,
      connectedAt: new Date().toISOString()
    };

    users[userIndex].federatedProviders = users[userIndex].federatedProviders.filter(
      fp => fp.provider !== provider
    );
    users[userIndex].federatedProviders.push(federatedProvider);
    users[userIndex].updatedAt = new Date().toISOString();

    this.saveUsersToStorage(users);
  }

  async unlinkProvider(userId: string, provider: string): Promise<void> {
    const users = this.getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].federatedProviders = users[userIndex].federatedProviders.filter(
      fp => fp.provider !== provider
    );
    users[userIndex].updatedAt = new Date().toISOString();

    this.saveUsersToStorage(users);
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return this.getUsersFromStorage();
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = this.getUsersFromStorage();
    
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsersToStorage(users);

    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return this.updateProfile(userId, updates);
  }

  async deleteUser(userId: string): Promise<void> {
    const users = this.getUsersFromStorage();
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }

    this.saveUsersToStorage(filteredUsers);
    localStorage.removeItem(`pwd_${userId}`);
  }

  async toggleUserStatus(userId: string): Promise<User> {
    const users = this.getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].isActive = !users[userIndex].isActive;
    users[userIndex].updatedAt = new Date().toISOString();

    this.saveUsersToStorage(users);
    return users[userIndex];
  }
}

// Export the service instance
export const authService: AuthServiceInterface = new MockAuthService();

// Initialize with default admin user if no users exist
export const initializeAuthSystem = async (): Promise<void> => {
  console.log('Initializing auth system...');
  const users = await authService.getAllUsers();
  console.log('Current users in storage:', users);
  if (users.length === 0) {
    console.log('No users found, creating default admin...');
    const adminUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      email: 'admin@sacfire.cert',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      department: 'Sacramento Fire CERT',
      badgeNumber: 'ADMIN001',
      certificationLevel: 'Paramedic',
      isActive: true,
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

    const createdAdmin = await authService.createUser(adminUser);
    console.log('Admin user created successfully:', createdAdmin);
    
    // Set default password for admin
    localStorage.setItem(`pwd_${createdAdmin.id}`, btoa('cert22!@salt'));
    console.log('Password hash stored for admin user');
    
    console.log('Default admin user created:');
    console.log('Email: admin@sacfire.cert');
    console.log('Password: cert22!@');
    
    // Verify the user was saved
    const allUsersAfterCreation = await authService.getAllUsers();
    console.log('Users after admin creation:', allUsersAfterCreation);
  }
};