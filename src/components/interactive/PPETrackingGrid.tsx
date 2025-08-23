import React from 'react';
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
  Checkbox,
  FormControlLabel,
  Alert,
  Chip,
  useTheme,
  Grid,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Controller, Control } from 'react-hook-form';
import { CrewPPE } from '../../types/epcr';

interface PPETrackingGridProps {
  control: Control<any>;
  name: string;
  label?: string;
  compactView?: boolean;
}

const crewMembers = [
  { id: 'A', label: 'Crew Member A', color: '#1976d2' },
  { id: 'B', label: 'Crew Member B', color: '#388e3c' },
  { id: 'C', label: 'Crew Member C', color: '#f57c00' },
  { id: 'D', label: 'Crew Member D', color: '#7b1fa2' },
  { id: 'E', label: 'Crew Member E', color: '#d32f2f' },
];

const ppeTypes = [
  { 
    key: 'gloves' as keyof Omit<CrewPPE['crewMemberA'], 'eyeProtection' | 'n95Mask' | 'gown'>,
    label: 'Gloves', 
    required: true,
    icon: '🧤'
  },
  { 
    key: 'n95Mask' as keyof CrewPPE['crewMemberA'],
    label: 'Mask', 
    required: true,
    icon: '😷'
  },
  { 
    key: 'gown' as keyof CrewPPE['crewMemberA'],
    label: 'Gown', 
    required: false,
    icon: '🥽'
  },
  { 
    key: 'eyeProtection' as keyof CrewPPE['crewMemberA'],
    label: 'Eye', 
    required: false,
    icon: '👓'
  },
];

export function PPETrackingGrid({ 
  control, 
  name, 
  label = 'PPE Compliance Tracking Grid',
  compactView = false
}: PPETrackingGridProps) {
  const theme = useTheme();

  const getCrewMemberKey = (crewId: string): keyof CrewPPE => {
    return `crewMember${crewId}` as keyof CrewPPE;
  };

  const getComplianceStatus = (crewMember: any) => {
    if (!crewMember) return { status: 'unknown', count: 0, total: 4 };

    const requiredItems = ppeTypes.filter(item => item.required);
    const allItems = ppeTypes;
    
    const requiredCompliant = requiredItems.every(item => crewMember[item.key]);
    const totalCompliant = allItems.reduce((count, item) => count + (crewMember[item.key] ? 1 : 0), 0);
    
    if (requiredCompliant && totalCompliant === 4) {
      return { status: 'full', count: totalCompliant, total: 4 };
    } else if (requiredCompliant) {
      return { status: 'required', count: totalCompliant, total: 4 };
    } else {
      return { status: 'incomplete', count: totalCompliant, total: 4 };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'full':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: '1rem' }} />;
      case 'required':
        return <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: '1rem' }} />;
      case 'incomplete':
        return <CancelIcon sx={{ color: theme.palette.error.main, fontSize: '1rem' }} />;
      default:
        return <WarningIcon sx={{ color: theme.palette.grey[400], fontSize: '1rem' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full':
        return theme.palette.success.main;
      case 'required':
        return theme.palette.warning.main;
      case 'incomplete':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[400];
    }
  };

  if (compactView) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={{
          crewMemberA: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
          crewMemberB: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
          crewMemberC: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
          crewMemberD: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
          crewMemberE: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
        }}
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
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              PPE Compliance Grid
            </Typography>
            
            <Table size="small" sx={{ '& .MuiTableCell-root': { p: 0.5, textAlign: 'center' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 60, fontSize: '0.75rem' }}>
                    Crew
                  </TableCell>
                  {ppeTypes.map((ppe) => (
                    <TableCell 
                      key={ppe.key} 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        backgroundColor: ppe.required ? theme.palette.warning.light : 'transparent',
                        minWidth: 50,
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem' }}>{ppe.icon}</span>
                        <span>{ppe.label}</span>
                        {ppe.required && <span style={{ fontSize: '0.6rem' }}>*</span>}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {crewMembers.map((crew) => {
                  const crewKey = getCrewMemberKey(crew.id);
                  const crewData = field.value[crewKey];
                  const compliance = getComplianceStatus(crewData);
                  
                  return (
                    <TableRow key={crew.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Chip
                            label={crew.id}
                            size="small"
                            sx={{
                              backgroundColor: crew.color,
                              color: 'white',
                              fontWeight: 'bold',
                              minWidth: 32,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                      </TableCell>
                      
                      {ppeTypes.map((ppe) => (
                        <TableCell key={ppe.key}>
                          <Checkbox
                            checked={crewData?.[ppe.key] || false}
                            onChange={(e) => {
                              const newValue = {
                                ...field.value,
                                [crewKey]: {
                                  ...crewData,
                                  [ppe.key]: e.target.checked,
                                }
                              };
                              field.onChange(newValue);
                            }}
                            color="primary"
                            size="small"
                            sx={{
                              '&.Mui-checked': {
                                color: ppe.required ? theme.palette.warning.main : theme.palette.primary.main,
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: '1rem',
                              }
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {/* Quick status summary */}
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
              {crewMembers.map((crew) => {
                const crewKey = getCrewMemberKey(crew.id);
                const crewData = field.value[crewKey];
                const compliance = getComplianceStatus(crewData);
                
                return (
                  <Box key={crew.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <Typography variant="caption" sx={{ color: crew.color, fontWeight: 'bold' }}>
                      {crew.id}:
                    </Typography>
                    {getStatusIcon(compliance.status)}
                  </Box>
                );
              })}
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
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Required PPE:</strong> Gloves and Mask are mandatory for all crew members. 
          Gown and Eye Protection are situation-dependent.
        </Typography>
      </Alert>

      <Controller
        name={name}
        control={control}
        defaultValue={{
          crewMemberA: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
          crewMemberB: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
          crewMemberC: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
          crewMemberD: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
          crewMemberE: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
        }}
        render={({ field }) => (
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 140 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon />
                        Crew Member
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}>
                      Status
                    </TableCell>
                    {ppeTypes.map((ppe) => (
                      <TableCell 
                        key={ppe.key} 
                        sx={{ 
                          fontWeight: 'bold', 
                          textAlign: 'center',
                          minWidth: 100,
                          backgroundColor: ppe.required ? theme.palette.warning.light : 'transparent',
                          color: ppe.required ? theme.palette.warning.contrastText : 'inherit',
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ fontSize: '1.5rem' }}>{ppe.icon}</Box>
                          <Box>
                            {ppe.label}
                            {ppe.required && (
                              <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem' }}>
                                *Required
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {crewMembers.map((crew) => {
                    const crewKey = getCrewMemberKey(crew.id);
                    const crewData = field.value[crewKey];
                    const compliance = getComplianceStatus(crewData);
                    
                    return (
                      <TableRow key={crew.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={crew.id}
                              size="medium"
                              sx={{
                                backgroundColor: crew.color,
                                color: 'white',
                                fontWeight: 'bold',
                                minWidth: 40,
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {crew.label}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            {getStatusIcon(compliance.status)}
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: getStatusColor(compliance.status),
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }}
                            >
                              {compliance.count}/{compliance.total}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        {ppeTypes.map((ppe) => (
                          <TableCell key={ppe.key} sx={{ textAlign: 'center' }}>
                            <Checkbox
                              checked={crewData?.[ppe.key] || false}
                              onChange={(e) => {
                                const newValue = {
                                  ...field.value,
                                  [crewKey]: {
                                    ...crewData,
                                    [ppe.key]: e.target.checked,
                                  }
                                };
                                field.onChange(newValue);
                              }}
                              color="primary"
                              size="medium"
                              sx={{
                                '&.Mui-checked': {
                                  color: ppe.required ? theme.palette.warning.main : theme.palette.primary.main,
                                },
                                '& .MuiSvgIcon-root': {
                                  fontSize: '1.5rem',
                                }
                              }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Compliance Summary */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Compliance Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {crewMembers.map((crew) => {
                      const crewKey = getCrewMemberKey(crew.id);
                      const crewData = field.value[crewKey];
                      const compliance = getComplianceStatus(crewData);
                      
                      return (
                        <Chip
                          key={crew.id}
                          label={`${crew.id}: ${compliance.count}/4`}
                          size="small"
                          icon={getStatusIcon(compliance.status)}
                          sx={{
                            backgroundColor: crew.color,
                            color: 'white',
                            '& .MuiChip-icon': {
                              color: 'white !important',
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'right' }}>
                    {(() => {
                      const totalCompliance = crewMembers.reduce((sum, crew) => {
                        const crewKey = getCrewMemberKey(crew.id);
                        const crewData = field.value[crewKey];
                        const compliance = getComplianceStatus(crewData);
                        return sum + compliance.count;
                      }, 0);
                      const maxPossible = crewMembers.length * 4;
                      const percentage = Math.round((totalCompliance / maxPossible) * 100);
                      
                      return (
                        <Typography variant="h6" sx={{ 
                          color: percentage >= 80 ? theme.palette.success.main : 
                                 percentage >= 60 ? theme.palette.warning.main : 
                                 theme.palette.error.main,
                          fontWeight: 'bold'
                        }}>
                          {percentage}% Compliance
                        </Typography>
                      );
                    })()}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Compliance Alerts */}
            <Box sx={{ mt: 2 }}>
              {crewMembers.map((crew) => {
                const crewKey = getCrewMemberKey(crew.id);
                const crewData = field.value[crewKey];
                const compliance = getComplianceStatus(crewData);
                
                if (compliance.status === 'incomplete') {
                  return (
                    <Alert key={crew.id} severity="error" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{crew.label}</strong> is missing required PPE. 
                        Please ensure gloves and mask are properly worn before patient contact.
                      </Typography>
                    </Alert>
                  );
                }
                return null;
              })}
            </Box>
          </Box>
        )}
      />
    </Paper>
  );
}