import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface ChiefComplaintFormProps {
  control: Control<EPCRData>;
}

const complaintCategories = [
  'Cardiac/Cardiovascular',
  'Respiratory',
  'Neurological',
  'Trauma/Injury',
  'Medical Emergency',
  'Mental Health',
  'Obstetric/Gynecological',
  'Pediatric Emergency',
  'Overdose/Poisoning',
  'Environmental',
  'Other'
];

const painScaleOptions = Array.from({ length: 11 }, (_, i) => ({ value: i, label: i.toString() }));

export const ChiefComplaintForm: React.FC<ChiefComplaintFormProps> = ({
  control,
}) => {
  const { field: chiefComplaintField } = useController({
    name: 'medicalHistory.chiefComplaint',
    control,
    defaultValue: '',
  });

  const { field: onsetField } = useController({
    name: 'medicalHistory.onsetTime',
    control,
    defaultValue: '',
  });

  const { field: durationField } = useController({
    name: 'medicalHistory.duration',
    control,
    defaultValue: '',
  });

  const { field: painScaleField } = useController({
    name: 'medicalHistory.painScale',
    control,
    defaultValue: '',
  });

  const { field: categoryField } = useController({
    name: 'medicalHistory.complaintCategory',
    control,
    defaultValue: '',
  });

  const { field: symptomsField } = useController({
    name: 'medicalHistory.associatedSymptoms',
    control,
    defaultValue: '',
  });

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Chief Complaint
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              {...chiefComplaintField}
              label="Primary Complaint"
              placeholder="Describe the patient's primary complaint in their own words"
              fullWidth
              multiline
              rows={3}
              required
              helperText="Enter the patient's chief complaint as stated by the patient or witnesses"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Complaint Category</FormLabel>
              <RadioGroup
                {...categoryField}
                row={false}
              >
                {complaintCategories.map((category) => (
                  <FormControlLabel
                    key={category}
                    value={category}
                    control={<Radio size="small" />}
                    label={category}
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...onsetField}
                  label="Onset Time"
                  placeholder="When did symptoms begin?"
                  fullWidth
                  helperText="e.g., 2 hours ago, this morning, gradual over 3 days"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...durationField}
                  label="Duration"
                  placeholder="How long have symptoms persisted?"
                  fullWidth
                  helperText="e.g., constant, intermittent, 30 minutes"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>Pain Scale (0-10)</FormLabel>
                  <RadioGroup
                    {...painScaleField}
                    row
                    sx={{ gap: 1 }}
                  >
                    {painScaleOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value.toString()}
                        control={<Radio size="small" />}
                        label={option.label}
                        sx={{ 
                          minWidth: 'auto',
                          mr: 1,
                          '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...symptomsField}
              label="Associated Symptoms"
              placeholder="List any additional symptoms the patient is experiencing"
              fullWidth
              multiline
              rows={2}
              helperText="e.g., nausea, shortness of breath, dizziness, weakness"
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};