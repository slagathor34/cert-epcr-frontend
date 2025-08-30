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
  Stack,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Controller, Control } from 'react-hook-form';

interface BodyRegionData {
  id: number;
  label: string;
  percentage: number; // Body surface area percentage
  injured: boolean;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
}

interface NumberedBodyDiagramProps {
  control: Control<any>;
  name: string;
  label?: string;
  imageSrc?: string;
}

interface RegionDialogData {
  id: number;
  label: string;
  injured: boolean;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  side: 'anterior' | 'posterior';
}

// Based on the provided body diagram image with numbered regions
// The image contains both anterior (left) and posterior (right) views in a single image
// Mapping coordinates to match the visible numbered regions: 9, 18, and 1

const bodyRegions = [
  // ANTERIOR VIEW - Each region represents a specific body surface area percentage
  // Head region (9% body surface area)
  { id: 1, label: 'Head', percentage: 9, x: 8, y: 18, width: 6, height: 6, view: 'anterior' as const },
  
  // Left arm (9% body surface area)
  { id: 2, label: 'Left Arm', percentage: 9, x: 4, y: 40, width: 4, height: 8, view: 'anterior' as const },
  
  // Right arm (9% body surface area)
  { id: 3, label: 'Right Arm', percentage: 9, x: 42, y: 40, width: 4, height: 8, view: 'anterior' as const },
  
  // Torso anterior (18% body surface area)
  { id: 4, label: 'Chest/Abdomen (Anterior)', percentage: 18, x: 25, y: 45, width: 8, height: 15, view: 'anterior' as const },
  
  // Left pelvis/groin (9% body surface area)
  { id: 5, label: 'Left Pelvis/Groin', percentage: 9, x: 20, y: 65, width: 4, height: 4, view: 'anterior' as const },
  
  // Right pelvis/groin (9% body surface area)
  { id: 6, label: 'Right Pelvis/Groin', percentage: 9, x: 30, y: 65, width: 4, height: 4, view: 'anterior' as const },
  
  // Left leg anterior (1% body surface area for this section)
  { id: 7, label: 'Left Leg (Anterior)', percentage: 1, x: 8, y: 80, width: 3, height: 15, view: 'anterior' as const },
  
  // Right leg anterior (18% body surface area for this section)
  { id: 8, label: 'Right Leg (Anterior)', percentage: 18, x: 40, y: 80, width: 3, height: 15, view: 'anterior' as const },

  // POSTERIOR VIEW
  // Back/torso posterior (18% body surface area)
  { id: 9, label: 'Back/Torso (Posterior)', percentage: 18, x: 75, y: 45, width: 8, height: 15, view: 'posterior' as const },
  
  // Left buttock (9% body surface area)
  { id: 10, label: 'Left Buttock', percentage: 9, x: 70, y: 65, width: 4, height: 4, view: 'posterior' as const },
  
  // Right buttock (9% body surface area)
  { id: 11, label: 'Right Buttock', percentage: 9, x: 80, y: 65, width: 4, height: 4, view: 'posterior' as const }
];

const severityOptions = [
  { value: 'minor', label: 'Minor', color: '#4caf50' },
  { value: 'moderate', label: 'Moderate', color: '#ff9800' },
  { value: 'severe', label: 'Severe', color: '#f44336' },
];

export function NumberedBodyDiagram({ 
  control, 
  name, 
  label = 'Body Diagram Assessment',
  imageSrc = '/images/body_pic.png'
}: NumberedBodyDiagramProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionDialogData | null>(null);

  const handleRegionClick = useCallback((regionId: number) => {
    const region = bodyRegions.find(r => r.id === regionId);
    if (region) {
      setSelectedRegion({
        id: regionId,
        label: region.label,
        injured: false,
        severity: 'minor',
        description: '',
        side: region.view,
      });
      setDialogOpen(true);
    }
  }, []);

  const renderBodyDiagram = (bodyData: BodyRegionData[]) => {
    return (
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, mx: 'auto' }}>
        {/* Background Image - Combined anterior and posterior views */}
        <Box
          component="img"
          src={imageSrc}
          alt="Body diagram with anterior and posterior views"
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            border: '1px solid #ccc',
            borderRadius: 1,
          }}
        />
        
        {/* Clickable Regions Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {bodyRegions.map((region, index) => {
              const regionData = bodyData.find(data => data.id === region.id);
              const isInjured = regionData?.injured || false;
              const severity = regionData?.severity || 'minor';
              const severityColor = severityOptions.find(s => s.value === severity)?.color || '#4caf50';
              
              return (
                <g key={`${region.view}-${region.id}-${index}`}>
                  {/* Clickable area */}
                  <rect
                    x={region.x - region.width/2}
                    y={region.y - region.height/2}
                    width={region.width}
                    height={region.height}
                    fill={isInjured ? severityColor : 'rgba(33, 150, 243, 0.1)'}
                    stroke={isInjured ? severityColor : 'rgba(33, 150, 243, 0.3)'}
                    strokeWidth="0.5"
                    opacity={isInjured ? 0.7 : 0.3}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRegionClick(region.id)}
                  />
                  
                  {/* Region percentage number */}
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r="1.5"
                    fill={isInjured ? '#fff' : '#1976d2'}
                    stroke={isInjured ? severityColor : '#1976d2'}
                    strokeWidth="0.3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRegionClick(region.id)}
                  />
                  <text
                    x={region.x}
                    y={region.y + 0.4}
                    textAnchor="middle"
                    fontSize="1.2"
                    fill={isInjured ? severityColor : '#fff'}
                    style={{ 
                      pointerEvents: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    {region.percentage}
                  </text>
                </g>
              );
            })}
          </svg>
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click on numbered regions to mark injuries or areas of concern.
      </Typography>

      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const bodyData: BodyRegionData[] = field.value || [];
          
          const handleSaveRegion = () => {
            if (!selectedRegion) return;
            
            const region = bodyRegions.find(r => r.id === selectedRegion.id);
            if (!region) return;
            
            const existingIndex = bodyData.findIndex(data => data.id === selectedRegion.id);
            const updatedData = [...bodyData];
            
            if (existingIndex >= 0) {
              // Update existing region
              updatedData[existingIndex] = {
                id: selectedRegion.id,
                label: selectedRegion.label,
                percentage: region.percentage,
                injured: selectedRegion.injured,
                severity: selectedRegion.severity,
                description: selectedRegion.description,
              };
            } else {
              // Add new region
              updatedData.push({
                id: selectedRegion.id,
                label: selectedRegion.label,
                percentage: region.percentage,
                injured: selectedRegion.injured,
                severity: selectedRegion.severity,
                description: selectedRegion.description,
              });
            }
            
            // Remove region if not injured
            const finalData = updatedData.filter(data => data.injured);
            field.onChange(finalData);
            
            setDialogOpen(false);
            setSelectedRegion(null);
          };

          const handleDeleteRegion = (regionId: number) => {
            const updatedData = bodyData.filter(data => data.id !== regionId);
            field.onChange(updatedData);
          };

          // Calculate total body surface area affected
          const totalPercentage = bodyData.reduce((total, region) => total + region.percentage, 0);

          return (
            <Box>
              {/* Combined Body Diagram */}
              {renderBodyDiagram(bodyData)}

              {/* Total Body Surface Area Display */}
              {totalPercentage > 0 && (
                <Box sx={{ mt: 2, textAlign: 'center', p: 2, bgcolor: 'primary.main', borderRadius: 2 }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Total Body Surface Area Burns: {totalPercentage}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.light', mt: 1 }}>
                    This represents the cumulative percentage of body surface area with injuries/trauma
                  </Typography>
                </Box>
              )}

              {/* Severity Legend */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Severity Levels:
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center">
                  {severityOptions.map((severity) => (
                    <Chip
                      key={severity.value}
                      label={severity.label}
                      size="small"
                      sx={{
                        backgroundColor: severity.color,
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Injured Regions Summary */}
              {bodyData.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Injured Regions ({bodyData.length}) - Total: {totalPercentage}% Body Surface Area:
                  </Typography>
                  <Grid container spacing={1}>
                    {bodyData.map((region) => (
                      <Grid item xs={12} sm={6} md={4} key={region.id}>
                        <Paper 
                          variant="outlined" 
                          sx={{ p: 2, position: 'relative' }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {region.label} ({region.percentage}%)
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteRegion(region.id)}
                              color="error"
                              sx={{ p: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Chip
                              label={region.severity}
                              size="small"
                              sx={{
                                backgroundColor: severityOptions.find(s => s.value === region.severity)?.color,
                                color: 'white',
                                fontSize: '0.7rem',
                              }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {region.percentage}% BSA
                            </Typography>
                          </Stack>
                          
                          {region.description && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {region.description}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Region Edit Dialog */}
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                  {selectedRegion?.label} ({bodyRegions.find(r => r.id === selectedRegion?.id)?.percentage}% Body Surface Area)
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedRegion?.injured || false}
                            onChange={(e) => setSelectedRegion(prev => prev ? {
                              ...prev,
                              injured: e.target.checked
                            } : null)}
                          />
                        }
                        label="This region is injured"
                      />
                    </Grid>
                    
                    {selectedRegion?.injured && (
                      <>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Severity</InputLabel>
                            <Select
                              value={selectedRegion.severity}
                              label="Severity"
                              onChange={(e: SelectChangeEvent) => setSelectedRegion(prev => prev ? {
                                ...prev,
                                severity: e.target.value as 'minor' | 'moderate' | 'severe'
                              } : null)}
                            >
                              {severityOptions.map((severity) => (
                                <MenuItem key={severity.value} value={severity.value}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                      sx={{
                                        width: 16,
                                        height: 16,
                                        backgroundColor: severity.color,
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
                            value={selectedRegion.description}
                            onChange={(e) => setSelectedRegion(prev => prev ? {
                              ...prev,
                              description: e.target.value
                            } : null)}
                            multiline
                            rows={2}
                            placeholder="Describe the injury, location, size, or other relevant details..."
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleSaveRegion} 
                    variant="contained"
                  >
                    Save
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