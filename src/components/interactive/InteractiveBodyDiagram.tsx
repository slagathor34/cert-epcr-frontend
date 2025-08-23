import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Badge,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Controller, Control } from 'react-hook-form';
import { BodyDiagramInjury } from '../../types/epcr';

interface InteractiveBodyDiagramProps {
  control: Control<any>;
  name: string;
  label?: string;
}

interface InjuryDialogData {
  id?: string;
  region: number;
  type: 'laceration' | 'bruise' | 'burn' | 'fracture' | 'abrasion' | 'puncture' | 'swelling' | 'deformity' | 'other';
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  description: string;
  side: 'front' | 'back';
  x: number;
  y: number;
}

const injuryTypes = [
  { value: 'laceration', label: 'Laceration', color: '#d32f2f' },
  { value: 'bruise', label: 'Bruise/Contusion', color: '#7b1fa2' },
  { value: 'burn', label: 'Burn', color: '#f57c00' },
  { value: 'fracture', label: 'Fracture', color: '#303f9f' },
  { value: 'abrasion', label: 'Abrasion', color: '#8bc34a' },
  { value: 'puncture', label: 'Puncture', color: '#795548' },
  { value: 'swelling', label: 'Swelling', color: '#00acc1' },
  { value: 'deformity', label: 'Deformity', color: '#fbc02d' },
  { value: 'other', label: 'Other', color: '#616161' },
];

const severityLevels = [
  { value: 'minor', label: 'Minor', color: '#4caf50' },
  { value: 'moderate', label: 'Moderate', color: '#ff9800' },
  { value: 'severe', label: 'Severe', color: '#f44336' },
  { value: 'critical', label: 'Critical', color: '#9c27b0' },
];

// Body region definitions (matching form layout)
const bodyRegions = {
  front: [
    { id: 1, label: 'Head/Face', x: 50, y: 8, width: 12, height: 8 },
    { id: 2, label: 'Neck', x: 48, y: 16, width: 8, height: 4 },
    { id: 3, label: 'Chest', x: 42, y: 20, width: 16, height: 12 },
    { id: 4, label: 'Abdomen', x: 44, y: 32, width: 12, height: 10 },
    { id: 5, label: 'Pelvis', x: 45, y: 42, width: 10, height: 6 },
    { id: 6, label: 'L Arm Upper', x: 28, y: 22, width: 6, height: 12 },
    { id: 7, label: 'L Forearm', x: 26, y: 34, width: 6, height: 12 },
    { id: 8, label: 'L Hand', x: 24, y: 46, width: 6, height: 8 },
    { id: 9, label: 'R Arm Upper', x: 66, y: 22, width: 6, height: 12 },
    { id: 10, label: 'R Forearm', x: 68, y: 34, width: 6, height: 12 },
    { id: 11, label: 'R Hand', x: 70, y: 46, width: 6, height: 8 },
    { id: 12, label: 'L Thigh', x: 42, y: 48, width: 6, height: 14 },
    { id: 13, label: 'L Lower Leg', x: 42, y: 62, width: 6, height: 14 },
    { id: 14, label: 'L Foot', x: 40, y: 76, width: 8, height: 6 },
    { id: 15, label: 'R Thigh', x: 52, y: 48, width: 6, height: 14 },
    { id: 16, label: 'R Lower Leg', x: 52, y: 62, width: 6, height: 14 },
    { id: 17, label: 'R Foot', x: 52, y: 76, width: 8, height: 6 },
  ],
  back: [
    { id: 18, label: 'Back of Head', x: 50, y: 8, width: 12, height: 8 },
    { id: 19, label: 'Back of Neck', x: 48, y: 16, width: 8, height: 4 },
    { id: 20, label: 'Upper Back', x: 42, y: 20, width: 16, height: 8 },
    { id: 21, label: 'Lower Back', x: 44, y: 28, width: 12, height: 8 },
    { id: 22, label: 'Buttocks', x: 45, y: 36, width: 10, height: 8 },
    { id: 23, label: 'L Arm Back Upper', x: 28, y: 22, width: 6, height: 12 },
    { id: 24, label: 'L Forearm Back', x: 26, y: 34, width: 6, height: 12 },
    { id: 25, label: 'L Hand Back', x: 24, y: 46, width: 6, height: 8 },
    { id: 26, label: 'R Arm Back Upper', x: 66, y: 22, width: 6, height: 12 },
    { id: 27, label: 'R Forearm Back', x: 68, y: 34, width: 6, height: 12 },
    { id: 28, label: 'R Hand Back', x: 70, y: 46, width: 6, height: 8 },
    { id: 29, label: 'L Thigh Back', x: 42, y: 44, width: 6, height: 14 },
    { id: 30, label: 'L Lower Leg Back', x: 42, y: 58, width: 6, height: 14 },
    { id: 31, label: 'L Foot Back', x: 40, y: 72, width: 8, height: 6 },
    { id: 32, label: 'R Thigh Back', x: 52, y: 44, width: 6, height: 14 },
    { id: 33, label: 'R Lower Leg Back', x: 52, y: 58, width: 6, height: 14 },
    { id: 34, label: 'R Foot Back', x: 52, y: 72, width: 8, height: 6 },
  ]
};

export function InteractiveBodyDiagram({ 
  control, 
  name, 
  label = 'Interactive Body Diagram' 
}: InteractiveBodyDiagramProps) {
  const theme = useTheme();
  const [selectedSide, setSelectedSide] = useState<'front' | 'back'>('front');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<InjuryDialogData | null>(null);

  const getInjuryTypeColor = (type: string) => {
    return injuryTypes.find(t => t.value === type)?.color || '#616161';
  };

  const getSeverityColor = (severity: string) => {
    return severityLevels.find(s => s.value === severity)?.color || '#4caf50';
  };

  const handleRegionClick = useCallback((region: any, side: 'front' | 'back') => {
    setDialogData({
      region: region.id,
      type: 'laceration',
      severity: 'minor',
      description: '',
      side,
      x: region.x + region.width / 2,
      y: region.y + region.height / 2,
    });
    setDialogOpen(true);
  }, []);

  const handleEditInjury = useCallback((injury: BodyDiagramInjury) => {
    setDialogData({
      id: injury.id,
      region: 0, // Will be determined by position
      type: injury.type,
      severity: (injury as any).severity || 'minor',
      description: injury.description || '',
      side: injury.side,
      x: injury.x,
      y: injury.y,
    });
    setDialogOpen(true);
  }, []);

  const renderBodyDiagram = (side: 'front' | 'back', injuries: BodyDiagramInjury[]) => {
    const regions = bodyRegions[side];
    const sideInjuries = injuries.filter(injury => injury.side === side);
    
    return (
      <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 85"
          style={{ border: '1px solid #ccc', borderRadius: 8 }}
        >
          <defs>
            <style>
              {`
                .interactive-body { fill: rgba(33, 150, 243, 0.05); stroke: #2196f3; stroke-width: 0.6; stroke-linejoin: round; }
                .interactive-outline { fill: none; stroke: #1976d2; stroke-width: 0.8; stroke-linejoin: round; }
              `}
            </style>
          </defs>

          {/* Anatomical body outline */}
          {side === 'front' ? (
            <g>
              {/* Head - natural oval */}
              <ellipse cx="50" cy="12" rx="6" ry="7" className="interactive-body"/>
              
              {/* Neck */}
              <path d="M44,19 Q50,17 56,19" className="interactive-outline"/>
              
              {/* Torso - anatomically shaped */}
              <path d="M37,21 Q50,20 63,21 L61,42 Q58,48 50,48 Q42,48 39,42 Z" className="interactive-body"/>
              
              {/* Pelvis - hip shape */}
              <path d="M41,48 Q50,49 59,48 L57,63 Q50,64 43,63 Z" className="interactive-body"/>
              
              {/* Left Arm */}
              <ellipse cx="30" cy="32" rx="4" ry="9" transform="rotate(-15 30 32)" className="interactive-body"/>
              <ellipse cx="22" cy="45" rx="3.5" ry="8" transform="rotate(-25 22 45)" className="interactive-body"/>
              <ellipse cx="19" cy="57" rx="2.5" ry="4" transform="rotate(-30 19 57)" className="interactive-body"/>
              
              {/* Right Arm */}
              <ellipse cx="70" cy="32" rx="4" ry="9" transform="rotate(15 70 32)" className="interactive-body"/>
              <ellipse cx="78" cy="45" rx="3.5" ry="8" transform="rotate(25 78 45)" className="interactive-body"/>
              <ellipse cx="81" cy="57" rx="2.5" ry="4" transform="rotate(30 81 57)" className="interactive-body"/>
              
              {/* Left Leg */}
              <ellipse cx="45" cy="73" rx="5" ry="12" className="interactive-body"/>
              <ellipse cx="44" cy="90" rx="4" ry="11" className="interactive-body"/>
              <ellipse cx="42" cy="105" rx="6" ry="3" className="interactive-body"/>
              
              {/* Right Leg */}
              <ellipse cx="55" cy="73" rx="5" ry="12" className="interactive-body"/>
              <ellipse cx="56" cy="90" rx="4" ry="11" className="interactive-body"/>
              <ellipse cx="58" cy="105" rx="6" ry="3" className="interactive-body"/>
            </g>
          ) : (
            <g>
              {/* Back of head */}
              <ellipse cx="50" cy="12" rx="6" ry="7" className="interactive-body"/>
              
              {/* Neck back */}
              <path d="M44,19 Q50,17 56,19" className="interactive-outline"/>
              
              {/* Upper back - broader at shoulders */}
              <path d="M37,21 Q50,20 63,21 L60,40 Q50,41 40,40 Z" className="interactive-body"/>
              
              {/* Lower back */}
              <path d="M40,40 Q50,41 60,40 L57,50 Q50,51 43,50 Z" className="interactive-body"/>
              
              {/* Buttocks */}
              <path d="M43,50 Q50,51 57,50 L56,63 Q50,64 44,63 Z" className="interactive-body"/>
              
              {/* Left Arm back */}
              <ellipse cx="30" cy="32" rx="4" ry="9" transform="rotate(-15 30 32)" className="interactive-body"/>
              <ellipse cx="22" cy="45" rx="3.5" ry="8" transform="rotate(-25 22 45)" className="interactive-body"/>
              <ellipse cx="19" cy="57" rx="2.5" ry="4" transform="rotate(-30 19 57)" className="interactive-body"/>
              
              {/* Right Arm back */}
              <ellipse cx="70" cy="32" rx="4" ry="9" transform="rotate(15 70 32)" className="interactive-body"/>
              <ellipse cx="78" cy="45" rx="3.5" ry="8" transform="rotate(25 78 45)" className="interactive-body"/>
              <ellipse cx="81" cy="57" rx="2.5" ry="4" transform="rotate(30 81 57)" className="interactive-body"/>
              
              {/* Left Leg back */}
              <ellipse cx="45" cy="68" rx="5" ry="11" className="interactive-body"/>
              <ellipse cx="44" cy="83" rx="4" ry="10" className="interactive-body"/>
              <ellipse cx="42" cy="96" rx="6" ry="3" className="interactive-body"/>
              
              {/* Right Leg back */}
              <ellipse cx="55" cy="68" rx="5" ry="11" className="interactive-body"/>
              <ellipse cx="56" cy="83" rx="4" ry="10" className="interactive-body"/>
              <ellipse cx="58" cy="96" rx="6" ry="3" className="interactive-body"/>
            </g>
          )}

          {/* Clickable regions */}
          {regions.map((region) => (
            <rect
              key={region.id}
              x={region.x - region.width/2}
              y={region.y - region.height/2}
              width={region.width}
              height={region.height}
              fill="rgba(33, 150, 243, 0.1)"
              stroke="rgba(33, 150, 243, 0.3)"
              strokeWidth="0.3"
              style={{ cursor: 'pointer' }}
              onClick={() => handleRegionClick(region, side)}
            >
              <title>{region.label}</title>
            </rect>
          ))}

          {/* Existing injuries */}
          {sideInjuries.map((injury) => (
            <g key={injury.id}>
              <circle
                cx={injury.x}
                cy={injury.y}
                r="2"
                fill={getInjuryTypeColor(injury.type)}
                stroke={getSeverityColor((injury as any).severity || 'minor')}
                strokeWidth="0.5"
                style={{ cursor: 'pointer' }}
                onClick={() => handleEditInjury(injury)}
              />
              <text
                x={injury.x}
                y={injury.y - 3}
                textAnchor="middle"
                fontSize="2"
                fill="#333"
                style={{ pointerEvents: 'none' }}
              >
                {regions.find(r => 
                  Math.abs(r.x - injury.x) < r.width/2 && 
                  Math.abs(r.y - injury.y) < r.height/2
                )?.id || '?'}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Region labels overlay */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          pointerEvents: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          p: 1 
        }}>
          {regions.slice(0, 6).map((region, index) => (
            <Typography
              key={region.id}
              variant="caption"
              sx={{
                position: 'absolute',
                fontSize: '0.6rem',
                color: theme.palette.text.secondary,
                backgroundColor: 'rgba(255,255,255,0.8)',
                px: 0.5,
                borderRadius: 0.5,
                left: `${region.x}%`,
                top: `${region.y + region.height/2 + 1}%`,
                transform: 'translate(-50%, 0)',
              }}
            >
              {region.id}
            </Typography>
          ))}
        </Box>
      </Box>
    );
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
          pageBreakInside: 'avoid',
        }
      }}
    >
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const handleSaveInjury = () => {
            if (!dialogData) return;
            
            const newInjury: BodyDiagramInjury = {
              id: dialogData.id || `injury-${Date.now()}-${Math.random()}`,
              x: dialogData.x,
              y: dialogData.y,
              type: dialogData.type,
              description: dialogData.description,
              side: dialogData.side,
              ...(dialogData.severity && { severity: dialogData.severity }),
            };

            if (dialogData.id) {
              // Edit existing injury
              const updated = field.value.map((injury: BodyDiagramInjury) =>
                injury.id === dialogData.id ? newInjury : injury
              );
              field.onChange(updated);
            } else {
              // Add new injury
              field.onChange([...field.value, newInjury]);
            }
            
            setDialogOpen(false);
            setDialogData(null);
          };

          const handleDeleteInjury = (injuryId: string) => {
            const updated = field.value.filter((injury: BodyDiagramInjury) => injury.id !== injuryId);
            field.onChange(updated);
          };

          return (
            <Box>
              {/* Side Selection */}
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant={selectedSide === 'front' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedSide('front')}
                  size="small"
                >
                  Front View
                </Button>
                <Button
                  variant={selectedSide === 'back' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedSide('back')}
                  size="small"
                >
                  Back View
                </Button>
              </Box>

              {/* Body Diagram */}
              {renderBodyDiagram(selectedSide, field.value || [])}

              {/* Injury Legend */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Injury Types:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {injuryTypes.map((type) => (
                    <Chip
                      key={type.value}
                      label={type.label}
                      size="small"
                      sx={{
                        backgroundColor: type.color,
                        color: 'white',
                        fontSize: '0.7rem',
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Severity Levels:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {severityLevels.map((severity) => (
                    <Chip
                      key={severity.value}
                      label={severity.label}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: severity.color,
                        color: severity.color,
                        fontSize: '0.7rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Injuries List */}
              {field.value && field.value.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recorded Injuries ({field.value.length}):
                  </Typography>
                  <Grid container spacing={1}>
                    {field.value.map((injury: BodyDiagramInjury, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={injury.id}>
                        <Paper 
                          variant="outlined" 
                          sx={{ p: 1.5, position: 'relative' }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              #{index + 1} - {injury.side.toUpperCase()}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditInjury(injury)}
                                sx={{ p: 0.25 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteInjury(injury.id)}
                                color="error"
                                sx={{ p: 0.25 }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                            <Chip
                              label={injuryTypes.find(t => t.value === injury.type)?.label}
                              size="small"
                              sx={{
                                backgroundColor: getInjuryTypeColor(injury.type),
                                color: 'white',
                                fontSize: '0.65rem',
                              }}
                            />
                            <Chip
                              label={(injury as any).severity || 'minor'}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: getSeverityColor((injury as any).severity || 'minor'),
                                color: getSeverityColor((injury as any).severity || 'minor'),
                                fontSize: '0.65rem',
                              }}
                            />
                          </Box>
                          
                          {injury.description && (
                            <Typography variant="caption" color="text.secondary">
                              {injury.description}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Injury Dialog */}
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                  {dialogData?.id ? 'Edit' : 'Add'} Injury
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Injury Type</InputLabel>
                        <Select
                          value={dialogData?.type || 'laceration'}
                          label="Injury Type"
                          onChange={(e) => setDialogData(prev => prev ? {
                            ...prev,
                            type: e.target.value as any
                          } : null)}
                        >
                          {injuryTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: type.color,
                                    borderRadius: '50%',
                                  }}
                                />
                                {type.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Severity</InputLabel>
                        <Select
                          value={dialogData?.severity || 'minor'}
                          label="Severity"
                          onChange={(e) => setDialogData(prev => prev ? {
                            ...prev,
                            severity: e.target.value as any
                          } : null)}
                        >
                          {severityLevels.map((severity) => (
                            <MenuItem key={severity.value} value={severity.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    border: `2px solid ${severity.color}`,
                                    borderRadius: '50%',
                                  }}
                                />
                                {severity.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description (Optional)"
                        value={dialogData?.description || ''}
                        onChange={(e) => setDialogData(prev => prev ? {
                          ...prev,
                          description: e.target.value
                        } : null)}
                        multiline
                        rows={2}
                        placeholder="Describe the injury location, size, or other relevant details..."
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleSaveInjury} 
                    variant="contained"
                    disabled={!dialogData}
                  >
                    {dialogData?.id ? 'Update' : 'Add'} Injury
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          );
        }}
      />
    </Paper>
  );
}