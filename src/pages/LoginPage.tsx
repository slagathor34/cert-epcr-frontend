import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  LocalHospital as MedicalIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginCredentials, RegisterData, FederatedProviders, CertificationLevel } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const LoginPage: React.FC = () => {
  const { login, loginWithProvider, register, resetPassword, isLoading, error, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug: Log auth state
  console.log('LoginPage - isAuthenticated:', isAuthenticated);
  console.log('LoginPage - user:', user);
  console.log('LoginPage - isLoading:', isLoading);
  
  // If already authenticated, redirect to intended location or dashboard
  React.useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      console.log('User is authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate, location]);
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const loginForm = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const registerForm = useForm<RegisterData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      department: '',
      badgeNumber: '',
      certificationLevel: 'EMR',
      phoneNumber: ''
    }
  });

  const handleLogin = async (data: LoginCredentials) => {
    console.log('Handle login called with:', data);
    try {
      await login(data);
      console.log('Login successful');
    } catch (err) {
      console.error('Login failed:', err);
      // Error is already handled by AuthContext
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      await register(data);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleFederatedLogin = async (provider: string) => {
    try {
      await loginWithProvider(provider);
    } catch (err) {
      console.error(`${provider} login failed:`, err);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(resetEmail);
      setResetPasswordOpen(false);
      setResetEmail('');
    } catch (err) {
      console.error('Password reset failed:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const federatedProviders = Object.entries(FederatedProviders);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Branding */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, color: 'white', mb: { xs: 4, md: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <img 
                  src="/sfd-logo.png" 
                  alt="Sacramento Fire CERT Logo"
                  style={{ 
                    width: '80px', 
                    height: '80px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    padding: '8px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                  }}
                />
                <Box>
                  <Typography variant="h3" component="h1" sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    lineHeight: 1.2,
                    mb: 1
                  }}>
                    CERT Command Center
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 400
                  }}>
                    Emergency Management System
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 400
              }}>
                Comprehensive emergency management platform for CERT teams. 
                Coordinate operations, manage resources, track medical records, and maintain team readiness.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                  Key Features:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicalIcon fontSize="small" /> Medical records and patient care
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BadgeIcon fontSize="small" /> Operations and incident management
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" /> Team coordination and logistics
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={24}
              sx={{ 
                p: 4,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" sx={{ 
                  fontWeight: 700,
                  color: '#1e3a8a',
                  mb: 1
                }}>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to access the command center
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                sx={{ mb: 2 }}
                variant="fullWidth"
              >
                <Tab label="Sign In" />
                <Tab label="Create Account" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                  <TextField
                    {...loginForm.register('email', { required: 'Email is required' })}
                    fullWidth
                    label="Email Address"
                    type="email"
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    error={!!loginForm.formState.errors.email}
                    helperText={loginForm.formState.errors.email?.message}
                  />

                  <TextField
                    {...loginForm.register('password', { required: 'Password is required' })}
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!loginForm.formState.errors.password}
                    helperText={loginForm.formState.errors.password?.message}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
                    <FormControlLabel
                      control={<Checkbox {...loginForm.register('rememberMe')} />}
                      label="Remember me"
                    />
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => setResetPasswordOpen(true)}
                      sx={{ textDecoration: 'none' }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      mt: 2,
                      mb: 3,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                      },
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                </form>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        {...registerForm.register('firstName', { required: 'First name is required' })}
                        fullWidth
                        label="First Name"
                        margin="normal"
                        variant="outlined"
                        error={!!registerForm.formState.errors.firstName}
                        helperText={registerForm.formState.errors.firstName?.message}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...registerForm.register('lastName', { required: 'Last name is required' })}
                        fullWidth
                        label="Last Name"
                        margin="normal"
                        variant="outlined"
                        error={!!registerForm.formState.errors.lastName}
                        helperText={registerForm.formState.errors.lastName?.message}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    {...registerForm.register('email', { required: 'Email is required' })}
                    fullWidth
                    label="Email Address"
                    type="email"
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    error={!!registerForm.formState.errors.email}
                    helperText={registerForm.formState.errors.email?.message}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        {...registerForm.register('password', { 
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={!!registerForm.formState.errors.password}
                        helperText={registerForm.formState.errors.password?.message}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...registerForm.register('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: (value) => value === registerForm.watch('password') || 'Passwords do not match'
                        })}
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={!!registerForm.formState.errors.confirmPassword}
                        helperText={registerForm.formState.errors.confirmPassword?.message}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        {...registerForm.register('department')}
                        fullWidth
                        label="Department"
                        margin="normal"
                        variant="outlined"
                        placeholder="e.g. Sacramento Fire"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...registerForm.register('badgeNumber')}
                        fullWidth
                        label="Badge Number"
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        {...registerForm.register('certificationLevel')}
                        fullWidth
                        select
                        label="Certification Level"
                        margin="normal"
                        variant="outlined"
                        SelectProps={{
                          native: true,
                        }}
                      >
                        {(['First Aid', 'CPR', 'EMR', 'EMT', 'AEMT', 'Paramedic'] as CertificationLevel[]).map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...registerForm.register('phoneNumber')}
                        fullWidth
                        label="Phone Number"
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                      },
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                </form>
              </TabPanel>

              {/* Federated Login */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Or continue with
                </Typography>
              </Divider>

              <Grid container spacing={2}>
                {federatedProviders.map(([key, provider]) => (
                  <Grid item xs={6} key={key}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleFederatedLogin(key)}
                      disabled={isLoading}
                      sx={{
                        py: 1.5,
                        borderColor: provider.color,
                        color: provider.color,
                        '&:hover': {
                          borderColor: provider.color,
                          backgroundColor: `${provider.color}10`,
                        },
                      }}
                    >
                      {provider.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                By signing in, you agree to our terms of service and privacy policy.
              </Typography>
              
              {/* Debug button - remove in production */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => {
                    console.log('=== MANUAL DEBUG ===');
                    console.log('LocalStorage contents:');
                    console.log('cert_epcr_users:', localStorage.getItem('cert_epcr_users'));
                    console.log('cert_epcr_token:', localStorage.getItem('cert_epcr_token'));
                    console.log('cert_epcr_current_user:', localStorage.getItem('cert_epcr_current_user'));
                    // Try to manually create admin
                    import('../services/authService').then(({ initializeAuthSystem }) => {
                      initializeAuthSystem().then(() => {
                        console.log('Manual init complete');
                        console.log('Users after init:', localStorage.getItem('cert_epcr_users'));
                      });
                    });
                  }}
                  sx={{ color: 'text.secondary' }}
                >
                  Debug: Check Auth System
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordOpen(false)}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};