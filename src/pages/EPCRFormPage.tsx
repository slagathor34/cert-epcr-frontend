import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import {
  Save as SaveIcon,
  Send as SendIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEPCRForm } from '../hooks/useEPCRForm';
import { PatientDemographicsForm } from '../components/forms/PatientDemographicsForm';
import { IncidentInformationForm } from '../components/forms/IncidentInformationForm';
import { VitalSignsForm } from '../components/forms/VitalSignsForm';
import { exportEPCRToPDF } from '../services/pdfExport';

const steps = [
  'Patient Demographics',
  'Incident Information',
  'Chief Complaint',
  'Vital Signs',
  'Assessment',
  'Medications & Procedures',
  'Narrative',
  'Disposition',
  'Review & Submit',
];

export const EPCRFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { form, formState, actions } = useEPCRForm({
    autoSaveInterval: 30000, // 30 seconds
    onSave: () => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
    onError: (error) => {
      console.error('Form error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    },
  });

  const { control, formState: reactHookFormState } = form;
  const { isDirty, isValid } = reactHookFormState;

  // Load existing form if ID is provided
  useEffect(() => {
    if (id) {
      actions.loadForm(id).catch((error) => {
        console.error('Failed to load form:', error);
      });
    }
  }, [id, actions]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await actions.saveForm();
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const handleSubmit = async () => {
    if (!isValid) {
      return;
    }
    
    try {
      await actions.submitForm();
      navigate('/epcr/list');
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    try {
      exportEPCRToPDF(formState.data, {
        filename: `EPCR_${formState.data.reportNumber || 'Draft'}_${new Date().toISOString().split('T')[0]}.pdf`
      });
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PatientDemographicsForm control={control} />;
      case 1:
        return <IncidentInformationForm control={control} />;
      case 2:
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chief Complaint - Coming Soon
            </Typography>
            <Typography color="text.secondary">
              This section is under development.
            </Typography>
          </Paper>
        );
      case 3:
        return (
          <VitalSignsForm
            control={control}
            onAddVitalSigns={actions.addVitalSigns}
            onRemoveVitalSigns={actions.removeVitalSigns}
          />
        );
      case 4:
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Assessment - Coming Soon
            </Typography>
            <Typography color="text.secondary">
              This section is under development.
            </Typography>
          </Paper>
        );
      case 5:
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Medications & Procedures - Coming Soon
            </Typography>
            <Typography color="text.secondary">
              This section is under development.
            </Typography>
          </Paper>
        );
      case 6:
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Narrative - Coming Soon
            </Typography>
            <Typography color="text.secondary">
              This section is under development.
            </Typography>
          </Paper>
        );
      case 7:
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Disposition - Coming Soon
            </Typography>
            <Typography color="text.secondary">
              This section is under development.
            </Typography>
          </Paper>
        );
      case 8:
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review & Submit
            </Typography>
            <Typography color="text.secondary" paragraph>
              Please review all sections of the ePCR form before submitting.
            </Typography>
            <Alert severity="info">
              Once submitted, this report will be sent for approval and cannot be modified.
            </Alert>
          </Paper>
        );
      default:
        return null;
    }
  };

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <Chip
            icon={<CircularProgress size={16} />}
            label="Saving..."
            color="info"
            size="small"
          />
        );
      case 'saved':
        return (
          <Chip
            label="Saved"
            color="success"
            size="small"
          />
        );
      case 'error':
        return (
          <Chip
            label="Save failed"
            color="error"
            size="small"
          />
        );
      default:
        return isDirty ? (
          <Chip
            label="Unsaved changes"
            color="warning"
            size="small"
          />
        ) : null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Electronic Patient Care Report
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {renderSaveStatus()}
            <Chip
              label={formState.data.status || 'draft'}
              color={formState.data.status === 'completed' ? 'success' : 'default'}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>
        
        {formState.lastSaved && (
          <Typography variant="body2" color="text.secondary">
            Last saved: {new Date(formState.lastSaved).toLocaleString()}
          </Typography>
        )}
      </Box>

      {/* Stepper */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => setActiveStep(index)}
                sx={{ cursor: 'pointer' }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Form Content */}
      <Box mb={4}>
        {getStepContent(activeStep)}
      </Box>

      {/* Navigation Buttons */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={handleSave}
              startIcon={<SaveIcon />}
              disabled={!isDirty || formState.isSubmitting}
            >
              Save Draft
            </Button>

            <Button
              variant="outlined"
              onClick={handlePrint}
              startIcon={<PrintIcon />}
            >
              Print
            </Button>

            <Button
              variant="outlined"
              onClick={handleExportPDF}
              startIcon={<PdfIcon />}
              color="secondary"
            >
              Export PDF
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                startIcon={<SendIcon />}
                disabled={!isValid || formState.isSubmitting}
              >
                Submit for Approval
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Form Errors */}
      {formState.errors.length > 0 && (
        <Box mt={3}>
          <Alert severity="error">
            <Typography variant="subtitle2" gutterBottom>
              Please correct the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {formState.errors.map((error, index) => (
                <li key={index}>
                  <strong>{error.field}:</strong> {error.message}
                </li>
              ))}
            </ul>
          </Alert>
        </Box>
      )}
    </Container>
  );
};