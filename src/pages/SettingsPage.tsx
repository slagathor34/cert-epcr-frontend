import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Slider,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Psychology as AIIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { settingsService, AISettings, DEFAULT_AI_PROMPT } from '../services/settingsService';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [aiSettings, setAiSettings] = useState<AISettings>(settingsService.getAISettings());
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promptRows, setPromptRows] = useState(12);

  useEffect(() => {
    // Auto-adjust textarea rows based on content
    if (aiSettings.customPrompt) {
      const lines = aiSettings.customPrompt.split('\n').length;
      setPromptRows(Math.max(12, Math.min(25, lines + 2)));
    }
  }, [aiSettings.customPrompt]);

  const handleSaveSettings = () => {
    try {
      settingsService.saveAISettings(aiSettings);
      setSuccess('Settings saved successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      setSuccess(null);
    }
  };

  const handleResetToDefaults = () => {
    const defaultSettings = {
      useCustomPrompt: false,
      customPrompt: DEFAULT_AI_PROMPT,
      modelName: 'llama3.2:1b-instruct-q4_K_M',
      temperature: 0.7,
      topP: 0.9,
      topK: 40
    };
    setAiSettings(defaultSettings);
    setSuccess('Settings reset to defaults!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiSettings(prev => ({
      ...prev,
      customPrompt: event.target.value
    }));
  };

  const handleSettingChange = (key: keyof AISettings, value: any) => {
    setAiSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <SettingsIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            System Settings
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* AI Configuration */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <AIIcon color="primary" />
              <Typography variant="h6">AI Summary Configuration</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ollama Service URL"
                    value={aiSettings.ollamaUrl || ''}
                    onChange={(e) => handleSettingChange('ollamaUrl', e.target.value)}
                    helperText="URL of your Ollama service (e.g., http://192.168.1.35:11434)"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Model Name"
                    value={aiSettings.modelName}
                    onChange={(e) => handleSettingChange('modelName', e.target.value)}
                    helperText="Ollama model to use for AI generation"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* AI Parameters */}
            <Typography variant="h6" gutterBottom>AI Generation Parameters</Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Temperature: {aiSettings.temperature}</Typography>
                <Slider
                  value={aiSettings.temperature}
                  onChange={(_, value) => handleSettingChange('temperature', value)}
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
                <Typography gutterBottom>Top P: {aiSettings.topP}</Typography>
                <Slider
                  value={aiSettings.topP}
                  onChange={(_, value) => handleSettingChange('topP', value)}
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
                <Typography gutterBottom>Top K: {aiSettings.topK}</Typography>
                <Slider
                  value={aiSettings.topK}
                  onChange={(_, value) => handleSettingChange('topK', value as number)}
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

            {/* Custom Prompt */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Custom AI Prompt</Typography>
              <Box>
                <Tooltip title="Reset to default prompt">
                  <IconButton onClick={() => handleSettingChange('customPrompt', DEFAULT_AI_PROMPT)}>
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={aiSettings.useCustomPrompt}
                  onChange={(e) => handleSettingChange('useCustomPrompt', e.target.checked)}
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
              value={aiSettings.customPrompt || ''}
              onChange={handlePromptChange}
              helperText={
                <Box>
                  <Typography variant="caption" display="block">
                    Available placeholders: {"{patientName}"}, {"{patientAge}"}, {"{patientGender}"}, {"{chiefComplaint}"}, 
                    {"{bloodPressure}"}, {"{heartRate}"}, {"{respiratoryRate}"}, {"{temperature}"}, {"{oxygenSaturation}"}, 
                    {"{primaryAssessment}"}, {"{proceduresPerformed}"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    This prompt will be sent to the AI model along with patient data. Ensure it's appropriate for medical documentation.
                  </Typography>
                </Box>
              }
              disabled={!aiSettings.useCustomPrompt}
              sx={{ mb: 2 }}
            />
          </AccordionDetails>
        </Accordion>

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="space-between" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestoreIcon />}
              onClick={handleResetToDefaults}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};