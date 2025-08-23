import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  IconButton,
  Button,
  Tooltip,
  Chip,
  FormControl,
  FormLabel,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Favorite as HeartIcon,
  Air as LungsIcon,
  Thermostat as TempIcon,
  Opacity as BloodIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Controller, Control } from 'react-hook-form';

interface VitalSignsEntry {
  id: string;
  time: string;
  levelOfConsciousness: 'A' | 'V' | 'P' | 'U' | '';
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  pulse: string;
  pulseRegularity: 'regular' | 'irregular' | '';
  pulseStrength: 'strong' | 'weak' | '';
  respirations: string;
  respirationQuality: {
    shallow: boolean;
    deep: boolean;
    labored: boolean;
    normal: boolean;
  };
  spO2: string;
  temperature: string;
  treatmentNotes: string;
}

interface DynamicVitalSignsTableProps {
  control: Control<any>;
  name: string;
  label?: string;
  compact?: boolean;
}

const defaultEntry = (): VitalSignsEntry => ({
  id: `vital-${Date.now()}-${Math.random()}`,
  time: new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  }),
  levelOfConsciousness: '',
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  pulse: '',
  pulseRegularity: '',
  pulseStrength: '',
  respirations: '',
  respirationQuality: {
    shallow: false,
    deep: false,
    labored: false,
    normal: false,
  },
  spO2: '',
  temperature: '',
  treatmentNotes: '',
});

export function DynamicVitalSignsTable({ 
  control, 
  name, 
  label = 'Vital Signs Monitoring',
  compact = false
}: DynamicVitalSignsTableProps) {
  const theme = useTheme();
  const [notesDialog, setNotesDialog] = useState<{ open: boolean; entryId: string; notes: string }>({
    open: false,
    entryId: '',
    notes: '',
  });

  const getVitalTrend = (current: string, previous: string, type: 'pulse' | 'bp' | 'resp' | 'spo2' | 'temp') => {
    if (!current || !previous) return null;
    
    const currentNum = parseFloat(current);
    const previousNum = parseFloat(previous);
    
    if (isNaN(currentNum) || isNaN(previousNum)) return null;
    
    const diff = currentNum - previousNum;
    const percentChange = Math.abs(diff / previousNum) * 100;
    
    if (percentChange < 5) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'increasing':
        return <span style={{ color: theme.palette.error.main }}>↗</span>;
      case 'decreasing':
        return <span style={{ color: theme.palette.info.main }}>↘</span>;
      case 'stable':
        return <span style={{ color: theme.palette.success.main }}>→</span>;
      default:
        return null;
    }
  };

  const isAbnormalVital = (value: string, type: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    
    switch (type) {
      case 'pulse':
        return num < 60 || num > 100;
      case 'systolic':
        return num < 90 || num > 140;
      case 'diastolic':
        return num < 60 || num > 90;
      case 'respirations':
        return num < 12 || num > 20;
      case 'spO2':
        return num < 95;
      case 'temperature':
        return num < 36 || num > 37.5;
      default:
        return false;
    }
  };

  if (compact) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={[defaultEntry()]}
        render={({ field }) => (
          <Box sx={{ 
            border: '1px solid', 
            borderColor: theme.palette.divider, 
            borderRadius: 1, 
            p: 2,
            backgroundColor: theme.palette.background.paper,
            '@media print': {
              border: '1px solid #000',
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Vital Signs ({field.value.length} entries)
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  field.onChange([...field.value, defaultEntry()]);
                }}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {field.value.map((entry: VitalSignsEntry, index: number) => (
                <Box key={entry.id} sx={{ 
                  mb: 1, 
                  p: 1, 
                  border: '1px solid', 
                  borderColor: theme.palette.divider,
                  borderRadius: 1,
                  fontSize: '0.8rem'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Chip label={`#${index + 1}`} size="small" />
                    <TextField
                      size="small"
                      type="time"
                      value={entry.time}
                      onChange={(e) => {
                        const updated = field.value.map((v: VitalSignsEntry) =>
                          v.id === entry.id ? { ...v, time: e.target.value } : v
                        );
                        field.onChange(updated);
                      }}
                      sx={{ width: 100 }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        const updated = field.value.filter((v: VitalSignsEntry) => v.id !== entry.id);
                        field.onChange(updated);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, fontSize: '0.75rem' }}>
                    <Box>
                      <Typography variant="caption">B/P:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TextField
                          size="small"
                          placeholder="Sys"
                          value={entry.bloodPressureSystolic}
                          onChange={(e) => {
                            const updated = field.value.map((v: VitalSignsEntry) =>
                              v.id === entry.id ? { ...v, bloodPressureSystolic: e.target.value } : v
                            );
                            field.onChange(updated);
                          }}
                          sx={{ width: 50 }}
                        />
                        <span>/</span>
                        <TextField
                          size="small"
                          placeholder="Dia"
                          value={entry.bloodPressureDiastolic}
                          onChange={(e) => {
                            const updated = field.value.map((v: VitalSignsEntry) =>
                              v.id === entry.id ? { ...v, bloodPressureDiastolic: e.target.value } : v
                            );
                            field.onChange(updated);
                          }}
                          sx={{ width: 50 }}
                        />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption">Pulse:</Typography>
                      <TextField
                        size="small"
                        value={entry.pulse}
                        onChange={(e) => {
                          const updated = field.value.map((v: VitalSignsEntry) =>
                            v.id === entry.id ? { ...v, pulse: e.target.value } : v
                          );
                          field.onChange(updated);
                        }}
                        sx={{ width: 60 }}
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="caption">Resp:</Typography>
                      <TextField
                        size="small"
                        value={entry.respirations}
                        onChange={(e) => {
                          const updated = field.value.map((v: VitalSignsEntry) =>
                            v.id === entry.id ? { ...v, respirations: e.target.value } : v
                          );
                          field.onChange(updated);
                        }}
                        sx={{ width: 50 }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      />
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          {label}
        </Typography>
        <Controller
          name={name}
          control={control}
          defaultValue={[defaultEntry()]}
          render={({ field }) => (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                field.onChange([...field.value, defaultEntry()]);
              }}
            >
              Add Time Entry
            </Button>
          )}
        />
      </Box>

      <Controller
        name={name}
        control={control}
        defaultValue={[defaultEntry()]}
        render={({ field }) => (
          <Box>
            <TableContainer sx={{ maxHeight: 600, overflowY: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon fontSize="small" />
                        Time
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 60 }}>LOC</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BloodIcon fontSize="small" />
                        B/P
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HeartIcon fontSize="small" />
                        Pulse
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 140 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LungsIcon fontSize="small" />
                        Respirations
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 70 }}>SpO₂</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 70 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TempIcon fontSize="small" />
                        Temp
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Notes</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 60 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {field.value.map((entry: VitalSignsEntry, index: number) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>
                        <TextField
                          type="time"
                          size="small"
                          value={entry.time}
                          onChange={(e) => {
                            const updated = field.value.map((v: VitalSignsEntry) =>
                              v.id === entry.id ? { ...v, time: e.target.value } : v
                            );
                            field.onChange(updated);
                          }}
                          InputProps={{
                            style: { fontSize: '0.875rem' }
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <RadioGroup
                          value={entry.levelOfConsciousness}
                          onChange={(e) => {
                            const updated = field.value.map((v: VitalSignsEntry) =>
                              v.id === entry.id ? { ...v, levelOfConsciousness: e.target.value as any } : v
                            );
                            field.onChange(updated);
                          }}
                          row
                        >
                          {['A', 'V', 'P', 'U'].map((level) => (
                            <FormControlLabel
                              key={level}
                              value={level}
                              control={<Radio size="small" />}
                              label={level}
                              sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                            />
                          ))}
                        </RadioGroup>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            size="small"
                            placeholder="Sys"
                            value={entry.bloodPressureSystolic}
                            onChange={(e) => {
                              const updated = field.value.map((v: VitalSignsEntry) =>
                                v.id === entry.id ? { ...v, bloodPressureSystolic: e.target.value } : v
                              );
                              field.onChange(updated);
                            }}
                            sx={{ 
                              width: 60,
                              '& input': {
                                color: isAbnormalVital(entry.bloodPressureSystolic, 'systolic') 
                                  ? theme.palette.error.main 
                                  : 'inherit'
                              }
                            }}
                          />
                          <Typography variant="body2">/</Typography>
                          <TextField
                            size="small"
                            placeholder="Dia"
                            value={entry.bloodPressureDiastolic}
                            onChange={(e) => {
                              const updated = field.value.map((v: VitalSignsEntry) =>
                                v.id === entry.id ? { ...v, bloodPressureDiastolic: e.target.value } : v
                              );
                              field.onChange(updated);
                            }}
                            sx={{ 
                              width: 60,
                              '& input': {
                                color: isAbnormalVital(entry.bloodPressureDiastolic, 'diastolic') 
                                  ? theme.palette.error.main 
                                  : 'inherit'
                              }
                            }}
                          />
                          {index > 0 && getTrendIcon(getVitalTrend(
                            entry.bloodPressureSystolic, 
                            field.value[index - 1]?.bloodPressureSystolic, 
                            'bp'
                          ))}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <TextField
                              size="small"
                              placeholder="Rate"
                              value={entry.pulse}
                              onChange={(e) => {
                                const updated = field.value.map((v: VitalSignsEntry) =>
                                  v.id === entry.id ? { ...v, pulse: e.target.value } : v
                                );
                                field.onChange(updated);
                              }}
                              sx={{ 
                                width: 60,
                                '& input': {
                                  color: isAbnormalVital(entry.pulse, 'pulse') 
                                    ? theme.palette.error.main 
                                    : 'inherit'
                                }
                              }}
                            />
                            {index > 0 && getTrendIcon(getVitalTrend(
                              entry.pulse, 
                              field.value[index - 1]?.pulse, 
                              'pulse'
                            ))}
                          </Box>
                          <RadioGroup
                            value={entry.pulseRegularity}
                            onChange={(e) => {
                              const updated = field.value.map((v: VitalSignsEntry) =>
                                v.id === entry.id ? { ...v, pulseRegularity: e.target.value as any } : v
                              );
                              field.onChange(updated);
                            }}
                            row
                          >
                            <FormControlLabel
                              value="regular"
                              control={<Radio size="small" />}
                              label="Reg"
                              sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.65rem' } }}
                            />
                            <FormControlLabel
                              value="irregular"
                              control={<Radio size="small" />}
                              label="Irreg"
                              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.65rem' } }}
                            />
                          </RadioGroup>
                          <RadioGroup
                            value={entry.pulseStrength}
                            onChange={(e) => {
                              const updated = field.value.map((v: VitalSignsEntry) =>
                                v.id === entry.id ? { ...v, pulseStrength: e.target.value as any } : v
                              );
                              field.onChange(updated);
                            }}
                            row
                          >
                            <FormControlLabel
                              value="strong"
                              control={<Radio size="small" />}
                              label="Strong"
                              sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.65rem' } }}
                            />
                            <FormControlLabel
                              value="weak"
                              control={<Radio size="small" />}
                              label="Weak"
                              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.65rem' } }}
                            />
                          </RadioGroup>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <TextField
                              size="small"
                              placeholder="Rate"
                              value={entry.respirations}
                              onChange={(e) => {
                                const updated = field.value.map((v: VitalSignsEntry) =>
                                  v.id === entry.id ? { ...v, respirations: e.target.value } : v
                                );
                                field.onChange(updated);
                              }}
                              sx={{ 
                                width: 60,
                                '& input': {
                                  color: isAbnormalVital(entry.respirations, 'respirations') 
                                    ? theme.palette.error.main 
                                    : 'inherit'
                                }
                              }}
                            />
                            {index > 0 && getTrendIcon(getVitalTrend(
                              entry.respirations, 
                              field.value[index - 1]?.respirations, 
                              'resp'
                            ))}
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                            {Object.entries(entry.respirationQuality).map(([quality, checked]) => (
                              <FormControlLabel
                                key={quality}
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={checked}
                                    onChange={(e) => {
                                      const updated = field.value.map((v: VitalSignsEntry) =>
                                        v.id === entry.id 
                                          ? { 
                                              ...v, 
                                              respirationQuality: {
                                                ...v.respirationQuality,
                                                [quality]: e.target.checked
                                              }
                                            } 
                                          : v
                                      );
                                      field.onChange(updated);
                                    }}
                                  />
                                }
                                label={quality}
                                sx={{ 
                                  mr: 0,
                                  '& .MuiFormControlLabel-label': { fontSize: '0.65rem' } 
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="%"
                          value={entry.spO2}
                          onChange={(e) => {
                            const updated = field.value.map((v: VitalSignsEntry) =>
                              v.id === entry.id ? { ...v, spO2: e.target.value } : v
                            );
                            field.onChange(updated);
                          }}
                          sx={{ 
                            width: 60,
                            '& input': {
                              color: isAbnormalVital(entry.spO2, 'spO2') 
                                ? theme.palette.error.main 
                                : 'inherit'
                            }
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="°C"
                          value={entry.temperature}
                          onChange={(e) => {
                            const updated = field.value.map((v: VitalSignsEntry) =>
                              v.id === entry.id ? { ...v, temperature: e.target.value } : v
                            );
                            field.onChange(updated);
                          }}
                          sx={{ 
                            width: 60,
                            '& input': {
                              color: isAbnormalVital(entry.temperature, 'temperature') 
                                ? theme.palette.error.main 
                                : 'inherit'
                            }
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Tooltip title="Treatment Notes">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setNotesDialog({
                                open: true,
                                entryId: entry.id,
                                notes: entry.treatmentNotes || '',
                              });
                            }}
                            color={entry.treatmentNotes ? 'primary' : 'default'}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            const updated = field.value.filter((v: VitalSignsEntry) => v.id !== entry.id);
                            field.onChange(updated);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Notes Dialog */}
            <Dialog 
              open={notesDialog.open} 
              onClose={() => setNotesDialog({ ...notesDialog, open: false })}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Treatment Notes</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Enter treatment notes for this time entry..."
                  value={notesDialog.notes}
                  onChange={(e) => setNotesDialog({ ...notesDialog, notes: e.target.value })}
                  sx={{ mt: 1 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setNotesDialog({ ...notesDialog, open: false })}>
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => {
                    const updated = field.value.map((v: VitalSignsEntry) =>
                      v.id === notesDialog.entryId 
                        ? { ...v, treatmentNotes: notesDialog.notes }
                        : v
                    );
                    field.onChange(updated);
                    setNotesDialog({ open: false, entryId: '', notes: '' });
                  }}
                >
                  Save Notes
                </Button>
              </DialogActions>
            </Dialog>

            {/* Legend */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Legend:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, fontSize: '0.875rem' }}>
                <Box>
                  <Typography variant="body2"><strong>LOC:</strong> A=Alert, V=Verbal, P=Pain, U=Unresponsive</Typography>
                  <Typography variant="body2"><strong>B/P:</strong> Blood Pressure (Systolic/Diastolic mmHg)</Typography>
                  <Typography variant="body2"><strong>Pulse:</strong> Regular/Irregular, Strong/Weak</Typography>
                </Box>
                <Box>
                  <Typography variant="body2"><strong>Resp Quality:</strong> Shallow, Deep, Labored, Normal</Typography>
                  <Typography variant="body2"><strong>SpO₂:</strong> Oxygen Saturation (%)</Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                    <strong>Red values:</strong> Outside normal ranges
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      />
    </Paper>
  );
}