import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
} from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface GlasgowComaScaleSimpleProps {
  control: Control<any>;
  name?: string;
  label?: string;
}

const eyeOptions = [
  { value: 4, label: 'Spontaneous' },
  { value: 3, label: 'To Voice' },
  { value: 2, label: 'To Pain' },
  { value: 1, label: 'None' },
];

const verbalOptions = [
  { value: 5, label: 'Oriented' },
  { value: 4, label: 'Confused' },
  { value: 3, label: 'Inappropriate' },
  { value: 2, label: 'Incomprehensible' },
  { value: 1, label: 'None' },
];

const motorOptions = [
  { value: 6, label: 'Obeys Commands' },
  { value: 5, label: 'Localizes Pain' },
  { value: 4, label: 'Withdraws' },
  { value: 3, label: 'Flexion' },
  { value: 2, label: 'Extension' },
  { value: 1, label: 'None' },
];

export function GlasgowComaScaleSimple({ 
  control, 
  name = 'glasgowComaScale',
  label = 'Glasgow Coma Scale'
}: GlasgowComaScaleSimpleProps) {
  const theme = useTheme();

  const getScoreInterpretation = (total: number) => {
    if (total === 0) return 'Complete assessment';
    if (total >= 13) return 'Mild brain injury';
    if (total >= 9) return 'Moderate brain injury';
    if (total >= 3) return 'Severe brain injury';
    return 'Invalid score';
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 2,
        '@media print': {
          boxShadow: 'none',
          border: '1px solid #000',
        }
      }}
    >
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Eye Response */}
        <Grid item xs={12} md={4}>
          <Controller
            name={`${name}.eyeOpening`}
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <FormControl component="fieldset" fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: theme.palette.text.primary,
                  }}
                >
                  Eye Response (E)
                </FormLabel>
                <RadioGroup
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                >
                  {eyeOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" />}
                      label={`${option.value} - ${option.label}`}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>

        {/* Verbal Response */}
        <Grid item xs={12} md={4}>
          <Controller
            name={`${name}.verbalResponse`}
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <FormControl component="fieldset" fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: theme.palette.text.primary,
                  }}
                >
                  Verbal Response (V)
                </FormLabel>
                <RadioGroup
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                >
                  {verbalOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" />}
                      label={`${option.value} - ${option.label}`}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>

        {/* Motor Response */}
        <Grid item xs={12} md={4}>
          <Controller
            name={`${name}.motorResponse`}
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <FormControl component="fieldset" fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: theme.palette.text.primary,
                  }}
                >
                  Motor Response (M)
                </FormLabel>
                <RadioGroup
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                >
                  {motorOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" />}
                      label={`${option.value} - ${option.label}`}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>

      {/* Total Score Input */}
      <Controller
        name={`${name}.total`}
        control={control}
        defaultValue={0}
        render={({ field }) => (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total GCS Score: {field.value || 0}/15
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getScoreInterpretation(field.value || 0)}
            </Typography>
          </Box>
        )}
      />
    </Paper>
  );
}