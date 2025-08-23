import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface TraumaBloodLossProps {
  control: Control<EPCRData>;
}

const bodyLocations = [
  { key: 'head', label: 'Head' },
  { key: 'neckBack', label: 'Neck/Back' },
  { key: 'chest', label: 'Chest' },
  { key: 'abdomen', label: 'Abdomen' },
  { key: 'pelvis', label: 'Pelvis' },
  { key: 'legLeft', label: 'Leg (L)' },
  { key: 'legRight', label: 'Leg (R)' },
  { key: 'armLeft', label: 'Arm (L)' },
  { key: 'armRight', label: 'Arm (R)' },
];

const severityOptions = [
  { value: 'none', label: 'None' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
  { value: 'superficial', label: 'Superficial' },
];

export const TraumaBloodLoss: React.FC<TraumaBloodLossProps> = ({ control }) => {
  const TraumaRadioButton: React.FC<{ location: string; severity: string }> = ({ 
    location, 
    severity 
  }) => {
    const { field } = useController({
      name: `trauma.${location}` as any,
      control,
      defaultValue: 'none',
    });

    return (
      <Radio
        checked={field.value === severity}
        onChange={() => field.onChange(severity)}
        size="small"
        sx={{ p: 0.5 }}
      />
    );
  };

  return (
    <Box className="trauma-blood-loss-section" sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
        TRAUMA/BLOOD LOSS
      </Typography>
      
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #000' }}>
        <Table 
          size="small" 
          sx={{ 
            '& .MuiTableCell-root': { 
              border: '1px solid #000',
              padding: '4px',
              fontSize: '0.7rem',
              textAlign: 'center'
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '100px' }}>
                Body Location
              </TableCell>
              {severityOptions.map((severity) => (
                <TableCell 
                  key={severity.value}
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f5f5f5',
                    width: '80px'
                  }}
                >
                  {severity.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyLocations.map((location) => (
              <TableRow key={location.key}>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                  {location.label}
                </TableCell>
                {severityOptions.map((severity) => (
                  <TableCell key={severity.value}>
                    <TraumaRadioButton location={location.key} severity={severity.value} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};