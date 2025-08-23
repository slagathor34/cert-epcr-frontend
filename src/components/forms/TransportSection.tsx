import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface TransportSectionProps {
  control: Control<EPCRData>;
}

export const TransportSection: React.FC<TransportSectionProps> = ({ control }) => {
  const { field: agencyField } = useController({
    name: 'transportInformation.transportingAgency',
    control,
    defaultValue: '',
  });

  const { field: unitNumberField } = useController({
    name: 'transportInformation.vehicleNumber',
    control,
    defaultValue: '',
  });

  const { field: transportedToField } = useController({
    name: 'transportInformation.destination',
    control,
    defaultValue: '',
  });

  const { field: patientRefusedField } = useController({
    name: 'transportInformation.patientRefusal.refused',
    control,
    defaultValue: false,
  });

  return (
    <Box className="transport-section" sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
        TRANSPORT
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #000' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              {...agencyField}
              label="Transporting Agency/Unit Number"
              size="small"
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              {...unitNumberField}
              label="Unit Number"
              size="small"
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              {...transportedToField}
              label="Transported To"
              size="small"
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  {...patientRefusedField}
                  size="small"
                  sx={{ p: 0.5 }}
                />
              }
              label="Patient Refused"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
            />
          </Grid>

          {patientRefusedField.value && (
            <Grid item xs={12}>
              <Box sx={{ border: '1px solid #000', p: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
                  PATIENT REFUSAL
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 2 }}>
                  I acknowledge that I have been advised that medical assistance is being offered and that refusal of such assistance may result in death or serious bodily injury. I understand the risk and consequences of my refusal and hereby release all Sacramento Fire Department personnel and agencies from any liability arising from honoring this refusal.
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Patient/Guardian Signature"
                      size="small"
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': { fontSize: '0.7rem' },
                        '& .MuiInputBase-input': { fontSize: '0.75rem', padding: '6px' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Date"
                      type="date"
                      size="small"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiInputLabel-root': { fontSize: '0.7rem' },
                        '& .MuiInputBase-input': { fontSize: '0.75rem', padding: '6px' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};