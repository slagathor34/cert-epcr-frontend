import React from 'react';
import { Typography } from '@mui/material';
import { Control } from 'react-hook-form';

interface VitalSignsTimeTableProps {
  control: Control<any>;
  name: string;
  label?: string;
}

export const VitalSignsTimeTable: React.FC<VitalSignsTimeTableProps> = ({ 
  control, 
  name, 
  label = 'Vital Signs Time Table' 
}) => {
  return (
    <Typography variant="body2" color="text.secondary">
      {label} - Coming Soon
    </Typography>
  );
};