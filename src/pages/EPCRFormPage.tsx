import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import {
  Print as PrintIcon,
  Save as SaveIcon,
  FileDownload as ExportIcon,
  Send as SendIcon,
  PictureAsPdf as PdfIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EPCRData } from '../types/epcr';
import { exportSingleRecordToCSV, exportSingleRecordToJSON, exportPatientSummary } from '../utils/exportUtils';
import { recordService } from '../services/recordService';
import { FormHeader } from '../components/forms/FormHeader';
import { PatientDemographicsForm } from '../components/forms/PatientDemographicsForm';
import { CrewPPEGrid } from '../components/forms/CrewPPEGrid';
import { MedicalInformation } from '../components/forms/MedicalInformation';
import { GlasgowComaScaleCalculator } from '../components/interactive/GlasgowComaScaleCalculator';
import { PhysicalAssessment } from '../components/forms/PhysicalAssessment';
import { TraumaBloodLoss } from '../components/forms/TraumaBloodLoss';
import { VitalSignsCollector } from '../components/forms/VitalSignsCollector';
import { NumberedBodyDiagram } from '../components/forms/NumberedBodyDiagram';
import { TreatmentChecklistPDF } from '../components/forms/TreatmentChecklistPDF';
import { TransportSection } from '../components/forms/TransportSection';
import { NotesPage } from '../components/forms/NotesPage';
import { AISummaryGenerator } from '../components/forms/AISummaryGenerator';
import { exportEPCRToPDF } from '../services/pdfExport';

const defaultFormData: Partial<EPCRData> = {
  reportNumber: '',
  patientDemographics: {
    lastName: '',
    firstName: '',
    middleName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    dateOfBirth: '',
    age: 0,
    gender: 'M',
    race: '',
    weight: 0,
    height: 0,
  },
  incidentInformation: {
    incidentNumber: '',
    date: '',
    time: '',
    patientNumber: 1,
    totalPatients: 1,
    respondingUnits: [],
    incidentLocation: '',
    city: '',
    state: '',
    zip: '',
  },
  crewPPE: {
    crewMemberA: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
    crewMemberB: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
    crewMemberC: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
    crewMemberD: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
    crewMemberE: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
  },
  medicalHistory: {
    allergies: '',
    medications: '',
    medicalHistory: '',
  },
  physicalAssessment: {
    skinColor: '',
    skinTemperature: '',
    skinMoisture: '',
    pupils: { left: '', right: '' },
    perl: false,
    lungSounds: { left: '', right: '' },
  },
  trauma: {
    head: 'none',
    neckBack: 'none',
    chest: 'none',
    abdomen: 'none',
    pelvis: 'none',
    legLeft: 'none',
    legRight: 'none',
    armLeft: 'none',
    armRight: 'none',
  },
  vitalSigns: [],
  bodyDiagramInjuries: [],
  transportInformation: {
    transportingAgency: '',
    vehicleNumber: '',
    destination: '',
    destinationType: 'hospital',
    mileage: { begin: 0, end: 0, total: 0 },
    patientRefusal: { refused: false },
  },
  treatmentProvided: {
    airwayManagement: [],
    breathing: [],
    circulation: [],
    medications: [],
    procedures: [],
    immobilization: [],
    other: [],
  },
  notesPage: {
    narrative: '',
    additionalNotes: '',
  },
  crewMembers: [],
  signatures: {
    primaryCareProvider: { name: '' },
    receivingFacility: { name: '' },
  },
  status: 'draft',
};

export const EPCRFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [currentRecord, setCurrentRecord] = useState<EPCRData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { control, handleSubmit, reset, getValues, watch, setValue, formState: { isDirty } } = useForm<EPCRData>({
    defaultValues: defaultFormData as EPCRData,
  });

  // Load existing record data when viewing/editing
  useEffect(() => {
    const loadRecord = async () => {
      if (id && id !== 'new') {
        try {
          const existingRecord = await recordService.getRecord(id);
          if (existingRecord) {
            reset(existingRecord);
            setCurrentRecord(existingRecord);
          } else {
            console.warn(`Record with id ${id} not found`);
            setSaveError('Record not found');
          }
        } catch (error) {
          console.error('Error loading record:', error);
          setSaveError('Failed to load record');
        }
      } else {
        // For new records, get current form values
        const formValues = getValues();
        setCurrentRecord({ ...formValues, id: 'new' } as EPCRData);
      }
    };
    
    loadRecord();
  }, [id, reset, getValues]);

  const onSubmit = async (data: EPCRData) => {
    await handleSaveRecord(data, 'completed');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async (event?: React.MouseEvent) => {
    // Prevent default form submission behavior
    event?.preventDefault?.();
    
    setSaving(true);
    
    try {
      const formData = getValues();
      
      // Save to localStorage directly, bypassing all services
      const recordId = (id && id !== 'new') ? id : Date.now().toString();
      
      const savedData = {
        ...formData,
        id: recordId,
        status: 'draft',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      const storageKey = `epcr_record_${recordId}`;
      localStorage.setItem(storageKey, JSON.stringify(savedData));
      
      // Trigger event to notify other components (like MedicalPage) that records have been updated
      window.dispatchEvent(new CustomEvent('epcr-records-updated'));
      
      // Update currentRecord state so AI Summary section appears
      setCurrentRecord({ ...savedData } as EPCRData);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Save failed:', error);
      setSaveError('Save failed: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRecord = async (data: EPCRData, status: 'draft' | 'completed') => {
    setSaving(true);
    setSaveError(null);
    
    try {
      const recordData = { ...data, status };
      
      // Use same localStorage approach as handleSave to avoid authentication issues
      const recordId = (id && id !== 'new') ? id : Date.now().toString();
      
      const savedRecord: EPCRData = {
        ...recordData,
        id: recordId,
        updatedAt: new Date().toISOString(),
        createdAt: recordData.createdAt || new Date().toISOString()
      };
      
      const storageKey = `epcr_record_${recordId}`;
      localStorage.setItem(storageKey, JSON.stringify(savedRecord));
      
      setCurrentRecord(savedRecord);
      setSaveSuccess(true);
      
      // Reset form with saved data to clear dirty state
      reset(savedRecord);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving record:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportToPDF = () => {
    if (currentRecord) {
      exportEPCRToPDF(currentRecord, {
        filename: `EPCR_${currentRecord.reportNumber || 'Draft'}_${new Date().toISOString().split('T')[0]}.pdf`
      });
    }
    handleExportMenuClose();
  };

  const handleExportToCSV = () => {
    if (currentRecord) {
      exportSingleRecordToCSV(currentRecord);
    }
    handleExportMenuClose();
  };

  const handleExportToJSON = () => {
    if (currentRecord) {
      exportSingleRecordToJSON(currentRecord);
    }
    handleExportMenuClose();
  };

  const handleExportSummary = () => {
    if (currentRecord) {
      exportPatientSummary(currentRecord);
    }
    handleExportMenuClose();
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  return (
    <>
      {/* Print/Save Controls - Hidden when printing */}
      <Box sx={{ 
        position: 'fixed', 
        top: 80, 
        right: 20, 
        zIndex: 1300,
        display: 'flex',
        gap: 1,
        padding: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 2,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '@media print': { display: 'none' },
        '@media (max-width: 600px)': { 
          position: 'relative',
          top: 'auto',
          right: 'auto',
          mb: 2,
          justifyContent: 'center'
        }
      }}>
        <Button
          type="button"
          variant="outlined"
          startIcon={<DashboardIcon />}
          onClick={handleExit}
          color="secondary"
        >
          Dashboard
        </Button>
        
        <Button
          type="button"
          variant="outlined"
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ 
            backgroundColor: isDirty ? 'warning.light' : 'inherit',
            borderColor: isDirty ? 'warning.main' : 'inherit',
            '&:hover': {
              backgroundColor: isDirty ? 'warning.main' : 'inherit',
              color: isDirty ? 'white' : 'inherit'
            }
          }}
        >
          {saving ? 'Saving...' : (isDirty ? 'Save*' : 'Save')}
        </Button>
        
        <Button
          type="button"
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print
        </Button>
        
        <Button
          type="button"
          variant="outlined" 
          startIcon={<ExportIcon />}
          onClick={handleExportMenuOpen}
        >
          Export
        </Button>

        <Button
          type="submit"
          variant="contained"
          startIcon={<SendIcon />}
          disabled={saving}
          color="primary"
        >
          Submit
        </Button>
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 4 },
          pr: { xs: 2, sm: 4, md: 12 }, // Extra right padding to avoid fixed controls
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} onReset={(e) => e.preventDefault()}>
          {/* Page 1 - Patient Care Report */}
          <Box className="page-1" sx={{ mb: 4 }}>
            {/* Form Header */}
            <FormHeader control={control} />

            {/* Patient Demographics */}
            <PatientDemographicsForm control={control} />

            {/* Crew PPE Grid */}
            <CrewPPEGrid control={control} />

            {/* Medical Information */}
            <MedicalInformation control={control} />

            {/* Glasgow Coma Scale */}
            <GlasgowComaScaleCalculator control={control} name="glasgowComaScale" />

            {/* Physical Assessment */}
            <PhysicalAssessment control={control} />

            {/* Trauma/Blood Loss */}
            <TraumaBloodLoss control={control} />

            {/* Vital Signs */}
            <Box sx={{ mb: 2 }}>
              <VitalSignsCollector
                vitalSigns={watch('vitalSigns') || []}
                onChange={(vitalSigns) => setValue('vitalSigns', vitalSigns)}
              />
            </Box>

            {/* Body Diagram */}
            <NumberedBodyDiagram 
              control={control} 
              name="bodyDiagram.injuries"
              label="Physical Assessment - Body Diagram"
            />

            {/* Treatment Checklist */}
            <TreatmentChecklistPDF control={control} />

            {/* Transport */}
            <TransportSection control={control} />
          </Box>

          {/* Page 2 - Notes */}
          <NotesPage control={control} />

          {/* AI Summary Section */}
          <Paper elevation={2} sx={{ p: 3, mt: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ 
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 1,
              mb: 3
            }}>
              AI-Generated Medical Summary
            </Typography>
            
            {currentRecord?.id && currentRecord.id !== 'new' ? (
              <AISummaryGenerator
                epcrId={currentRecord!.id!}
                onSummaryGenerated={(summary) => {
                  // Handle summary generation if needed
                }}
                onSummaryUpdated={(summary) => {
                  // Handle summary updates if needed
                }}
              />
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                Please save the ePCR first to generate an AI summary.
              </Alert>
            )}
          </Paper>
        </form>
      </Container>

      {/* Print-specific styling */}
      <style>{`
        @media print {
          @page {
            margin: 0.5in;
            size: letter;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .page-1 {
            page-break-after: always !important;
          }
          
          .notes-page-section {
            page-break-before: always !important;
          }

          /* Hide interactive elements when printing */
          button, .MuiButton-root {
            display: none !important;
          }
          
          /* Ensure tables and content don't break across pages */
          table, .crew-ppe-section, .glasgow-coma-scale-section, 
          .physical-assessment-section, .trauma-blood-loss-section {
            page-break-inside: avoid !important;
          }

          /* Make text smaller for print */
          .MuiTypography-root {
            font-size: 0.75rem !important;
          }
          
          .MuiInputBase-input {
            font-size: 0.7rem !important;
          }
        }
      `}</style>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportMenuClose}
        sx={{ '@media print': { display: 'none' } }}
      >
        <MenuItem onClick={handleExportToPDF}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PdfIcon /> Export as PDF
          </Box>
        </MenuItem>
        <MenuItem onClick={handleExportToCSV}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📊 Export as CSV
          </Box>
        </MenuItem>
        <MenuItem onClick={handleExportToJSON}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📋 Export as JSON
          </Box>
        </MenuItem>
        <MenuItem onClick={handleExportSummary}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📝 Export Summary
          </Box>
        </MenuItem>
      </Menu>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        sx={{ '@media print': { display: 'none' } }}
      >
        <Alert severity="success" onClose={() => setSaveSuccess(false)}>
          Record saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!saveError}
        autoHideDuration={6000}
        onClose={() => setSaveError(null)}
        sx={{ '@media print': { display: 'none' } }}
      >
        <Alert severity="error" onClose={() => setSaveError(null)}>
          {saveError}
        </Alert>
      </Snackbar>
    </>
  );
};