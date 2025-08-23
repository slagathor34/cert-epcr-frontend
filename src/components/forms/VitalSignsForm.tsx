import React from 'react';
import { Typography } from '@mui/material';
import { Control } from 'react-hook-form';

interface VitalSignsFormProps {
  control: Control<any>;
  onAddVitalSigns: () => void;
  onRemoveVitalSigns: (index: number) => void;
}

export const VitalSignsForm: React.FC<VitalSignsFormProps> = ({ 
  control, 
  onAddVitalSigns, 
  onRemoveVitalSigns 
}) => {
  return (
    <Typography variant="body2" color="text.secondary">
      Vital Signs Form - Coming Soon
    </Typography>
  );
};