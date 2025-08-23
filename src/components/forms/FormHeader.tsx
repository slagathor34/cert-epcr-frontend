import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface FormHeaderProps {
  control: Control<EPCRData>;
  className?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  control,
  className = '',
}) => {
  const { field: incidentField } = useController({
    name: 'incidentInformation.incidentNumber',
    control,
    defaultValue: '',
  });

  const { field: dateField } = useController({
    name: 'incidentInformation.date',
    control,
    defaultValue: '',
  });

  const { field: timeField } = useController({
    name: 'incidentInformation.time',
    control,
    defaultValue: '',
  });

  const { field: patientNumberField } = useController({
    name: 'incidentInformation.patientNumber',
    control,
    defaultValue: 1,
  });

  const { field: totalPatientsField } = useController({
    name: 'incidentInformation.totalPatients',
    control,
    defaultValue: 1,
  });

  const { field: respondingUnitsField } = useController({
    name: 'incidentInformation.respondingUnits',
    control,
    defaultValue: [],
  });

  return (
    <Paper elevation={0} className={`form-header ${className}`} sx={{ p: 2, mb: 2, border: '2px solid #000' }}>
      <Box textAlign="center" mb={2}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: { xs: '1.2rem', md: '1.8rem' },
            mb: 1
          }}
        >
          FIRST RESPONDER EMERGENCY RECORD
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '0.8rem',
            mb: 2
          }}
        >
          THIS FORM IS SUBJECT TO THE PRIVACY ACT OF 1974
        </Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={2}>
          <TextField
            {...incidentField}
            label="Incident"
            size="small"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            {...dateField}
            label="Date"
            type="date"
            size="small"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            {...timeField}
            label="Time"
            type="time"
            size="small"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', minWidth: 'fit-content' }}>
              Patient
            </Typography>
            <TextField
              {...patientNumberField}
              type="number"
              size="small"
              sx={{
                width: '60px',
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px', textAlign: 'center' }
              }}
            />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              of
            </Typography>
            <TextField
              {...totalPatientsField}
              type="number"
              size="small"
              sx={{
                width: '60px',
                '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px', textAlign: 'center' }
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            value={Array.isArray(respondingUnitsField.value) ? respondingUnitsField.value.join(', ') : ''}
            onChange={(e) => respondingUnitsField.onChange(e.target.value.split(', ').filter(unit => unit.trim()))}
            label="Responding Unit(s)/Person(s)"
            size="small"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiInputBase-input': { fontSize: '0.8rem', padding: '8px' }
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};