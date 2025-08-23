import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  Paper,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface TreatmentChecklistPDFProps {
  control: Control<EPCRData>;
}

const treatmentOptions = [
  'Airway',
  'O2 @ _____ LPM (Cannula/Mask)',
  'Assisted Respirations',
  'BVM',
  'OPA',
  'NPA',
  'Suction',
  'CPR Start: _____',
  'Defibrillate Time: _____',
  'Control Bleeding',
  'Bandaging',
  'Immobilization (C-Spine/Extremity/Back)',
  'Restrained',
  'OB Delivery',
  'Tourniquet Time: _____',
];

export const TreatmentChecklistPDF: React.FC<TreatmentChecklistPDFProps> = ({ control }) => {
  const TreatmentCheckbox: React.FC<{ treatment: string }> = ({ treatment }) => {
    const { field } = useController({
      name: `treatmentProvided.${treatment.replace(/[^a-zA-Z0-9]/g, '')}` as any,
      control,
      defaultValue: false,
    });

    const isTimeField = treatment.includes('_____');

    return (
      <Grid item xs={12} md={6}>
        <Box display="flex" alignItems="center" gap={1}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                size="small"
                sx={{ p: 0.5 }}
              />
            }
            label=""
            sx={{ mr: 1, minWidth: 'fit-content' }}
          />
          {isTimeField ? (
            <Box display="flex" alignItems="center" gap={1} flex={1}>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                {treatment.split(':')[0]}:
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                sx={{
                  width: '80px',
                  '& .MuiInputBase-input': { fontSize: '0.75rem', padding: '4px 8px' }
                }}
              />
            </Box>
          ) : treatment.includes('LPM') ? (
            <Box display="flex" alignItems="center" gap={1} flex={1}>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                O2 @
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                sx={{
                  width: '60px',
                  '& .MuiInputBase-input': { fontSize: '0.75rem', padding: '4px 8px' }
                }}
              />
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                LPM (Cannula/Mask)
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', flex: 1 }}>
              {treatment}
            </Typography>
          )}
        </Box>
      </Grid>
    );
  };

  return (
    <Box className="treatment-checklist-section" sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
        TREATMENT CHECKLIST
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #000' }}>
        <Grid container spacing={1}>
          {treatmentOptions.map((treatment) => (
            <TreatmentCheckbox key={treatment} treatment={treatment} />
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};