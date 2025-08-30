import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MonitorHeart as VitalIcon,
  AccessTime as TimeIcon,
  Thermostat as TempIcon,
  Favorite as HeartIcon,
  Air as RespirationIcon,
  BloodtypeOutlined as PressureIcon,
  Timeline as TrendIcon,
} from '@mui/icons-material';
import { VitalSigns } from '../../types/epcr';

interface VitalSignsCollectorProps {
  vitalSigns: VitalSigns[];
  onChange: (vitalSigns: VitalSigns[]) => void;
  disabled?: boolean;
}

interface VitalSignsFormData {
  time: string;
  loc: string;
  systolicBP: string;
  diastolicBP: string;
  heartRate: string;
  pulseRegularity: string;
  pulseStrength: string;
  respiratoryRate: string;
  respiratoryQuality: string;
  temperature: string;
  oxygenSaturation: string;
  treatment: string;
}

const defaultFormData: VitalSignsFormData = {
  time: '',
  loc: '',
  systolicBP: '',
  diastolicBP: '',
  heartRate: '',
  pulseRegularity: '',
  pulseStrength: '',
  respiratoryRate: '',
  respiratoryQuality: '',
  temperature: '',
  oxygenSaturation: '',
  treatment: '',
};

export const VitalSignsCollector: React.FC<VitalSignsCollectorProps> = ({
  vitalSigns,
  onChange,
  disabled = false
}) => {
  const [formData, setFormData] = useState<VitalSignsFormData>(defaultFormData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Auto-set current time when component mounts
    if (!formData.time) {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // HH:MM format
      setFormData(prev => ({ ...prev, time: timeString }));
    }
  }, []);

  const handleInputChange = (field: keyof VitalSignsFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.time.trim()) {
      setError('Time is required');
      return false;
    }
    
    // At least one vital sign measurement should be provided
    const hasVitalSign = formData.systolicBP || formData.heartRate || formData.respiratoryRate || 
                        formData.temperature || formData.oxygenSaturation;
    
    if (!hasVitalSign) {
      setError('Please enter at least one vital sign measurement');
      return false;
    }

    return true;
  };

  const handleAddVitalSigns = () => {
    if (!validateForm()) return;

    const newVitalSign: VitalSigns = {
      time: formData.time,
      loc: formData.loc || undefined,
      systolicBP: formData.systolicBP ? Number(formData.systolicBP) : undefined,
      diastolicBP: formData.diastolicBP ? Number(formData.diastolicBP) : undefined,
      heartRate: formData.heartRate ? Number(formData.heartRate) : undefined,
      pulseRegularity: formData.pulseRegularity || undefined,
      pulseStrength: formData.pulseStrength || undefined,
      respiratoryRate: formData.respiratoryRate ? Number(formData.respiratoryRate) : undefined,
      respiratoryQuality: formData.respiratoryQuality || undefined,
      temperature: formData.temperature ? Number(formData.temperature) : undefined,
      oxygenSaturation: formData.oxygenSaturation ? Number(formData.oxygenSaturation) : undefined,
      treatment: formData.treatment || undefined,
    };

    const updatedVitalSigns = [...vitalSigns, newVitalSign];
    onChange(updatedVitalSigns);

    // Reset form but keep current time for next entry
    const currentTime = new Date().toTimeString().slice(0, 5);
    setFormData({ ...defaultFormData, time: currentTime });
    setSuccess('Vital signs added successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteVitalSigns = (index: number) => {
    const updatedVitalSigns = vitalSigns.filter((_, i) => i !== index);
    onChange(updatedVitalSigns);
  };

  const getVitalSignsColor = (type: string, value: number | undefined): 'success' | 'warning' | 'error' | 'default' => {
    if (!value) return 'default';

    switch (type) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        if (value < 40 || value > 120) return 'error';
        return 'success';
      case 'systolicBP':
        if (value > 140) return 'warning';
        if (value > 160) return 'error';
        if (value < 90) return 'warning';
        return 'success';
      case 'respiratoryRate':
        if (value < 12 || value > 20) return 'warning';
        if (value < 8 || value > 24) return 'error';
        return 'success';
      case 'temperature':
        if (value > 99.5 || value < 96) return 'warning';
        if (value > 101 || value < 95) return 'error';
        return 'success';
      case 'oxygenSaturation':
        if (value < 95) return 'warning';
        if (value < 90) return 'error';
        return 'success';
      default:
        return 'default';
    }
  };

  const formatVitalSign = (value: number | undefined, unit: string): string => {
    return value ? `${value}${unit}` : '—';
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Entry Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <VitalIcon color="primary" />
                  <Typography variant="h6">Vital Signs Entry</Typography>
                </Box>
              }
              subheader="Record patient vital signs measurements"
            />
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              <Stack spacing={3}>
                {/* Time and Location */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange('time')}
                      disabled={disabled}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.loc}
                      onChange={handleInputChange('loc')}
                      disabled={disabled}
                      placeholder="e.g., Ambulance, ER"
                    />
                  </Grid>
                </Grid>

                {/* Blood Pressure */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PressureIcon color="primary" fontSize="small" />
                    Blood Pressure
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Systolic"
                        type="number"
                        value={formData.systolicBP}
                        onChange={handleInputChange('systolicBP')}
                        disabled={disabled}
                        InputProps={{ endAdornment: 'mmHg' }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Diastolic"
                        type="number"
                        value={formData.diastolicBP}
                        onChange={handleInputChange('diastolicBP')}
                        disabled={disabled}
                        InputProps={{ endAdornment: 'mmHg' }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Heart Rate */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HeartIcon color="primary" fontSize="small" />
                    Pulse
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Heart Rate"
                        type="number"
                        value={formData.heartRate}
                        onChange={handleInputChange('heartRate')}
                        disabled={disabled}
                        InputProps={{ endAdornment: 'bpm' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel>Regularity</InputLabel>
                        <Select
                          value={formData.pulseRegularity}
                          onChange={(e) => handleInputChange('pulseRegularity')({ target: { value: e.target.value } })}
                          disabled={disabled}
                        >
                          <MenuItem value="Regular">Regular</MenuItem>
                          <MenuItem value="Irregular">Irregular</MenuItem>
                          <MenuItem value="Irregular-Irregular">Irregular-Irregular</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel>Strength</InputLabel>
                        <Select
                          value={formData.pulseStrength}
                          onChange={(e) => handleInputChange('pulseStrength')({ target: { value: e.target.value } })}
                          disabled={disabled}
                        >
                          <MenuItem value="Strong">Strong</MenuItem>
                          <MenuItem value="Weak">Weak</MenuItem>
                          <MenuItem value="Thready">Thready</MenuItem>
                          <MenuItem value="Bounding">Bounding</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                {/* Respiration */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RespirationIcon color="primary" fontSize="small" />
                    Respiration
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Respiratory Rate"
                        type="number"
                        value={formData.respiratoryRate}
                        onChange={handleInputChange('respiratoryRate')}
                        disabled={disabled}
                        InputProps={{ endAdornment: '/min' }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Quality</InputLabel>
                        <Select
                          value={formData.respiratoryQuality}
                          onChange={(e) => handleInputChange('respiratoryQuality')({ target: { value: e.target.value } })}
                          disabled={disabled}
                        >
                          <MenuItem value="Normal">Normal</MenuItem>
                          <MenuItem value="Shallow">Shallow</MenuItem>
                          <MenuItem value="Deep">Deep</MenuItem>
                          <MenuItem value="Labored">Labored</MenuItem>
                          <MenuItem value="Irregular">Irregular</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                {/* Temperature and Oxygen Saturation */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TempIcon color="primary" fontSize="small" />
                      Temperature
                    </Typography>
                    <TextField
                      fullWidth
                      label="Temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={handleInputChange('temperature')}
                      disabled={disabled}
                      inputProps={{
                        step: "0.1"
                      }}
                      InputProps={{ endAdornment: '°F' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Oxygen Saturation
                    </Typography>
                    <TextField
                      fullWidth
                      label="SpO2"
                      type="number"
                      value={formData.oxygenSaturation}
                      onChange={handleInputChange('oxygenSaturation')}
                      disabled={disabled}
                      InputProps={{ endAdornment: '%' }}
                    />
                  </Grid>
                </Grid>

                {/* Treatment */}
                <TextField
                  fullWidth
                  label="Treatment/Interventions"
                  multiline
                  rows={2}
                  value={formData.treatment}
                  onChange={handleInputChange('treatment')}
                  disabled={disabled}
                  placeholder="Any treatments or interventions applied..."
                />

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddVitalSigns}
                  disabled={disabled}
                  fullWidth
                  size="large"
                >
                  Add Vital Signs
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Display */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendIcon color="primary" />
                  <Typography variant="h6">Vital Signs History</Typography>
                  <Chip 
                    size="small" 
                    label={`${vitalSigns.length} record${vitalSigns.length !== 1 ? 's' : ''}`}
                    color="primary"
                  />
                </Box>
              }
              subheader="Recorded vital signs measurements"
            />
            <CardContent>
              {vitalSigns.length === 0 ? (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    color: 'text.secondary'
                  }}
                >
                  <VitalIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" gutterBottom>
                    No vital signs recorded
                  </Typography>
                  <Typography variant="body2">
                    Use the entry form to add patient vital signs
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Time</strong></TableCell>
                        <TableCell><strong>BP</strong></TableCell>
                        <TableCell><strong>HR</strong></TableCell>
                        <TableCell><strong>RR</strong></TableCell>
                        <TableCell><strong>Temp</strong></TableCell>
                        <TableCell><strong>SpO2</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vitalSigns.map((vital, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <TimeIcon fontSize="small" color="primary" />
                              <Typography variant="body2" fontWeight="bold">
                                {vital.time}
                              </Typography>
                              {vital.loc && (
                                <Chip size="small" label={vital.loc} variant="outlined" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {vital.systolicBP && vital.diastolicBP ? (
                              <Chip
                                size="small"
                                label={`${vital.systolicBP}/${vital.diastolicBP}`}
                                color={getVitalSignsColor('systolicBP', vital.systolicBP)}
                                variant="outlined"
                              />
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {vital.heartRate ? (
                              <Chip
                                size="small"
                                label={`${vital.heartRate} bpm`}
                                color={getVitalSignsColor('heartRate', vital.heartRate)}
                                variant="outlined"
                              />
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {vital.respiratoryRate ? (
                              <Chip
                                size="small"
                                label={`${vital.respiratoryRate}/min`}
                                color={getVitalSignsColor('respiratoryRate', vital.respiratoryRate)}
                                variant="outlined"
                              />
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {vital.temperature ? (
                              <Chip
                                size="small"
                                label={`${vital.temperature}°F`}
                                color={getVitalSignsColor('temperature', vital.temperature)}
                                variant="outlined"
                              />
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {vital.oxygenSaturation ? (
                              <Chip
                                size="small"
                                label={`${vital.oxygenSaturation}%`}
                                color={getVitalSignsColor('oxygenSaturation', vital.oxygenSaturation)}
                                variant="outlined"
                              />
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Delete vital signs">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteVitalSigns(index)}
                                disabled={disabled}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {vitalSigns.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    📊 Vital Signs Summary:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Latest BP: {vitalSigns[vitalSigns.length - 1]?.systolicBP && vitalSigns[vitalSigns.length - 1]?.diastolicBP 
                          ? `${vitalSigns[vitalSigns.length - 1].systolicBP}/${vitalSigns[vitalSigns.length - 1].diastolicBP} mmHg`
                          : 'Not recorded'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Latest HR: {vitalSigns[vitalSigns.length - 1]?.heartRate 
                          ? `${vitalSigns[vitalSigns.length - 1].heartRate} bpm`
                          : 'Not recorded'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};