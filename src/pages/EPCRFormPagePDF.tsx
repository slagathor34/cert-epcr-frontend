import React, { useEffect, useState } from 'react';
import { Container, Box, Button, Alert, Snackbar, CircularProgress } from '@mui/material';
import { Print as PrintIcon, Save as SaveIcon, FileDownload as ExportIcon } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
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
import { VitalSignsTimeTable } from '../components/forms/VitalSignsTimeTable';
import { NumberedBodyDiagram } from '../components/forms/NumberedBodyDiagram';
import { TreatmentChecklistPDF } from '../components/forms/TreatmentChecklistPDF';
import { TransportSection } from '../components/forms/TransportSection';
import { NotesPage } from '../components/forms/NotesPage';


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
    crewMemberA: {
      eyeProtection: false,
      gloves: false,
      gown: false,
      n95Mask: false,
    },
    crewMemberB: {
      eyeProtection: false,
      gloves: false,
      gown: false,
      n95Mask: false,
    },
    crewMemberC: {
      eyeProtection: false,
      gloves: false,
      gown: false,
      n95Mask: false,
    },
    crewMemberD: {
      eyeProtection: false,
      gloves: false,
      gown: false,
      n95Mask: false,
    },
    crewMemberE: {
      eyeProtection: false,
      gloves: false,
      gown: false,
      n95Mask: false,
    },
  },
  medicalHistory: {
    chiefComplaint: '',
    bodyFluidExposure: [],
    allergies: '',
    allergiesNone: false,
    medications: '',
    medicationStatus: '',
    medicalHistory: '',
    reportCompletedBy: '',
  },
  glasgowComaScale: {
    eyeOpening: 0,
    verbalResponse: 0,
    motorResponse: 0,
    total: 0,
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

export const EPCRFormPagePDF: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [currentRecord, setCurrentRecord] = useState<EPCRData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { control, handleSubmit, reset, getValues, formState: { isDirty } } = useForm<EPCRData>({
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

  const handleSave = async () => {
    const formData = getValues();
    await handleSaveRecord(formData, 'draft');
  };

  const handleSaveRecord = async (data: EPCRData, status: 'draft' | 'completed') => {
    setSaving(true);
    setSaveError(null);
    
    try {
      let savedRecord: EPCRData;
      
      if (id && id !== 'new') {
        // Update existing record
        savedRecord = await recordService.updateRecord(id, { ...data, status });
      } else {
        // Create new record
        savedRecord = await recordService.saveRecord({ ...data, status });
        // Navigate to the new record's URL
        navigate(`/epcr/${savedRecord.id}/edit`, { replace: true });
      }
      
      setCurrentRecord(savedRecord);
      setSaveSuccess(true);
      reset(savedRecord); // Reset form to mark as clean
      
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
          variant="outlined"
          startIcon={<ExportIcon />}
          onClick={handleExportMenuOpen}
          disabled={saving}
          sx={{}}
        >
          Export
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={saving}
        >
          Print
        </Button>
        {id && id !== 'new' && (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            sx={{}}
          >
            {saving ? 'Submitting...' : 'Submit Final'}
          </Button>
        )}
      </Box>

      <Container maxWidth="lg" sx={{ 
        py: 2,
        '@media print': {
          maxWidth: 'none',
          padding: 0,
          margin: 0,
        }
      }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Page 1 */}
          <Box className="page-1" sx={{ 
            '@media print': {
              pageBreakAfter: 'always'
            }
          }}>
            {/* Header */}
            <FormHeader control={control} />

            {/* Patient Information */}
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
              <VitalSignsTimeTable 
                control={control} 
                name="vitalSigns" 
                label="VITAL SIGNS"
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
        <MenuItem onClick={handleExportToCSV}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📊 Export as CSV
          </Box>
        </MenuItem>
        <MenuItem onClick={handleExportToJSON}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            💾 Export as JSON
          </Box>
        </MenuItem>
        <MenuItem onClick={handleExportSummary}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📄 Patient Summary
          </Box>
        </MenuItem>
      </Menu>

      {/* Save Success/Error Notifications */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ '@media print': { display: 'none' } }}
      >
        <Alert 
          onClose={() => setSaveSuccess(false)} 
          severity="success"
          variant="filled"
        >
          Record saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!saveError}
        autoHideDuration={6000}
        onClose={() => setSaveError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ '@media print': { display: 'none' } }}
      >
        <Alert 
          onClose={() => setSaveError(null)} 
          severity="error"
          variant="filled"
        >
          {saveError}
        </Alert>
      </Snackbar>

      {/* Unsaved Changes Warning */}
      {isDirty && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000,
            '@media print': { display: 'none' }
          }}
        >
          <Alert severity="warning" variant="filled">
            You have unsaved changes
          </Alert>
        </Box>
      )}
    </>
  );
};