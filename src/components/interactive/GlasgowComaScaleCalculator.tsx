import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Visibility as EyeIcon,
  RecordVoiceOver as VoiceIcon,
  PanTool as MotorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { Controller, Control, useWatch } from 'react-hook-form';
import { GlasgowComaScale } from '../../types/epcr';

interface GlasgowComaScaleCalculatorProps {
  control: Control<any>;
  name: string;
  label?: string;
  compact?: boolean;
}

const eyeOptions = [
  { value: 0, label: 'Select...', disabled: true },
  { value: 4, label: '4 - Spontaneous', description: 'Eyes open spontaneously' },
  { value: 3, label: '3 - To Speech', description: 'Eyes open to verbal command' },
  { value: 2, label: '2 - To Pain', description: 'Eyes open to painful stimulus' },
  { value: 1, label: '1 - None', description: 'No eye opening response' },
];

const verbalOptions = [
  { value: 0, label: 'Select...', disabled: true },
  { value: 5, label: '5 - Oriented', description: 'Oriented and converses normally' },
  { value: 4, label: '4 - Confused', description: 'Disoriented but converses' },
  { value: 3, label: '3 - Inappropriate', description: 'Inappropriate words/responses' },
  { value: 2, label: '2 - Incomprehensible', description: 'Incomprehensible sounds only' },
  { value: 1, label: '1 - None', description: 'No verbal response' },
];

const motorOptions = [
  { value: 0, label: 'Select...', disabled: true },
  { value: 6, label: '6 - Obeys Commands', description: 'Obeys motor commands' },
  { value: 5, label: '5 - Localizes Pain', description: 'Localizes painful stimulus' },
  { value: 4, label: '4 - Withdraws', description: 'Withdraws from painful stimulus' },
  { value: 3, label: '3 - Abnormal Flexion', description: 'Abnormal flexion to pain (decorticate)' },
  { value: 2, label: '2 - Extension', description: 'Extension to pain (decerebrate)' },
  { value: 1, label: '1 - None', description: 'No motor response' },
];

export function GlasgowComaScaleCalculator({ 
  control, 
  name, 
  label = 'Glasgow Coma Scale Calculator',
  compact = false
}: GlasgowComaScaleCalculatorProps) {
  const theme = useTheme();
  
  // Watch the individual values to auto-calculate total
  const watchedValues = useWatch({
    control,
    name,
    defaultValue: { eyeOpening: 0, verbalResponse: 0, motorResponse: 0, total: 0 }
  }) as GlasgowComaScale;

  const { eyeOpening, verbalResponse, motorResponse } = watchedValues || { 
    eyeOpening: 0, 
    verbalResponse: 0, 
    motorResponse: 0 
  };

  const getScoreColor = (total: number) => {
    if (total === 0) return theme.palette.grey[500];
    if (total >= 13) return theme.palette.success.main;
    if (total >= 9) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreBadgeColor = (total: number): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    if (total === 0) return 'default';
    if (total >= 13) return 'success';
    if (total >= 9) return 'warning';
    return 'error';
  };

  const getScoreInterpretation = (total: number) => {
    if (total === 0) return 'No assessment';
    if (total >= 13) return 'Mild injury';
    if (total >= 9) return 'Moderate injury';
    return 'Severe injury';
  };

  const total = (eyeOpening || 0) + (verbalResponse || 0) + (motorResponse || 0);

  if (compact) {
    return (
      <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckIcon fontSize="small" color="primary" />
          {label}
        </Typography>
        
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={3}>
            <Controller
              name={`${name}.eyeOpening`}
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <FormControl size="small" fullWidth>
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Eyes</InputLabel>
                  <Select
                    {...field}
                    value={field.value || 0}
                    label="Eyes"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {eyeOptions.map((option) => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        disabled={option.disabled}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={3}>
            <Controller
              name={`${name}.verbalResponse`}
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <FormControl size="small" fullWidth>
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Verbal</InputLabel>
                  <Select
                    {...field}
                    value={field.value || 0}
                    label="Verbal"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {verbalOptions.map((option) => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        disabled={option.disabled}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={3}>
            <Controller
              name={`${name}.motorResponse`}
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <FormControl size="small" fullWidth>
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Motor</InputLabel>
                  <Select
                    {...field}
                    value={field.value || 0}
                    label="Motor"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {motorOptions.map((option) => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        disabled={option.disabled}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={3}>
            <Chip
              label={`Total: ${total}`}
              color={getScoreBadgeColor(total)}
              variant="filled"
              size="small"
              sx={{ 
                fontWeight: 'bold',
                minWidth: '80px',
                '& .MuiChip-label': {
                  fontSize: '0.75rem'
                }
              }}
            />
          </Grid>
        </Grid>

        {total > 0 && total <= 8 && (
          <Alert severity="error" sx={{ mt: 1, py: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              Critical Score: GCS ≤ 8 requires immediate intervention
            </Typography>
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 2,
        '@media print': {
          boxShadow: 'none',
          border: '1px solid #000',
          pageBreakInside: 'avoid',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckIcon color="primary" />
          {label}
        </Typography>
        <Chip
          label={`GCS: ${total}/15`}
          color={getScoreBadgeColor(total)}
          variant="filled"
          size="medium"
          sx={{ fontWeight: 'bold', minWidth: '90px' }}
        />
      </Box>
      
      <Grid container spacing={3}>
        {/* Eye Response */}
        <Grid item xs={12} md={4}>
          <Controller
            name={`${name}.eyeOpening`}
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <FormControl fullWidth>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EyeIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Eye Opening (E)
                  </Typography>
                </Box>
                <Select
                  {...field}
                  value={field.value || 0}
                  variant="outlined"
                  displayEmpty
                  renderValue={(selected) => {
                    const option = eyeOptions.find(opt => opt.value === selected);
                    return option ? option.label : 'Select eye response...';
                  }}
                >
                  {eyeOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      disabled={option.disabled}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: option.disabled ? 'normal' : 'bold' }}>
                          {option.label}
                        </Typography>
                        {option.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {option.description}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
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
              <FormControl fullWidth>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <VoiceIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Verbal Response (V)
                  </Typography>
                </Box>
                <Select
                  {...field}
                  value={field.value || 0}
                  variant="outlined"
                  displayEmpty
                  renderValue={(selected) => {
                    const option = verbalOptions.find(opt => opt.value === selected);
                    return option ? option.label : 'Select verbal response...';
                  }}
                >
                  {verbalOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      disabled={option.disabled}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: option.disabled ? 'normal' : 'bold' }}>
                          {option.label}
                        </Typography>
                        {option.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {option.description}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
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
              <FormControl fullWidth>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MotorIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Motor Response (M)
                  </Typography>
                </Box>
                <Select
                  {...field}
                  value={field.value || 0}
                  variant="outlined"
                  displayEmpty
                  renderValue={(selected) => {
                    const option = motorOptions.find(opt => opt.value === selected);
                    return option ? option.label : 'Select motor response...';
                  }}
                >
                  {motorOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      disabled={option.disabled}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: option.disabled ? 'normal' : 'bold' }}>
                          {option.label}
                        </Typography>
                        {option.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {option.description}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>

      {/* Score Summary and Interpretation */}
      {total > 0 && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon fontSize="small" color="primary" />
            Score Summary
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2">
              Eye: <strong>{eyeOpening || 0}</strong>
            </Typography>
            <Typography variant="body2">
              Verbal: <strong>{verbalResponse || 0}</strong>
            </Typography>
            <Typography variant="body2">
              Motor: <strong>{motorResponse || 0}</strong>
            </Typography>
            <Typography variant="body2">
              Total: <strong style={{ color: getScoreColor(total) }}>{total}/15</strong>
            </Typography>
            <Typography variant="body2">
              Assessment: <strong style={{ color: getScoreColor(total) }}>{getScoreInterpretation(total)}</strong>
            </Typography>
          </Box>
        </Box>
      )}

      {/* Critical Score Alert */}
      {total > 0 && total <= 8 && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          icon={<WarningIcon />}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Critical Score: GCS ≤ 8 indicates severe neurological impairment
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            Consider immediate airway management and rapid transport
          </Typography>
        </Alert>
      )}

      {/* Mild Concern Alert */}
      {total >= 9 && total <= 12 && (
        <Alert 
          severity="warning" 
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Moderate impairment: Close monitoring recommended
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}