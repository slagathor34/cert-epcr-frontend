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
  useTheme,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Controller, Control } from 'react-hook-form';
import { PPECompliance } from '../../types/epcr';

interface PPETrackingGridProps {
  control: Control<any>;
  name: string;
  label?: string;
  crewMembers?: Array<{ designation: 'A' | 'B' | 'C' | 'D' | 'E'; name: string }>;
}

const ppeItems = [
  { key: 'gloves', label: 'Gloves', required: true },
  { key: 'mask', label: 'Mask', required: true },
  { key: 'gown', label: 'Gown', required: false },
  { key: 'eyeProtection', label: 'Eye Protection', required: false },
] as const;

const defaultCrewMembers = [
  { designation: 'A' as const, name: 'Crew Member A' },
  { designation: 'B' as const, name: 'Crew Member B' },
  { designation: 'C' as const, name: 'Crew Member C' },
  { designation: 'D' as const, name: 'Crew Member D' },
  { designation: 'E' as const, name: 'Crew Member E' },
];

export function PPETrackingGrid({ 
  control, 
  name, 
  label = 'PPE Compliance Tracking',
  crewMembers = defaultCrewMembers
}: PPETrackingGridProps) {
  const theme = useTheme();

  const getComplianceStatus = (crewMemberIndex: number, fields: any[]) => {
    const crewMember = crewMembers[crewMemberIndex];
    const compliance = fields.find((field: any) => field.crewMember === crewMember.designation);
    
    if (!compliance) {
      return { status: 'unknown', count: 0, total: 4 };
    }

    const requiredItems = ppeItems.filter(item => item.required);
    const allItems = ppeItems;
    
    const requiredCompliant = requiredItems.every(item => compliance[item.key]);
    const totalCompliant = allItems.reduce((count, item) => count + (compliance[item.key] ? 1 : 0), 0);
    
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
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'required':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'incomplete':
        return <CancelIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <WarningIcon sx={{ color: theme.palette.grey[400] }} />;
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
          Gown and Eye Protection may be required based on exposure risk.
        </Typography>
      </Alert>

      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const ensureCompliance = (crewMember: 'A' | 'B' | 'C' | 'D' | 'E') => {
            const existing = field.value.find((item: PPECompliance) => item.crewMember === crewMember);
            if (!existing) {
              const newCompliance: PPECompliance = {
                crewMember,
                gloves: false,
                mask: false,
                gown: false,
                eyeProtection: false,
              };
              field.onChange([...field.value, newCompliance]);
              return newCompliance;
            }
            return existing;
          };

          const updateCompliance = (crewMember: 'A' | 'B' | 'C' | 'D' | 'E', ppeItem: keyof Omit<PPECompliance, 'crewMember'>, checked: boolean) => {
            const updated = field.value.map((item: PPECompliance) => 
              item.crewMember === crewMember 
                ? { ...item, [ppeItem]: checked }
                : item
            );
            
            // If crew member doesn't exist, add them
            if (!field.value.find((item: PPECompliance) => item.crewMember === crewMember)) {
              updated.push({
                crewMember,
                gloves: ppeItem === 'gloves' ? checked : false,
                mask: ppeItem === 'mask' ? checked : false,
                gown: ppeItem === 'gown' ? checked : false,
                eyeProtection: ppeItem === 'eyeProtection' ? checked : false,
              });
            }
            
            field.onChange(updated);
          };

          const isChecked = (crewMember: 'A' | 'B' | 'C' | 'D' | 'E', ppeItem: keyof Omit<PPECompliance, 'crewMember'>) => {
            const compliance = field.value.find((item: PPECompliance) => item.crewMember === crewMember);
            return compliance ? compliance[ppeItem] : false;
          };

          return (
            <Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                        Crew Member
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Status
                      </TableCell>
                      {ppeItems.map((item) => (
                        <TableCell 
                          key={item.key} 
                          sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'center',
                            backgroundColor: item.required ? theme.palette.warning.light : 'transparent',
                            color: item.required ? theme.palette.warning.contrastText : 'inherit',
                          }}
                        >
                          {item.label}
                          {item.required && (
                            <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem' }}>
                              *Required
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {crewMembers.map((member, memberIndex) => {
                      const compliance = getComplianceStatus(memberIndex, field.value);
                      
                      return (
                        <TableRow key={member.designation} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={member.designation}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  fontWeight: 'bold',
                                  minWidth: 32,
                                }}
                              />
                              <Typography variant="body2">
                                {member.name}
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
                          
                          {ppeItems.map((item) => (
                            <TableCell key={item.key} sx={{ textAlign: 'center' }}>
                              <Checkbox
                                checked={isChecked(member.designation, item.key)}
                                onChange={(e) => updateCompliance(member.designation, item.key, e.target.checked)}
                                color="primary"
                                size="small"
                                sx={{
                                  '&.Mui-checked': {
                                    color: item.required ? theme.palette.warning.main : theme.palette.primary.main,
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
              <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Compliance Summary
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {crewMembers.map((member, index) => {
                    const compliance = getComplianceStatus(index, field.value);
                    return (
                      <Chip
                        key={member.designation}
                        label={`${member.designation}: ${compliance.count}/${compliance.total}`}
                        size="small"
                        icon={getStatusIcon(compliance.status)}
                        sx={{
                          backgroundColor: getStatusColor(compliance.status),
                          color: 'white',
                          '& .MuiChip-icon': {
                            color: 'white !important',
                          }
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              {/* Compliance Alerts */}
              <Box sx={{ mt: 2 }}>
                {crewMembers.map((member, index) => {
                  const compliance = getComplianceStatus(index, field.value);
                  if (compliance.status === 'incomplete') {
                    return (
                      <Alert key={member.designation} severity="error" sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>{member.name} ({member.designation})</strong> is missing required PPE. 
                          Please ensure gloves and mask are properly worn.
                        </Typography>
                      </Alert>
                    );
                  }
                  return null;
                })}
              </Box>
            </Box>
          );
        }}
      />
    </Paper>
  );
}