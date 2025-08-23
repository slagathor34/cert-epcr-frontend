import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface PatientDemographicsFormProps {
  control: Control<EPCRData>;
}

const genderOptions = [
  { value: 'M', label: 'M' },
  { value: 'F', label: 'F' },
];

export const PatientDemographicsForm: React.FC<PatientDemographicsFormProps> = ({
  control,
}) => {
  const { field: locationField } = useController({
    name: 'incidentInformation.incidentLocation',
    control,
    defaultValue: '',
  });

  const { field: patientNameField } = useController({
    name: 'patientDemographics.firstName',
    control,
    defaultValue: '',
  });

  const { field: lastNameField } = useController({
    name: 'patientDemographics.lastName',
    control,
    defaultValue: '',
  });

  const { field: addressField } = useController({
    name: 'patientDemographics.address',
    control,
    defaultValue: '',
  });

  const { field: cityField } = useController({
    name: 'patientDemographics.city',
    control,
    defaultValue: '',
  });

  const { field: stateField } = useController({
    name: 'patientDemographics.state',
    control,
    defaultValue: '',
  });

  const { field: zipField } = useController({
    name: 'patientDemographics.zip',
    control,
    defaultValue: '',
  });

  const { field: ageField } = useController({
    name: 'patientDemographics.age',
    control,
    defaultValue: 0,
  });

  const { field: dobField } = useController({
    name: 'patientDemographics.dateOfBirth',
    control,
    defaultValue: '',
  });

  const { field: genderField } = useController({
    name: 'patientDemographics.gender',
    control,
    defaultValue: undefined,
  });

  const { field: weightField } = useController({
    name: 'patientDemographics.weight',
    control,
    defaultValue: 0,
  });

  const { field: heightField } = useController({
    name: 'patientDemographics.height',
    control,
    defaultValue: 0,
  });

  return (
    <Box className="patient-information-section" sx={{ mb: 2 }}>
      {/* Location with crosshatch pattern background */}
      <Box sx={{ mb: 2, border: '1px solid #000' }}>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1, ml: 1 }}>
          Location:
        </Typography>
        <Box sx={{ 
          backgroundImage: `
            linear-gradient(45deg, transparent 30%, #ddd 30%, #ddd 32%, transparent 32%, transparent 68%, #ddd 68%, #ddd 70%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, #ddd 30%, #ddd 32%, transparent 32%, transparent 68%, #ddd 68%, #ddd 70%, transparent 70%)
          `,
          backgroundSize: '8px 8px',
          p: 1
        }}>
          <TextField
            {...locationField}
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
            }}
          />
        </Box>
      </Box>

      {/* Patient Information Section */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #000', mb: 2 }}>
        <Grid container spacing={2}>
          {/* Patient Name - Full width */}
          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <TextField
                {...lastNameField}
                label="Patient Name (Last)"
                size="small"
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
              <TextField
                {...patientNameField}
                label="(First)"
                size="small"
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
            </Box>
          </Grid>

          {/* Patient Address */}
          <Grid item xs={12}>
            <TextField
              {...addressField}
              label="Patient Address"
              size="small"
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
              }}
            />
          </Grid>

          {/* City, State, Zip */}
          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <TextField
                {...cityField}
                label="City"
                size="small"
                variant="outlined"
                sx={{
                  flex: 2,
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
              <TextField
                {...stateField}
                label="State"
                size="small"
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
              <TextField
                {...zipField}
                label="Zip"
                size="small"
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
            </Box>
          </Grid>

          {/* Age, DOB, Sex, Weight, Height - Horizontal Layout */}
          <Grid item xs={12}>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                {...ageField}
                label="Age"
                type="number"
                size="small"
                variant="outlined"
                sx={{
                  width: '80px',
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
              <TextField
                {...dobField}
                label="D.O.B."
                type="date"
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: '160px',
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
              <FormControl size="small" sx={{ width: '80px' }}>
                <InputLabel sx={{ fontSize: '0.75rem' }}>Sex</InputLabel>
                <Select
                  {...genderField}
                  label="Sex"
                  sx={{
                    '& .MuiSelect-select': { fontSize: '0.8rem', padding: '8px' }
                  }}
                >
                  {genderOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                {...weightField}
                label="Weight"
                type="number"
                size="small"
                variant="outlined"
                sx={{
                  width: '100px',
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
              <TextField
                {...heightField}
                label="Height"
                type="number"
                size="small"
                variant="outlined"
                sx={{
                  width: '100px',
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};