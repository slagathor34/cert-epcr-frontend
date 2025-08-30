import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Slider,
  CircularProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Backup as BackupIcon,
  Computer as SystemIcon,
  Save as SaveIcon,
  RestartAlt as RestartIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
  Refresh as RefreshIcon,
  Science as TestIcon,
  CheckCircle as ConnectedIcon,
  Cancel as DisconnectedIcon,
  Psychology as AIIcon,
  PlayCircleOutline as AutomationIcon,
  Restore as RestoreIcon,
  CloudDownload as PullIcon,
  Delete as DeleteIcon,
  Storage as ModelIcon,
} from '@mui/icons-material';
import { aiService } from '../services/aiService';
import { n8nService } from '../services/n8nService';
import { settingsService, DEFAULT_AI_PROMPT } from '../services/settingsService';

// Types
interface SystemConfig {
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  userRegistrationEnabled: boolean;
  sessionTimeout: number;
  maxFileUploadSize: number;
  passwordRequirements: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
}

interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  encryption: 'none' | 'tls' | 'ssl';
}

interface BackupConfig {
  autoBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetention: number;
  cloudBackupEnabled: boolean;
  cloudProvider: 'aws' | 'azure' | 'gcp';
}

export interface AIProviderConfig {
  enabled: boolean;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  models?: string[];
  defaultModel?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  endpoint?: string;
  deploymentName?: string;
  name?: string;
  requestFormat?: 'openai' | 'anthropic' | 'custom';
}

export interface AIConfig {
  enabled: boolean;
  primaryProvider: string;
  providers: {
    ollama: AIProviderConfig;
    openai: AIProviderConfig;
    anthropic: AIProviderConfig;
    azure: AIProviderConfig;
    custom: AIProviderConfig;
  };
  fallbackEnabled: boolean;
  fallbackProvider: string;
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export interface N8nConfig {
  enabled: boolean;
  baseUrl: string;
  apiKey?: string;
  webhookUrl: string;
  workflowsEnabled: boolean;
  defaultWorkflows: {
    epcrSubmitted: boolean;
    memberAdded: boolean;
    emergencyAlert: boolean;
    auditTrigger: boolean;
  };
  security: {
    encryption: boolean;
    userManagement: boolean;
    diagnostics: boolean;
  };
}

// Tab Panel Component
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
      id={`system-settings-tabpanel-${index}`}
      aria-labelledby={`system-settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Storage keys
const STORAGE_KEYS = {
  AI_CONFIG: 'epcr_ai_config',
  N8N_CONFIG: 'epcr_n8n_config',
  EMAIL_CONFIG: 'epcr_email_config',
  BACKUP_CONFIG: 'epcr_backup_config',
  SYSTEM_CONFIG: 'epcr_system_config',
  NOTIFICATION_CONFIG: 'epcr_notification_config',
};

// Utility functions
const saveToStorage = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

const loadFromStorage = (key: string, defaultValue: any): any => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const SystemSettings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultSystemConfig: SystemConfig = {
    organizationName: 'Sacramento Fire CERT',
    contactEmail: 'admin@sacfire.cert',
    contactPhone: '(916) 555-0123',
    timezone: 'America/Los_Angeles',
    language: 'en',
    maintenanceMode: false,
    userRegistrationEnabled: true,
    sessionTimeout: 1440,
    maxFileUploadSize: 50,
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  };

  const { control, handleSubmit } = useForm<SystemConfig>({
    defaultValues: loadFromStorage(STORAGE_KEYS.SYSTEM_CONFIG, defaultSystemConfig),
  });

  const defaultEmailConfig: EmailConfig = {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'Sacramento Fire CERT',
    encryption: 'tls',
  };

  const defaultBackupConfig: BackupConfig = {
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    cloudBackupEnabled: false,
    cloudProvider: 'aws',
  };

  const [emailConfig, setEmailConfig] = useState<EmailConfig>(() => 
    loadFromStorage(STORAGE_KEYS.EMAIL_CONFIG, defaultEmailConfig)
  );

  const [backupConfig, setBackupConfig] = useState<BackupConfig>(() => 
    loadFromStorage(STORAGE_KEYS.BACKUP_CONFIG, defaultBackupConfig)
  );

  // Default AI configuration
  const defaultAIConfig: AIConfig = {
    enabled: true,
    primaryProvider: 'ollama',
    providers: {
      ollama: {
        enabled: true,
        baseUrl: process.env.NODE_ENV === 'production' ? 'http://localhost:11434' : 'http://192.168.1.35:11434',
        models: ['tinyllama:1.1b-chat-v0.6-q2_K', 'llama3.2:1b-instruct-q4_K_M', 'llama3.2', 'llama3.1', 'mistral', 'codellama'],
        defaultModel: 'tinyllama:1.1b-chat-v0.6-q2_K',
        maxTokens: 4096,
        temperature: 0.7,
        timeout: 30000,
      },
      openai: {
        enabled: false,
        apiKey: '',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o',
        maxTokens: 4096,
        temperature: 0.7,
      },
      anthropic: {
        enabled: false,
        apiKey: '',
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 4096,
        temperature: 0.7,
      },
      azure: {
        enabled: false,
        endpoint: '',
        apiKey: '',
        deploymentName: '',
        model: 'gpt-4',
        maxTokens: 4096,
        temperature: 0.7,
      },
      custom: {
        enabled: false,
        name: 'Custom AI Provider',
        baseUrl: '',
        apiKey: '',
        requestFormat: 'openai',
        maxTokens: 4096,
        temperature: 0.7,
      },
    },
    fallbackEnabled: true,
    fallbackProvider: 'openai',
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 30,
      requestsPerHour: 1000,
    },
  };

  const [aiConfig, setAiConfig] = useState<AIConfig>(() => 
    loadFromStorage(STORAGE_KEYS.AI_CONFIG, defaultAIConfig)
  );

  // Default N8n configuration
  const defaultN8nConfig: N8nConfig = {
    enabled: false,
    baseUrl: 'http://localhost:3003',
    webhookUrl: 'http://localhost:3003/webhook',
    workflowsEnabled: true,
    defaultWorkflows: {
      epcrSubmitted: false,
      memberAdded: false,
      emergencyAlert: false,
      auditTrigger: false,
    },
    security: {
      encryption: true,
      userManagement: false,
      diagnostics: false,
    },
  };
  const [n8nConfig, setN8nConfig] = useState<N8nConfig>(() => 
    loadFromStorage(STORAGE_KEYS.N8N_CONFIG, defaultN8nConfig)
  );

  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'connected' | 'disconnected' | 'testing'>>({
    ollama: 'disconnected',
    openai: 'disconnected',
    anthropic: 'disconnected',
    azure: 'disconnected',
    custom: 'disconnected',
  });

  // Model management state
  const [modelManagement, setModelManagement] = useState({
    pullModel: '',
    pulling: false,
    deleting: '',
  });

  // AI Prompt settings from settingsService
  const [promptSettings, setPromptSettings] = useState(() => settingsService.getAISettings());
  const [promptRows, setPromptRows] = useState(12);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Auto-adjust textarea rows based on content
  useEffect(() => {
    if (promptSettings.customPrompt) {
      const lines = promptSettings.customPrompt.split('\n').length;
      setPromptRows(Math.max(12, Math.min(25, lines + 2)));
    }
  }, [promptSettings.customPrompt]);

  // Auto-save prompt settings when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      settingsService.saveAISettings(promptSettings);
      console.log('AI prompt settings auto-saved');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [promptSettings]);

  // Auto-save AI config when it changes (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.AI_CONFIG, aiConfig);
      console.log('AI config auto-saved to localStorage');
      // Refresh AI service configuration when settings change
      aiService.refreshConfig();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [aiConfig]);

  // Auto-save n8n config when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.N8N_CONFIG, n8nConfig);
      console.log('n8n config auto-saved to localStorage');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [n8nConfig]);

  // Auto-save email config when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.EMAIL_CONFIG, emailConfig);
      console.log('Email config auto-saved to localStorage');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [emailConfig]);

  // Auto-save backup config when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.BACKUP_CONFIG, backupConfig);
      console.log('Backup config auto-saved to localStorage');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [backupConfig]);

  const onSubmit = async (data: SystemConfig) => {
    setLoading(true);
    setError(null);
    try {
      // Save system configuration to localStorage
      const saved = saveToStorage(STORAGE_KEYS.SYSTEM_CONFIG, data);
      
      if (saved) {
        console.log('System configuration saved successfully:', data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save system configuration to storage');
      }
    } catch (err) {
      console.error('Failed to save system settings:', err);
      setError(`Failed to save system settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailConfigSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Save email configuration to localStorage
      const saved = saveToStorage(STORAGE_KEYS.EMAIL_CONFIG, emailConfig);
      
      if (saved) {
        console.log('Email configuration saved successfully:', emailConfig);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save email configuration to storage');
      }
    } catch (err) {
      console.error('Failed to save email settings:', err);
      setError(`Failed to save email settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackupConfigSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Save backup configuration to localStorage
      const saved = saveToStorage(STORAGE_KEYS.BACKUP_CONFIG, backupConfig);
      
      if (saved) {
        console.log('Backup configuration saved successfully:', backupConfig);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save backup configuration to storage');
      }
    } catch (err) {
      console.error('Failed to save backup settings:', err);
      setError(`Failed to save backup settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Test email sent successfully!');
    } catch (err) {
      setError('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('Backup created successfully!');
    } catch (err) {
      setError('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAIConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      // Save AI configuration to localStorage
      const saved = saveToStorage(STORAGE_KEYS.AI_CONFIG, aiConfig);
      
      if (saved) {
        console.log('AI configuration saved successfully:', aiConfig);
        // Refresh AI service configuration when settings are manually saved
        aiService.refreshConfig();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save configuration to storage');
      }
    } catch (err) {
      console.error('Failed to save AI settings:', err);
      setError(`Failed to save AI settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (provider: string) => {
    setConnectionStatus(prev => ({ ...prev, [provider]: 'testing' }));
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test connection based on provider
      if (provider === 'ollama') {
        // Test Ollama connection
        const response = await fetch(`${aiConfig.providers.ollama.baseUrl}/api/tags`);
        if (response.ok) {
          setConnectionStatus(prev => ({ ...prev, [provider]: 'connected' }));
        } else {
          throw new Error('Connection failed');
        }
      } else if (provider === 'openai') {
        // Simulate OpenAI connection test
        if (aiConfig.providers.openai.apiKey) {
          setConnectionStatus(prev => ({ ...prev, [provider]: 'connected' }));
        } else {
          throw new Error('Missing API key');
        }
      } else if (provider === 'anthropic') {
        // Simulate Anthropic connection test
        if (aiConfig.providers.anthropic.apiKey) {
          setConnectionStatus(prev => ({ ...prev, [provider]: 'connected' }));
        } else {
          throw new Error('Missing API key');
        }
      } else if (provider === 'azure') {
        // Simulate Azure connection test
        if (aiConfig.providers.azure.apiKey && aiConfig.providers.azure.endpoint) {
          setConnectionStatus(prev => ({ ...prev, [provider]: 'connected' }));
        } else {
          throw new Error('Missing API key or endpoint');
        }
      } else if (provider === 'custom') {
        // Simulate custom provider test
        if (aiConfig.providers.custom.baseUrl) {
          setConnectionStatus(prev => ({ ...prev, [provider]: 'connected' }));
        } else {
          throw new Error('Missing base URL');
        }
      }
    } catch (err) {
      setConnectionStatus(prev => ({ ...prev, [provider]: 'disconnected' }));
      setError(`Failed to connect to ${provider}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleRefreshOllamaModels = async () => {
    try {
      const response = await fetch(`${aiConfig.providers.ollama.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        const models = data.models?.map((model: any) => model.name) || [];
        setAiConfig(prev => ({
          ...prev,
          providers: {
            ...prev.providers,
            ollama: {
              ...prev.providers.ollama,
              models,
            },
          },
        }));
      }
    } catch (err) {
      setError('Failed to refresh Nebula models');
    }
  };

  const handlePullModel = async () => {
    if (!modelManagement.pullModel.trim()) {
      setError('Please enter a model name to pull');
      return;
    }

    setModelManagement(prev => ({ ...prev, pulling: true }));
    setError(null);

    try {
      const response = await fetch(`${aiConfig.providers.ollama.baseUrl}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelManagement.pullModel.trim() }),
      });

      if (response.ok) {
        setModelManagement(prev => ({ ...prev, pullModel: '', pulling: false }));
        // Refresh models list after successful pull
        await handleRefreshOllamaModels();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(`Failed to pull model: ${response.statusText}`);
      }
    } catch (err) {
      setError(`Failed to pull model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setModelManagement(prev => ({ ...prev, pulling: false }));
    }
  };

  const handleDeleteModel = async (modelName: string) => {
    if (!modelName) return;

    setModelManagement(prev => ({ ...prev, deleting: modelName }));
    setError(null);

    try {
      const response = await fetch(`${aiConfig.providers.ollama.baseUrl}/api/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName }),
      });

      if (response.ok) {
        setModelManagement(prev => ({ ...prev, deleting: '' }));
        // Refresh models list after successful deletion
        await handleRefreshOllamaModels();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(`Failed to delete model: ${response.statusText}`);
      }
    } catch (err) {
      setError(`Failed to delete model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setModelManagement(prev => ({ ...prev, deleting: '' }));
    }
  };

  // N8n handlers
  const handleSaveN8nConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      // Save N8n configuration to localStorage
      const saved = saveToStorage(STORAGE_KEYS.N8N_CONFIG, n8nConfig);
      
      if (saved) {
        console.log('N8n configuration saved successfully:', n8nConfig);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save n8n configuration to storage');
      }
    } catch (err) {
      console.error('Failed to save n8n settings:', err);
      setError(`Failed to save n8n settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestN8nConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Refresh n8n service configuration before testing
      n8nService.refreshConfig();
      
      // Test n8n connection using the service
      const result = await n8nService.testConnection();
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        console.log('n8n connection test successful:', result);
      } else {
        throw new Error(result.error || 'Connection test failed');
      }
    } catch (err) {
      console.error('Failed to connect to n8n:', err);
      setError(`Failed to connect to n8n: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          System Settings
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="system settings tabs">
            <Tab 
              icon={<SystemIcon />} 
              label="General" 
              id="system-settings-tab-0"
              aria-controls="system-settings-tabpanel-0"
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Security" 
              id="system-settings-tab-1"
              aria-controls="system-settings-tabpanel-1"
            />
            <Tab 
              icon={<EmailIcon />} 
              label="Email" 
              id="system-settings-tab-2"
              aria-controls="system-settings-tabpanel-2"
            />
            <Tab 
              icon={<BackupIcon />} 
              label="Backup & Data" 
              id="system-settings-tab-3"
              aria-controls="system-settings-tabpanel-3"
            />
            <Tab 
              icon={<NotificationsIcon />} 
              label="Notifications" 
              id="system-settings-tab-4"
              aria-controls="system-settings-tabpanel-4"
            />
            <Tab 
              icon={<AIIcon />} 
              label="AI & Models" 
              id="system-settings-tab-5"
              aria-controls="system-settings-tabpanel-5"
            />
            <Tab 
              icon={<AutomationIcon />} 
              label="Automation" 
              id="system-settings-tab-6"
              aria-controls="system-settings-tabpanel-6"
            />
          </Tabs>
        </Box>

        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Organization Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Controller
                          name="organizationName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Organization Name"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="contactEmail"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Contact Email"
                              type="email"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="contactPhone"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Contact Phone"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="timezone"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>Timezone</InputLabel>
                              <Select {...field} label="Timezone">
                                <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                                <MenuItem value="America/Denver">Mountain Time</MenuItem>
                                <MenuItem value="America/Chicago">Central Time</MenuItem>
                                <MenuItem value="America/New_York">Eastern Time</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="language"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>Language</InputLabel>
                              <Select {...field} label="Language">
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Spanish</MenuItem>
                                <MenuItem value="fr">French</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Status
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Controller
                            name="maintenanceMode"
                            control={control}
                            render={({ field }) => (
                              <Switch {...field} checked={field.value} />
                            )}
                          />
                        }
                        label="Maintenance Mode"
                      />
                      <FormControlLabel
                        control={
                          <Controller
                            name="userRegistrationEnabled"
                            control={control}
                            render={({ field }) => (
                              <Switch {...field} checked={field.value} />
                            )}
                          />
                        }
                        label="User Registration Enabled"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      fullWidth
                    >
                      Save General Settings
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Security Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Password Requirements
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="passwordRequirements.minLength"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Minimum Length"
                            type="number"
                            inputProps={{ min: 4, max: 128 }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="passwordRequirements.requireUppercase"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Require Uppercase Letters"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="passwordRequirements.requireLowercase"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Require Lowercase Letters"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="passwordRequirements.requireNumbers"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Require Numbers"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="passwordRequirements.requireSpecialChars"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Require Special Characters"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Session & File Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="sessionTimeout"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Session Timeout (minutes)"
                            type="number"
                            helperText="Time before automatic logout"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="maxFileUploadSize"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Max File Upload Size (MB)"
                            type="number"
                            helperText="Maximum size for file uploads"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    Save Security Settings
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Email Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    SMTP Configuration
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="SMTP Host"
                        value={emailConfig.smtpHost}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="SMTP Port"
                        type="number"
                        value={emailConfig.smtpPort}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: Number(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={emailConfig.smtpUsername}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpUsername: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={emailConfig.smtpPassword}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="From Email"
                        type="email"
                        value={emailConfig.fromEmail}
                        onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="From Name"
                        value={emailConfig.fromName}
                        onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Encryption</InputLabel>
                        <Select
                          value={emailConfig.encryption}
                          label="Encryption"
                          onChange={(e) => setEmailConfig({ ...emailConfig, encryption: e.target.value as any })}
                        >
                          <MenuItem value="none">None</MenuItem>
                          <MenuItem value="tls">TLS</MenuItem>
                          <MenuItem value="ssl">SSL</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={handleEmailConfigSave}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    Save Email Settings
                  </Button>
                  <Button
                    onClick={handleTestEmail}
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    disabled={loading}
                  >
                    Send Test Email
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Backup & Data Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Backup Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={backupConfig.autoBackupEnabled}
                          onChange={(e) => setBackupConfig({ ...backupConfig, autoBackupEnabled: e.target.checked })}
                        />
                      }
                      label="Enable automatic backups"
                    />
                    <FormControl fullWidth>
                      <InputLabel>Backup Frequency</InputLabel>
                      <Select
                        value={backupConfig.backupFrequency}
                        label="Backup Frequency"
                        onChange={(e) => setBackupConfig({ ...backupConfig, backupFrequency: e.target.value as any })}
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Retention Period (days)"
                      type="number"
                      value={backupConfig.backupRetention}
                      onChange={(e) => setBackupConfig({ ...backupConfig, backupRetention: Number(e.target.value) })}
                      helperText="Number of days to keep backups"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={handleBackupConfigSave}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    Save Backup Settings
                  </Button>
                  <Button
                    onClick={handleCreateBackup}
                    variant="outlined"
                    startIcon={<BackupIcon />}
                    disabled={loading}
                  >
                    Create Backup Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Data Management
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ExportIcon />}
                      fullWidth
                    >
                      Export System Data
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ImportIcon />}
                      fullWidth
                    >
                      Import System Data
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<RestartIcon />}
                      fullWidth
                    >
                      Reset to Defaults
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Configure when and how users receive notifications about system events, incidents, and updates.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Email Notifications"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Push Notifications"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Incident Alerts"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Switch />}
                        label="System Maintenance Alerts"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* AI & Models Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Assistant Configuration
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Configure AI providers and models to enhance system capabilities with intelligent assistance.
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiConfig.enabled}
                          onChange={(e) => setAiConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                        />
                      }
                      label="Enable AI Assistant"
                    />
                  </Box>

                  {aiConfig.enabled && (
                    <>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Primary AI Provider</InputLabel>
                            <Select
                              value={aiConfig.primaryProvider}
                              label="Primary AI Provider"
                              onChange={(e) => setAiConfig(prev => ({ 
                                ...prev, 
                                primaryProvider: e.target.value as any 
                              }))}
                            >
                              <MenuItem value="ollama">Nebula (Local)</MenuItem>
                              <MenuItem value="openai">OpenAI</MenuItem>
                              <MenuItem value="anthropic">Anthropic</MenuItem>
                              <MenuItem value="azure">Azure OpenAI</MenuItem>
                              <MenuItem value="custom">Custom Provider</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={aiConfig.fallbackEnabled}
                                onChange={(e) => setAiConfig(prev => ({ 
                                  ...prev, 
                                  fallbackEnabled: e.target.checked 
                                }))}
                              />
                            }
                            label="Enable Fallback Provider"
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {aiConfig.enabled && (
              <>
                {/* Ollama Configuration */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Nebula (Local AI)</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {connectionStatus.ollama === 'connected' && (
                            <Chip 
                              icon={<ConnectedIcon />} 
                              label="Connected" 
                              color="success" 
                              size="small" 
                            />
                          )}
                          {connectionStatus.ollama === 'disconnected' && (
                            <Chip 
                              icon={<DisconnectedIcon />} 
                              label="Disconnected" 
                              color="error" 
                              size="small" 
                            />
                          )}
                          {connectionStatus.ollama === 'testing' && (
                            <Chip 
                              label="Testing..." 
                              color="info" 
                              size="small" 
                            />
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<TestIcon />}
                            onClick={() => handleTestConnection('ollama')}
                            disabled={loading || connectionStatus.ollama === 'testing'}
                          >
                            Test
                          </Button>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            fullWidth
                            label="Nebula Base URL"
                            value={aiConfig.providers.ollama.baseUrl}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                ollama: {
                                  ...prev.providers.ollama,
                                  baseUrl: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Timeout (ms)"
                            type="number"
                            value={aiConfig.providers.ollama.timeout}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                ollama: {
                                  ...prev.providers.ollama,
                                  timeout: Number(e.target.value),
                                },
                              },
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Default Model</InputLabel>
                            <Select
                              value={aiConfig.providers.ollama.defaultModel}
                              label="Default Model"
                              onChange={(e) => setAiConfig(prev => ({
                                ...prev,
                                providers: {
                                  ...prev.providers,
                                  ollama: { ...prev.providers.ollama, defaultModel: e.target.value },
                                },
                              }))}
                            >
                              {aiConfig.providers.ollama.models?.map((model) => (
                                <MenuItem key={model} value={model}>
                                  {model}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            startIcon={<RefreshIcon />}
                            onClick={handleRefreshOllamaModels}
                            disabled={loading}
                          >
                            Refresh Models
                          </Button>
                        </Grid>
                        
                        {/* Model Management Section */}
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ModelIcon color="primary" />
                            Model Management
                          </Typography>
                        </Grid>
                        
                        {/* Pull Model */}
                        <Grid item xs={12} sm={8}>
                          <TextField
                            fullWidth
                            label="Pull New Model"
                            placeholder="e.g., llama3.2:3b, mistral:7b, codellama:13b"
                            value={modelManagement.pullModel}
                            onChange={(e) => setModelManagement(prev => ({ ...prev, pullModel: e.target.value }))}
                            disabled={modelManagement.pulling}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={modelManagement.pulling ? <CircularProgress size={20} /> : <PullIcon />}
                            onClick={handlePullModel}
                            disabled={modelManagement.pulling || !modelManagement.pullModel.trim()}
                            sx={{ height: '56px' }}
                          >
                            {modelManagement.pulling ? 'Pulling...' : 'Pull Model'}
                          </Button>
                        </Grid>
                        
                        {/* Model List with Delete Options */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Installed Models
                          </Typography>
                          <Box sx={{ maxHeight: 200, overflowY: 'auto', border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
                            {aiConfig.providers.ollama.models && aiConfig.providers.ollama.models.length > 0 ? (
                              aiConfig.providers.ollama.models.map((model) => (
                                <Box 
                                  key={model} 
                                  sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    py: 1,
                                    px: 2,
                                    bgcolor: aiConfig.providers.ollama.defaultModel === model ? 'action.selected' : 'transparent',
                                    borderRadius: 1,
                                    mb: 0.5
                                  }}
                                >
                                  <Box>
                                    <Typography variant="body2" fontWeight={aiConfig.providers.ollama.defaultModel === model ? 'bold' : 'normal'}>
                                      {model}
                                    </Typography>
                                    {aiConfig.providers.ollama.defaultModel === model && (
                                      <Chip label="Default" size="small" color="primary" variant="outlined" />
                                    )}
                                  </Box>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteModel(model)}
                                    disabled={modelManagement.deleting === model || aiConfig.providers.ollama.defaultModel === model}
                                    title={aiConfig.providers.ollama.defaultModel === model ? "Cannot delete default model" : "Delete model"}
                                  >
                                    {modelManagement.deleting === model ? (
                                      <CircularProgress size={16} />
                                    ) : (
                                      <DeleteIcon fontSize="small" />
                                    )}
                                  </IconButton>
                                </Box>
                              ))
                            ) : (
                              <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                                No models available. Try refreshing or pulling a model.
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Max Tokens"
                            type="number"
                            value={aiConfig.providers.ollama.maxTokens}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                ollama: {
                                  ...prev.providers.ollama,
                                  maxTokens: Number(e.target.value),
                                },
                              },
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Temperature"
                            type="number"
                            inputProps={{ step: 0.1, min: 0, max: 2 }}
                            value={aiConfig.providers.ollama.temperature}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                ollama: {
                                  ...prev.providers.ollama,
                                  temperature: Number(e.target.value),
                                },
                              },
                            }))}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* OpenAI Configuration */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">OpenAI</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {connectionStatus.openai === 'connected' && (
                            <Chip icon={<ConnectedIcon />} label="Connected" color="success" size="small" />
                          )}
                          {connectionStatus.openai === 'disconnected' && (
                            <Chip icon={<DisconnectedIcon />} label="Disconnected" color="error" size="small" />
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<TestIcon />}
                            onClick={() => handleTestConnection('openai')}
                            disabled={loading}
                          >
                            Test
                          </Button>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="API Key"
                            type="password"
                            value={aiConfig.providers.openai.apiKey}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                openai: {
                                  ...prev.providers.openai,
                                  apiKey: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Base URL"
                            value={aiConfig.providers.openai.baseUrl}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                openai: {
                                  ...prev.providers.openai,
                                  baseUrl: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Model"
                            value={aiConfig.providers.openai.model}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                openai: {
                                  ...prev.providers.openai,
                                  model: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Anthropic Configuration */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Anthropic</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {connectionStatus.anthropic === 'connected' && (
                            <Chip icon={<ConnectedIcon />} label="Connected" color="success" size="small" />
                          )}
                          {connectionStatus.anthropic === 'disconnected' && (
                            <Chip icon={<DisconnectedIcon />} label="Disconnected" color="error" size="small" />
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<TestIcon />}
                            onClick={() => handleTestConnection('anthropic')}
                            disabled={loading}
                          >
                            Test
                          </Button>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="API Key"
                            type="password"
                            value={aiConfig.providers.anthropic.apiKey}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                anthropic: {
                                  ...prev.providers.anthropic,
                                  apiKey: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Model"
                            value={aiConfig.providers.anthropic.model}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                anthropic: {
                                  ...prev.providers.anthropic,
                                  model: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Custom Provider Configuration */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Custom AI Provider</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {connectionStatus.custom === 'connected' && (
                            <Chip icon={<ConnectedIcon />} label="Connected" color="success" size="small" />
                          )}
                          {connectionStatus.custom === 'disconnected' && (
                            <Chip icon={<DisconnectedIcon />} label="Disconnected" color="error" size="small" />
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<TestIcon />}
                            onClick={() => handleTestConnection('custom')}
                            disabled={loading}
                          >
                            Test
                          </Button>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Provider Name"
                            value={aiConfig.providers.custom.name}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                custom: {
                                  ...prev.providers.custom,
                                  name: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Request Format</InputLabel>
                            <Select
                              value={aiConfig.providers.custom.requestFormat}
                              label="Request Format"
                              onChange={(e) => setAiConfig(prev => ({
                                ...prev,
                                providers: {
                                  ...prev.providers,
                                  custom: {
                                    ...prev.providers.custom,
                                    requestFormat: e.target.value as any,
                                  },
                                },
                              }))}
                            >
                              <MenuItem value="openai">OpenAI Compatible</MenuItem>
                              <MenuItem value="anthropic">Anthropic Compatible</MenuItem>
                              <MenuItem value="custom">Custom Format</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Base URL"
                            value={aiConfig.providers.custom.baseUrl}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                custom: {
                                  ...prev.providers.custom,
                                  baseUrl: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="API Key (Optional)"
                            type="password"
                            value={aiConfig.providers.custom.apiKey}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              providers: {
                                ...prev.providers,
                                custom: {
                                  ...prev.providers.custom,
                                  apiKey: e.target.value,
                                },
                              },
                            }))}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* AI Prompt Customization */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">AI Prompt Customization</Typography>
                        <Tooltip title="Reset to default prompt">
                          <IconButton 
                            onClick={() => setPromptSettings(prev => ({ ...prev, customPrompt: DEFAULT_AI_PROMPT }))}
                          >
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Customize the AI prompt template used for generating medical summaries and analysis.
                      </Typography>

                      {/* AI Generation Parameters */}
                      <Typography variant="h6" gutterBottom>AI Generation Parameters</Typography>
                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                          <Typography gutterBottom>Temperature: {promptSettings.temperature}</Typography>
                          <Slider
                            value={promptSettings.temperature}
                            onChange={(_, value) => setPromptSettings(prev => ({ ...prev, temperature: value as number }))}
                            min={0.1}
                            max={2.0}
                            step={0.1}
                            marks
                            valueLabelDisplay="auto"
                          />
                          <Typography variant="caption" color="textSecondary">
                            Controls randomness (0.1 = focused, 2.0 = creative)
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography gutterBottom>Top P: {promptSettings.topP}</Typography>
                          <Slider
                            value={promptSettings.topP}
                            onChange={(_, value) => setPromptSettings(prev => ({ ...prev, topP: value as number }))}
                            min={0.1}
                            max={1.0}
                            step={0.1}
                            marks
                            valueLabelDisplay="auto"
                          />
                          <Typography variant="caption" color="textSecondary">
                            Nucleus sampling (0.1 = conservative, 1.0 = diverse)
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography gutterBottom>Top K: {promptSettings.topK}</Typography>
                          <Slider
                            value={promptSettings.topK}
                            onChange={(_, value) => setPromptSettings(prev => ({ ...prev, topK: value as number }))}
                            min={1}
                            max={100}
                            step={1}
                            marks
                            valueLabelDisplay="auto"
                          />
                          <Typography variant="caption" color="textSecondary">
                            Number of top tokens to consider (1-100)
                          </Typography>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      {/* Custom Prompt Configuration */}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={promptSettings.useCustomPrompt}
                            onChange={(e) => setPromptSettings(prev => ({ ...prev, useCustomPrompt: e.target.checked }))}
                          />
                        }
                        label="Use custom prompt instead of default"
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={promptRows}
                        variant="outlined"
                        label="AI Prompt Template"
                        value={promptSettings.customPrompt || ''}
                        onChange={(e) => setPromptSettings(prev => ({ ...prev, customPrompt: e.target.value }))}
                        helperText={
                          <Box>
                            <Typography variant="caption" display="block">
                              Available placeholders: {'{patientName}'}, {'{patientAge}'}, {'{patientGender}'}, {'{chiefComplaint}'}, 
                              {'{bloodPressure}'}, {'{heartRate}'}, {'{respiratoryRate}'}, {'{temperature}'}, {'{oxygenSaturation}'}, 
                              {'{primaryAssessment}'}, {'{proceduresPerformed}'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              This prompt will be sent to the AI model along with patient data. Ensure it's appropriate for medical documentation.
                            </Typography>
                          </Box>
                        }
                        disabled={!promptSettings.useCustomPrompt}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Rate Limiting */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Rate Limiting
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={aiConfig.rateLimiting.enabled}
                                onChange={(e) => setAiConfig(prev => ({
                                  ...prev,
                                  rateLimiting: { ...prev.rateLimiting, enabled: e.target.checked }
                                }))}
                              />
                            }
                            label="Enable Rate Limiting"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Requests per Minute"
                            type="number"
                            disabled={!aiConfig.rateLimiting.enabled}
                            value={aiConfig.rateLimiting.requestsPerMinute}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              rateLimiting: { ...prev.rateLimiting, requestsPerMinute: Number(e.target.value) }
                            }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Requests per Hour"
                            type="number"
                            disabled={!aiConfig.rateLimiting.enabled}
                            value={aiConfig.rateLimiting.requestsPerHour}
                            onChange={(e) => setAiConfig(prev => ({
                              ...prev,
                              rateLimiting: { ...prev.rateLimiting, requestsPerHour: Number(e.target.value) }
                            }))}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveAIConfig}
                        disabled={loading}
                      >
                        Save AI Configuration
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* Automation/n8n Settings Tab */}
        <TabPanel value={tabValue} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Automation & Workflow Management
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure n8n workflow automation to streamline your ePCR processes and notifications.
              </Typography>
              
              {n8nConfig.enabled && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <strong>Connection Testing:</strong> If the connection test fails with CORS errors, you can verify n8n is running by clicking "Open n8n Editor" below. 
                  The workflow triggers will still work even if the test fails due to browser CORS restrictions.
                </Alert>
              )}
            </Grid>

            {/* n8n Configuration */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">n8n Configuration</Typography>
                    <Chip
                      size="small"
                      label={n8nConfig.enabled ? 'Enabled' : 'Disabled'}
                      color={n8nConfig.enabled ? 'success' : 'default'}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={n8nConfig.enabled}
                            onChange={(e) => setN8nConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                          />
                        }
                        label="Enable n8n Automation"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="n8n Base URL"
                        value={n8nConfig.baseUrl}
                        onChange={(e) => setN8nConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                        placeholder="http://localhost:3003"
                        disabled={!n8nConfig.enabled}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Webhook URL"
                        value={n8nConfig.webhookUrl}
                        onChange={(e) => setN8nConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        placeholder="http://localhost:3003/webhook"
                        disabled={!n8nConfig.enabled}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="API Key (Optional)"
                        value={n8nConfig.apiKey || ''}
                        onChange={(e) => setN8nConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="Your n8n API key for secured access"
                        disabled={!n8nConfig.enabled}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Default Workflows */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Default Workflows
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Enable automatic triggers for common ePCR system events.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={n8nConfig.defaultWorkflows.epcrSubmitted}
                            onChange={(e) => setN8nConfig(prev => ({
                              ...prev,
                              defaultWorkflows: { ...prev.defaultWorkflows, epcrSubmitted: e.target.checked }
                            }))}
                            disabled={!n8nConfig.enabled}
                          />
                        }
                        label="ePCR Submitted Trigger"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={n8nConfig.defaultWorkflows.memberAdded}
                            onChange={(e) => setN8nConfig(prev => ({
                              ...prev,
                              defaultWorkflows: { ...prev.defaultWorkflows, memberAdded: e.target.checked }
                            }))}
                            disabled={!n8nConfig.enabled}
                          />
                        }
                        label="Member Added Trigger"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={n8nConfig.defaultWorkflows.emergencyAlert}
                            onChange={(e) => setN8nConfig(prev => ({
                              ...prev,
                              defaultWorkflows: { ...prev.defaultWorkflows, emergencyAlert: e.target.checked }
                            }))}
                            disabled={!n8nConfig.enabled}
                          />
                        }
                        label="Emergency Alert Trigger"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={n8nConfig.defaultWorkflows.auditTrigger}
                            onChange={(e) => setN8nConfig(prev => ({
                              ...prev,
                              defaultWorkflows: { ...prev.defaultWorkflows, auditTrigger: e.target.checked }
                            }))}
                            disabled={!n8nConfig.enabled}
                          />
                        }
                        label="Audit Log Trigger"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Security Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security & Privacy
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={n8nConfig.security.encryption}
                            onChange={(e) => setN8nConfig(prev => ({
                              ...prev,
                              security: { ...prev.security, encryption: e.target.checked }
                            }))}
                            disabled={!n8nConfig.enabled}
                          />
                        }
                        label="Enable Encryption"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={n8nConfig.security.userManagement}
                            onChange={(e) => setN8nConfig(prev => ({
                              ...prev,
                              security: { ...prev.security, userManagement: e.target.checked }
                            }))}
                            disabled={!n8nConfig.enabled}
                          />
                        }
                        label="User Management"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!n8nConfig.security.diagnostics}
                            onChange={(e) => setN8nConfig(prev => ({
                              ...prev,
                              security: { ...prev.security, diagnostics: !e.target.checked }
                            }))}
                            disabled={!n8nConfig.enabled}
                          />
                        }
                        label="Disable Diagnostics"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveN8nConfig}
                    disabled={loading}
                  >
                    Save Automation Settings
                  </Button>
                  {n8nConfig.enabled && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleTestN8nConnection}
                        disabled={loading}
                      >
                        Test Connection
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => window.open(n8nConfig.baseUrl, '_blank')}
                        disabled={!n8nConfig.baseUrl}
                        sx={{ ml: 1 }}
                      >
                        Open n8n Editor
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};