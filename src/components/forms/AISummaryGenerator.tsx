import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  LinearProgress,
  Badge,
  Fade,
  Slide,
  Stack,
} from '@mui/material';
import {
  Psychology as AIIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  MedicalServices as MedicalIcon,
  Assignment as DiagnosisIcon,
  LocalHospital as TreatmentIcon,
  ReportProblem as ConcernIcon,
  MonitorHeart as MonitorIcon,
  PriorityHigh as UrgentIcon,
  Schedule as RoutineIcon,
  TrendingUp as ProbabilityIcon,
  Science as AnalysisIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import api from '../../services/api';
import { settingsService } from '../../services/settingsService';

interface DifferentialDiagnosis {
  diagnosis: string;
  rationale: string;
  probability?: 'high' | 'moderate' | 'low';
  icd10Code?: string;
  supportingFindings?: string[];
  contraindications?: string[];
}

interface TreatmentRecommendations {
  immediate: string[];
  urgent: string[];
  routine: string[];
}

interface AISummary {
  generatedAt: string;
  generatedBy: string;
  aiModel: string;
  aiService: string;
  clinicalSummary: string;
  differentialDiagnosis: DifferentialDiagnosis[];
  treatmentRecommendations: TreatmentRecommendations;
  clinicalConcerns: string[];
  providerNotes: string;
  isEdited: boolean;
  editedAt?: string;
  editedBy?: string;
  confidence?: number;
  processingTime?: number;
}

interface AISummaryGeneratorProps {
  epcrId: string;
  onSummaryGenerated?: (summary: AISummary) => void;
  onSummaryUpdated?: (summary: AISummary) => void;
}

export const AISummaryGenerator: React.FC<AISummaryGeneratorProps> = ({
  epcrId,
  onSummaryGenerated,
  onSummaryUpdated,
}) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [aiHealthStatus, setAiHealthStatus] = useState<'unknown' | 'healthy' | 'unavailable'>('unknown');
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Editable fields
  const [editableFields, setEditableFields] = useState({
    clinicalSummary: '',
    differentialDiagnosis: [] as DifferentialDiagnosis[],
    treatmentRecommendations: {
      immediate: [] as string[],
      urgent: [] as string[],
      routine: [] as string[],
    },
    clinicalConcerns: [] as string[],
    providerNotes: '',
  });

  useEffect(() => {
    checkAIHealth();
    loadExistingSummary();
  }, [epcrId]);

  const checkAIHealth = async () => {
    try {
      // Use direct axios call without auth interceptor for health check
      const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const response = await axios.get(`${BASE_URL}/ai-summary/health`);
      
      setAiHealthStatus(response.data.success ? 'healthy' : 'unavailable');
    } catch (error) {
      // Fallback: try to test the Ollama service directly using system settings
      try {
        const ollamaUrl = process.env.NODE_ENV === 'production' ? 'http://localhost:11434' : 'http://192.168.1.35:11434';
        const directResponse = await axios.get(`${ollamaUrl}/api/tags`, { timeout: 5000 });
        
        if (directResponse.status === 200) {
          setAiHealthStatus('healthy');
        } else {
          setAiHealthStatus('unavailable');
        }
      } catch (directError) {
        setAiHealthStatus('unavailable');
      }
    }
  };

  const loadExistingSummary = async () => {
    // Don't try to load AI summary for new records
    if (epcrId === 'new') {
      return;
    }
    
    try {
      // Load AI summary from ePCR record in localStorage
      const epcrData = localStorage.getItem(`epcr_record_${epcrId}`);
      if (epcrData) {
        const parsedData = JSON.parse(epcrData);
        
        if (parsedData.aiSummary) {
          // Convert EPCRData.aiSummary format to AISummary format
          const existingSummary: AISummary = {
            generatedAt: parsedData.aiSummary.generatedAt,
            generatedBy: parsedData.aiSummary.generatedBy,
            aiModel: parsedData.aiSummary.aiModel,
            aiService: parsedData.aiSummary.aiService,
            clinicalSummary: parsedData.aiSummary.clinicalSummary,
            differentialDiagnosis: parsedData.aiSummary.differentialDiagnosis,
            treatmentRecommendations: parsedData.aiSummary.treatmentRecommendations,
            clinicalConcerns: parsedData.aiSummary.clinicalConcerns,
            providerNotes: parsedData.aiSummary.providerNotes || '',
            isEdited: parsedData.aiSummary.isEdited,
            editedAt: parsedData.aiSummary.editedAt,
            editedBy: parsedData.aiSummary.editedBy,
            confidence: parsedData.aiSummary.confidence,
            processingTime: parsedData.aiSummary.processingTime
          };

          setSummary(existingSummary);
          setEditableFields({
            clinicalSummary: existingSummary.clinicalSummary,
            differentialDiagnosis: existingSummary.differentialDiagnosis,
            treatmentRecommendations: existingSummary.treatmentRecommendations,
            clinicalConcerns: existingSummary.clinicalConcerns,
            providerNotes: existingSummary.providerNotes,
          });

          console.log('Loaded existing AI summary from ePCR record');
        }
      }
    } catch (error: any) {
      console.error('Error loading existing summary from ePCR record:', error);
    }
  };

  const generateSummary = async () => {
    if (aiHealthStatus === 'unavailable') {
      setError('AI service is currently unavailable. Please check if Nebula is running.');
      return;
    }

    setLoading(true);
    setError(null);
    
    const startTime = Date.now();

    try {
      // Get the ePCR data from localStorage to send to Ollama
      const epcrData = localStorage.getItem(`epcr_record_${epcrId}`);
      if (!epcrData) {
        throw new Error('ePCR data not found. Please save the record first.');
      }

      const parsedData = JSON.parse(epcrData);
      
      // Get AI settings from settings service
      const aiSettings = settingsService.getAISettings();
      const ollamaUrl = aiSettings.ollamaUrl || (process.env.NODE_ENV === 'production' ? 'http://localhost:11434' : 'http://192.168.1.35:11434');
      
      // Create prompt using settings service
      let prompt: string;
      if (aiSettings.useCustomPrompt && aiSettings.customPrompt) {
        prompt = settingsService.interpolatePrompt(aiSettings.customPrompt, parsedData);
      } else {
        prompt = settingsService.interpolatePrompt(settingsService.getDefaultPrompt(), parsedData);
      }

      const ollamaResponse = await axios.post(`${ollamaUrl}/api/generate`, {
        model: aiSettings.modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: aiSettings.temperature,
          top_p: aiSettings.topP,
          top_k: aiSettings.topK
        }
      });

      if (ollamaResponse.data && ollamaResponse.data.response) {
        // Check if the response looks like it's returning the prompt instead of a proper AI response
        const responseText = ollamaResponse.data.response;
        const isPromptEcho = responseText.includes('You are a medical documentation assistant') ||
                             responseText.includes('MEDICAL TRAINING SCENARIO:') ||
                             responseText.includes('Please provide detailed educational clinical analysis') ||
                             responseText.includes('To analyze the patient care data');
        
        if (isPromptEcho) {
          throw new Error('AI service returned the prompt instead of generating a response. This may indicate a configuration issue with the AI model or insufficient context handling.');
        }

        // Parse the AI response
        let aiContent;
        try {
          // Try to extract JSON from the response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiContent = JSON.parse(jsonMatch[0]);
            
            // Validate that we have proper AI-generated content
            if (!aiContent.clinicalSummary || 
                aiContent.clinicalSummary.includes('You are a medical documentation assistant') ||
                aiContent.clinicalSummary.length < 50) {
              throw new Error('Invalid or incomplete AI response content');
            }
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (parseError) {
          // Check if the raw response is actually a valid clinical summary (not the prompt)
          if (!isPromptEcho && responseText.length > 20 && 
              !responseText.includes('You are a medical documentation assistant') &&
              !responseText.includes('Provide a brief clinical summary')) {
            
            // Clean the response text
            const cleanResponse = responseText
              .replace(/^(Patient:|Chief Complaint:|Vital Signs:).*$/gm, '') // Remove prompt echoing
              .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
              .replace(/^(Clinical Summary:|Summary:)/i, '') // Remove redundant headers
              .trim();
            
            if (cleanResponse.length > 10) {
              // Use the cleaned response as clinical summary
              aiContent = {
                clinicalSummary: cleanResponse,
                differentialDiagnosis: [
                  {
                    diagnosis: 'Clinical Assessment in Progress',
                    rationale: 'Based on current patient presentation and available clinical data',
                    probability: 'moderate'
                  }
                ],
                treatmentRecommendations: {
                  immediate: ['Continue patient monitoring', 'Maintain stable airway and circulation'],
                  urgent: ['Complete comprehensive assessment', 'Consider additional diagnostic measures'],
                  routine: ['Document all findings', 'Follow standard care protocols']
                },
                clinicalConcerns: ['Monitor for condition changes', 'Ensure thorough documentation']
              };
            } else {
              throw new Error('AI response was too short or contained no useful clinical information.');
            }
          } else {
            throw new Error('AI service failed to generate a proper clinical response. Please check the AI model configuration and try again.');
          }
        }

        const newSummary: AISummary = {
          ...aiContent,
          generatedAt: new Date().toISOString(),
          generatedBy: user?.firstName + ' ' + user?.lastName || 'AI System',
          aiModel: aiSettings.modelName,
          aiService: 'Nebula',
          isEdited: false,
          processingTime: Date.now() - startTime,
          confidence: 85,
          providerNotes: ''
        };
        
        setSummary(newSummary);
        setEditableFields({
          clinicalSummary: newSummary.clinicalSummary,
          differentialDiagnosis: newSummary.differentialDiagnosis,
          treatmentRecommendations: newSummary.treatmentRecommendations,
          clinicalConcerns: newSummary.clinicalConcerns,
          providerNotes: newSummary.providerNotes,
        });

        // Save AI summary to the ePCR record
        await saveAISummaryToRecord(newSummary, parsedData);

        setSuccess('AI summary generated and saved successfully!');
        setTimeout(() => setSuccess(null), 5000);

        if (onSummaryGenerated) {
          onSummaryGenerated(newSummary);
        }
      } else {
        throw new Error('No response from AI service');
      }
    } catch (error: any) {
      console.error('Error generating summary:', error);
      
      let errorMessage = 'Failed to generate AI summary. Please try again.';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to Nebula service. Please ensure Nebula is running.';
      } else if (error.message.includes('ePCR data not found')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = `AI service error: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setEditing(true);
    setError(null);
  };

  const cancelEditing = () => {
    if (summary) {
      setEditableFields({
        clinicalSummary: summary.clinicalSummary,
        differentialDiagnosis: summary.differentialDiagnosis,
        treatmentRecommendations: summary.treatmentRecommendations,
        clinicalConcerns: summary.clinicalConcerns,
        providerNotes: summary.providerNotes,
      });
    }
    setEditing(false);
  };

  const saveSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!summary) {
        throw new Error('No summary to save');
      }

      // Update the summary with edited fields
      const updatedSummary: AISummary = {
        ...summary,
        clinicalSummary: editableFields.clinicalSummary,
        differentialDiagnosis: editableFields.differentialDiagnosis,
        treatmentRecommendations: editableFields.treatmentRecommendations,
        clinicalConcerns: editableFields.clinicalConcerns,
        providerNotes: editableFields.providerNotes,
        isEdited: true,
        editedAt: new Date().toISOString(),
        editedBy: 'Current User' // TODO: Get actual user info
      };

      // Get current ePCR data
      const epcrData = localStorage.getItem(`epcr_record_${epcrId}`);
      if (!epcrData) {
        throw new Error('ePCR record not found');
      }
      const parsedData = JSON.parse(epcrData);

      // Save the updated AI summary to the ePCR record
      await saveAISummaryToRecord(updatedSummary, parsedData);

      setSummary(updatedSummary);
      setEditing(false);
      setSuccess('Summary updated and saved successfully!');
      setTimeout(() => setSuccess(null), 3000);

      if (onSummaryUpdated) {
        onSummaryUpdated(updatedSummary);
      }
    } catch (error: any) {
      console.error('Error saving summary:', error);
      setError(error.message || 'Failed to save summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const regenerateSummary = () => {
    setConfirmDialog(true);
  };

  const confirmRegeneration = () => {
    setConfirmDialog(false);
    setSummary(null);
    generateSummary();
  };

  const saveAISummaryToRecord = async (aiSummary: AISummary, epcrData: any) => {
    try {
      // Convert AISummary to the format expected by EPCRData.aiSummary
      const aiSummaryForEPCR = {
        generatedAt: aiSummary.generatedAt,
        generatedBy: aiSummary.generatedBy,
        aiModel: aiSummary.aiModel,
        aiService: aiSummary.aiService,
        clinicalSummary: aiSummary.clinicalSummary,
        differentialDiagnosis: aiSummary.differentialDiagnosis,
        treatmentRecommendations: aiSummary.treatmentRecommendations,
        clinicalConcerns: aiSummary.clinicalConcerns,
        providerNotes: aiSummary.providerNotes || '',
        isEdited: aiSummary.isEdited,
        editedAt: aiSummary.editedAt,
        editedBy: aiSummary.editedBy,
        confidence: aiSummary.confidence,
        processingTime: aiSummary.processingTime
      };

      // Update the existing ePCR record with AI summary
      const updatedData = {
        ...epcrData,
        aiSummary: aiSummaryForEPCR,
        updatedAt: new Date().toISOString()
      };

      // Save back to localStorage
      const storageKey = `epcr_record_${epcrId}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedData));

      // Trigger event to notify other components that records have been updated
      window.dispatchEvent(new CustomEvent('epcr-records-updated'));

      console.log('AI summary saved to ePCR record successfully');
    } catch (error) {
      console.error('Failed to save AI summary to ePCR record:', error);
      throw new Error('Failed to save AI summary to record');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'error';
      case 'urgent': return 'warning';
      case 'routine': return 'info';
      default: return 'default';
    }
  };

  const getProbabilityColor = (probability?: string) => {
    switch (probability) {
      case 'high': return 'error';
      case 'moderate': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const renderFormattedClinicalSummary = (summaryText: string) => {
    // Safety check: ensure summaryText is a string
    if (!summaryText) {
      return <Typography variant="body2" color="textSecondary">No clinical summary available</Typography>;
    }

    // Convert to string if it's an object (defensive programming)
    let textToProcess: string;
    if (typeof summaryText === 'object') {
      // If it's an object, try to extract meaningful text
      if (summaryText && typeof summaryText === 'object' && 'toString' in summaryText) {
        textToProcess = String(summaryText);
      } else {
        return (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Error: Clinical summary data is in an unexpected format. Please regenerate the summary.
            </Typography>
          </Alert>
        );
      }
    } else {
      textToProcess = String(summaryText);
    }

    if (!textToProcess || textToProcess.trim() === '') {
      return <Typography variant="body2" color="textSecondary">No clinical summary available</Typography>;
    }

    // Clean up the text - remove JSON formatting if present
    let cleanText = textToProcess.trim();
    
    // Handle JSON-wrapped content
    if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
      try {
        const parsed = JSON.parse(cleanText);
        if (parsed.clinicalSummary) {
          cleanText = parsed.clinicalSummary;
        }
      } catch (e) {
        // If JSON parsing fails, continue with original text
      }
    }

    // Detect and handle prompt echo - if the text contains prompt markers, show error
    const isPromptEcho = cleanText.includes('You are a medical documentation assistant') ||
                         cleanText.includes('MEDICAL TRAINING SCENARIO:') ||
                         cleanText.includes('Please provide detailed educational clinical analysis') ||
                         cleanText.includes('To analyze the patient care data') ||
                         cleanText.includes('Patient Demographics:') ||
                         cleanText.includes('This is for EMS training');

    if (isPromptEcho) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            The AI service returned the prompt instead of generating a clinical summary. 
            This usually indicates a model configuration issue. Please try regenerating or check your AI settings.
          </Typography>
        </Alert>
      );
    }

    // Basic text cleanup
    cleanText = cleanText
      .replace(/\*\*(.*?)\*\*/g, '$1')           // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')               // Remove italic markdown
      .replace(/_{2,}/g, '')                     // Remove underlines
      .replace(/`([^`]+)`/g, '$1')               // Remove code backticks
      .replace(/\n{3,}/g, '\n\n')                // Normalize excessive line breaks
      .replace(/\s{2,}/g, ' ')                   // Normalize multiple spaces
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')    // Ensure space after sentence endings
      .trim();

    // Simple paragraph splitting - much more reliable
    const paragraphs = cleanText
      .split(/\n\s*\n/)
      .filter(para => para.trim().length > 0)
      .map(para => para.trim());

    // If we have multiple paragraphs, format them nicely
    if (paragraphs.length > 1) {
      return (
        <Box>
          {paragraphs.map((paragraph, index) => {
            // Check if this looks like a bullet list
            const isBulletParagraph = paragraph.includes('•') || 
                                     paragraph.includes('- ') || 
                                     /^\d+\./.test(paragraph) ||
                                     paragraph.split(/[.!?]/).length > 3;

            if (isBulletParagraph) {
              // Split into bullet points
              const bullets = paragraph
                .split(/(?:•|-|\d+\.)\s*/)
                .map(bullet => {
                  // Ensure bullet is a string and not an object
                  const bulletText = typeof bullet === 'string' ? bullet.trim() : String(bullet).trim();
                  return bulletText;
                })
                .filter(bullet => bullet.length > 10);

              if (bullets.length > 1) {
                return (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                      🏥 Key Clinical Points:
                    </Typography>
                    <List sx={{ 
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      py: 1.5,
                      px: 2
                    }}>
                      {bullets.map((bullet, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5, pl: 0 }}>
                          <ListItemIcon sx={{ minWidth: 20 }}>
                            <Box sx={{
                              width: 6,
                              height: 6,
                              bgcolor: 'primary.main',
                              borderRadius: '50%'
                            }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={String(bullet)}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { lineHeight: 1.6 }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                );
              }
            }

            // Regular paragraph formatting
            return (
              <Typography 
                key={index}
                paragraph
                sx={{
                  lineHeight: 1.7,
                  mb: 2.5,
                  textAlign: 'justify',
                  fontSize: '1rem'
                }}
              >
                {String(paragraph)}
              </Typography>
            );
          })}
        </Box>
      );
    }

    // Single paragraph - simple formatting
    return (
      <Typography 
        paragraph 
        sx={{ 
          lineHeight: 1.7, 
          textAlign: 'justify',
          fontSize: '1rem'
        }}
      >
        {String(cleanText)}
      </Typography>
    );
  };

  const renderAIHealthStatus = () => (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <AIIcon color={aiHealthStatus === 'healthy' ? 'primary' : 'disabled'} />
      <Typography variant="body2" color="textSecondary">
        AI Service Status:
      </Typography>
      <Chip
        size="small"
        icon={aiHealthStatus === 'healthy' ? <CheckIcon /> : <ErrorIcon />}
        label={aiHealthStatus === 'healthy' ? 'Available' : 'Unavailable'}
        color={aiHealthStatus === 'healthy' ? 'success' : 'error'}
      />
      {aiHealthStatus === 'unavailable' && (
        <Tooltip title="Check AI service health">
          <IconButton size="small" onClick={checkAIHealth}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  if (!summary && !loading) {
    return (
      <Card elevation={2}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <AIIcon color="primary" />
              <Typography variant="h6">AI Clinical Summary</Typography>
            </Box>
          }
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={generateSummary}
              disabled={loading || aiHealthStatus === 'unavailable'}
              startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
            >
              {loading ? 'Generating...' : 'Generate AI Summary'}
            </Button>
          }
        />
        <CardContent>
          {renderAIHealthStatus()}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading && (
            <Fade in={loading}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  mb: 3, 
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white'
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <CircularProgress 
                    size={60} 
                    thickness={4}
                    sx={{ color: 'white' }}
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  🤖 AI Clinical Analysis in Progress
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                  Analyzing patient data and generating comprehensive medical insights...
                </Typography>
                <LinearProgress 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white'
                    }
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                  This may take 10-30 seconds depending on complexity
                </Typography>
              </Paper>
            </Fade>
          )}

          <Alert severity="info">
            Click "Generate AI Summary" to create an AI-powered clinical summary, differential diagnosis, and treatment recommendations based on the current ePCR data.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {summary && (
        <Card elevation={2}>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <AIIcon color="primary" />
                <Typography variant="h6">AI Clinical Summary</Typography>
                {summary.isEdited && (
                  <Chip size="small" label="Modified" color="warning" />
                )}
                <Chip 
                  size="small" 
                  label="💾 Saved with Record" 
                  color="success" 
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </Box>
            }
            subheader={
              <Typography variant="body2" color="textSecondary">
                Generated by {summary.aiService} ({summary.aiModel}) • {' '}
                {new Date(summary.generatedAt).toLocaleString()}
                {summary.processingTime && ` • ${(summary.processingTime / 1000).toFixed(1)}s`}
              </Typography>
            }
            action={
              <Box display="flex" gap={1}>
                {!editing && (
                  <>
                    <Tooltip title="Edit summary">
                      <IconButton onClick={startEditing}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Regenerate summary">
                      <IconButton onClick={regenerateSummary} disabled={loading}>
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {editing && (
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={saveSummary}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={cancelEditing}
                      disabled={loading}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            }
          />
          
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}

            {/* Clinical Summary */}
            <Accordion defaultExpanded>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiAccordionSummary-expandIconWrapper': {
                    color: 'primary.contrastText'
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <AnalysisIcon />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    🩺 Executive Clinical Summary
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
                {editing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={String(editableFields.clinicalSummary || '')}
                    onChange={(e) =>
                      setEditableFields(prev => ({ ...prev, clinicalSummary: e.target.value }))
                    }
                    variant="outlined"
                  />
                ) : (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      border: '1px solid',
                      borderColor: 'primary.light',
                      borderLeft: '4px solid',
                      borderLeftColor: 'primary.main',
                      bgcolor: 'background.paper'
                    }}
                  >
                    {renderFormattedClinicalSummary(summary.clinicalSummary)}
                  </Paper>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Differential Diagnosis */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <DiagnosisIcon color="primary" />
                  <Typography variant="h6">Differential Diagnosis</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {summary.differentialDiagnosis.map((diagnosis, index) => (
                    <Paper 
                      key={index} 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        borderLeft: (theme) => `4px solid ${
                          diagnosis.probability === 'high' ? theme.palette.error.main :
                          diagnosis.probability === 'moderate' ? theme.palette.warning.main :
                          theme.palette.info.main
                        }`
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Badge 
                          badgeContent={index + 1} 
                          color={getProbabilityColor(diagnosis.probability) as any}
                        >
                          <DiagnosisIcon color="primary" />
                        </Badge>
                        <Typography variant="h6" fontWeight="bold" flexGrow={1}>
                          {String(diagnosis.diagnosis || 'Diagnosis not specified')}
                        </Typography>
                        {diagnosis.probability && (
                          <Chip
                            size="medium"
                            label={`${diagnosis.probability.toUpperCase()} Probability`}
                            color={getProbabilityColor(diagnosis.probability) as any}
                            icon={<ProbabilityIcon />}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                        <strong>Clinical Rationale:</strong> {String(diagnosis.rationale || 'No rationale provided')}
                      </Typography>
                      
                      {diagnosis.supportingFindings && diagnosis.supportingFindings.length > 0 && (
                        <Box mb={1}>
                          <Typography variant="subtitle2" color="success.main" gutterBottom>
                            ✅ Supporting Findings:
                          </Typography>
                          <List dense sx={{ pl: 2 }}>
                            {diagnosis.supportingFindings.map((finding, idx) => (
                              <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}>
                                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={String(finding || 'Finding not specified')} 
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      
                      {diagnosis.contraindications && diagnosis.contraindications.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" color="error.main" gutterBottom>
                            ❌ Contraindications:
                          </Typography>
                          <List dense sx={{ pl: 2 }}>
                            {diagnosis.contraindications.map((contra, idx) => (
                              <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}>
                                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={String(contra || 'Contraindication not specified')} 
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Treatment Recommendations */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TreatmentIcon color="primary" />
                  <Typography variant="h6">Treatment Recommendations</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {Object.entries(summary.treatmentRecommendations).map(([priority, recommendations]) => (
                    <Paper 
                      key={priority}
                      elevation={2}
                      sx={{ 
                        p: 2,
                        border: (theme) => `1px solid ${theme.palette[getPriorityColor(priority) as 'error' | 'warning' | 'info'].light}`,
                        borderLeft: (theme) => `4px solid ${theme.palette[getPriorityColor(priority) as 'error' | 'warning' | 'info'].main}`,
                        bgcolor: (theme) => `${theme.palette[getPriorityColor(priority) as 'error' | 'warning' | 'info'].main}08`
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        {priority === 'immediate' && <UrgentIcon color="error" />}
                        {priority === 'urgent' && <MonitorIcon color="warning" />}
                        {priority === 'routine' && <RoutineIcon color="info" />}
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color={`${getPriorityColor(priority)}.main`}
                        >
                          {priority === 'immediate' && '🚨 IMMEDIATE Actions'}
                          {priority === 'urgent' && '⚠️ URGENT Follow-up'}
                          {priority === 'routine' && '📋 ROUTINE Documentation'}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={`${recommendations.length} item${recommendations.length > 1 ? 's' : ''}`}
                          color={getPriorityColor(priority) as any}
                          variant="outlined"
                        />
                      </Box>
                      <List dense>
                        {recommendations.map((recommendation: string, index: number) => (
                          <ListItem 
                            key={index} 
                            sx={{ 
                              pl: 0, 
                              py: 1,
                              borderRadius: 1,
                              mb: 0.5,
                              bgcolor: 'rgba(255,255,255,0.7)',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.9)'
                              }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <Box 
                                sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%', 
                                  bgcolor: `${getPriorityColor(priority)}.main` 
                                }} 
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {String(recommendation || 'Recommendation not specified')}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Clinical Concerns */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ConcernIcon color="warning" />
                  <Typography variant="h6">Clinical Concerns</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {summary.clinicalConcerns.map((concern, index) => (
                    <Paper 
                      key={index}
                      elevation={1}
                      sx={{ 
                        p: 2,
                        border: (theme) => `1px solid ${theme.palette.warning.light}`,
                        borderLeft: (theme) => `4px solid ${theme.palette.warning.main}`,
                        bgcolor: (theme) => `${theme.palette.warning.main}08`
                      }}
                    >
                      <Box display="flex" alignItems="flex-start" gap={2}>
                        <Badge 
                          badgeContent={index + 1} 
                          color="warning"
                        >
                          <ConcernIcon color="warning" />
                        </Badge>
                        <Box flexGrow={1}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            <strong>⚠️ Monitoring Priority:</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
                            {String(concern || 'Concern not specified')}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Provider Notes */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Provider Notes
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Add your additional notes, observations, or modifications to the AI-generated summary..."
                  value={String(editableFields.providerNotes || '')}
                  onChange={(e) =>
                    setEditableFields(prev => ({ ...prev, providerNotes: e.target.value }))
                  }
                  variant="outlined"
                />
              ) : (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={String(summary.providerNotes || '')}
                  placeholder="No provider notes added yet."
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Regenerate AI Summary</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to regenerate the AI summary? This will replace the current summary and any provider edits will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmRegeneration} color="primary" variant="contained">
            Regenerate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};