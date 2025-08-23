import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface MedicalInformationProps {
  control: Control<EPCRData>;
}

const crewMembers = ['A', 'B', 'C', 'D', 'E'];

export const MedicalInformation: React.FC<MedicalInformationProps> = ({ control }) => {
  const { field: chiefComplaintField } = useController({
    name: 'medicalHistory.chiefComplaint',
    control,
    defaultValue: '',
  });

  const { field: bodyFluidExposureField } = useController({
    name: 'medicalHistory.bodyFluidExposure',
    control,
    defaultValue: [],
  });

  const { field: allergiesField } = useController({
    name: 'medicalHistory.allergies',
    control,
    defaultValue: '',
  });

  const { field: allergiesNoneField } = useController({
    name: 'medicalHistory.allergiesNone',
    control,
    defaultValue: false,
  });

  const { field: medicationsField } = useController({
    name: 'medicalHistory.medications',
    control,
    defaultValue: '',
  });

  const { field: medicationStatusField } = useController({
    name: 'medicalHistory.medicationStatus',
    control,
    defaultValue: '',
  });

  const { field: medicalHistoryField } = useController({
    name: 'medicalHistory.medicalHistory',
    control,
    defaultValue: '',
  });

  const { field: reportCompletedByField } = useController({
    name: 'medicalHistory.reportCompletedBy',
    control,
    defaultValue: '',
  });

  const handleBodyFluidExposureChange = (crewMember: string, checked: boolean) => {
    const currentExposure = Array.isArray(bodyFluidExposureField.value) ? bodyFluidExposureField.value : [];
    if (checked) {
      bodyFluidExposureField.onChange([...currentExposure, crewMember]);
    } else {
      bodyFluidExposureField.onChange(currentExposure.filter((member: string) => member !== crewMember));
    }
  };

  return (
    <Box className="medical-information-section" sx={{ mb: 2 }}>
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #000', mb: 2 }}>
        <Grid container spacing={2}>
          {/* Chief Complaint */}
          <Grid item xs={12}>
            <TextField
              {...chiefComplaintField}
              label="Chief Complaint"
              multiline
              rows={2}
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
              }}
            />
          </Grid>

          {/* Body Fluid Exposure */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
                Body Fluid Exposure:
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                {crewMembers.map((member) => (
                  <FormControlLabel
                    key={member}
                    control={
                      <Checkbox
                        size="small"
                        checked={Array.isArray(bodyFluidExposureField.value) && bodyFluidExposureField.value.includes(member)}
                        onChange={(e) => handleBodyFluidExposureChange(member, e.target.checked)}
                        sx={{ p: 0.5 }}
                      />
                    }
                    label={member}
                    sx={{ 
                      '& .MuiFormControlLabel-label': { fontSize: '0.75rem' },
                      mr: 1
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Allergies */}
          <Grid item xs={12} md={6}>
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Allergies:
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...allergiesNoneField}
                      size="small"
                      sx={{ p: 0.5 }}
                    />
                  }
                  label="None"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                />
              </Box>
              <TextField
                {...allergiesField}
                fullWidth
                size="small"
                variant="outlined"
                disabled={allergiesNoneField.value}
                sx={{
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
            </Box>
          </Grid>

          {/* Medications */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
                Medications:
              </Typography>
              <Box display="flex" gap={1} mb={1}>
                {['None', 'Many', 'Bagged', 'Given to Medic'].map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        size="small"
                        checked={medicationStatusField.value === option}
                        onChange={() => medicationStatusField.onChange(
                          medicationStatusField.value === option ? '' : option
                        )}
                        sx={{ p: 0.5 }}
                      />
                    }
                    label={option}
                    sx={{ 
                      '& .MuiFormControlLabel-label': { fontSize: '0.65rem' },
                      mr: 0.5
                    }}
                  />
                ))}
              </Box>
              <TextField
                {...medicationsField}
                fullWidth
                size="small"
                variant="outlined"
                disabled={medicationStatusField.value === 'None'}
                sx={{
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
            </Box>
          </Grid>

          {/* Medical History */}
          <Grid item xs={12} md={8}>
            <TextField
              {...medicalHistoryField}
              label="Medical History"
              multiline
              rows={3}
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
              }}
            />
          </Grid>

          {/* Report Completed By */}
          <Grid item xs={12} md={4}>
            <TextField
              {...reportCompletedByField}
              label="Report Completed By"
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};