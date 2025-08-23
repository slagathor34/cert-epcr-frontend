import React from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { Print as PrintIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { EPCRData } from '../types/epcr';
import { FormHeader } from '../components/forms/FormHeader';
import { PatientDemographicsForm } from '../components/forms/PatientDemographicsForm';

const defaultFormData: Partial<EPCRData> = {
  reportNumber: '',
  status: 'draft',
  patientDemographics: {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    dateOfBirth: '',
    age: 0,
    race: '',
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
    pupils: { left: '', right: '' },
    lungSounds: { left: '', right: '' },
  },
  bodyDiagramInjuries: [],
  vitalSigns: [],
  treatmentProvided: {
    airwayManagement: [],
    breathing: [],
    circulation: [],
    medications: [],
    procedures: [],
    immobilization: [],
    other: [],
  },
  transportInformation: {
    transportingAgency: '',
    vehicleNumber: '',
    destination: '',
    destinationType: 'hospital',
    mileage: { begin: 0, end: 0, total: 0 },
    patientRefusal: { refused: false },
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
};

export const EPCRFormPageSimple: React.FC = () => {
  const { control, handleSubmit, watch, setValue, getValues, reset } = useForm<EPCRData>({
    defaultValues: defaultFormData as EPCRData,
    mode: 'onChange',
  });

  const onSubmit = (data: EPCRData) => {
    console.log('Form Data:', data);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Form Header */}
        <FormHeader control={control} />

        {/* Patient Demographics */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Patient Demographics
          </Typography>
          <PatientDemographicsForm control={control} />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          mt: 4, 
          pt: 2, 
          borderTop: '1px solid #ddd' 
        }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => console.log('Save clicked', getValues())}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => console.log('Export clicked', getValues())}
          >
            Export PDF
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EPCRFormPageSimple;