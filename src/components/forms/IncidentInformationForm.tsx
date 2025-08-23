import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  TextField,
  Chip,
  Button,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Control, useWatch, useFormContext } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';
import { FormField } from '../ui/FormField';

interface IncidentInformationFormProps {
  control: Control<EPCRData>;
}

export const IncidentInformationForm: React.FC<IncidentInformationFormProps> = ({
  control,
}) => {
  const { setValue } = useFormContext();
  const respondingUnits = useWatch({
    control,
    name: 'incidentInformation.respondingUnits',
    defaultValue: []
  }) || [];

  const [newUnit, setNewUnit] = React.useState('');

  const handleAddUnit = () => {
    if (newUnit.trim()) {
      const updatedUnits = [...respondingUnits, newUnit.trim()];
      setValue('incidentInformation.respondingUnits', updatedUnits, { shouldDirty: true });
      setNewUnit('');
    }
  };

  const handleRemoveUnit = (index: number) => {
    const updatedUnits = respondingUnits.filter((_: string, i: number) => i !== index);
    setValue('incidentInformation.respondingUnits', updatedUnits, { shouldDirty: true });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddUnit();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="incident-section">
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Incident Information
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2}>
        {/* Date and Time */}
        <Grid item xs={12} sm={6} md={3}>
          <FormField
            name="incidentInformation.date"
            control={control}
            label="Date"
            type="date"
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormField
            name="incidentInformation.time"
            control={control}
            label="Time"
            type="time"
            required
          />
        </Grid>

        {/* Patient Number */}
        <Grid item xs={12} sm={6} md={3}>
          <FormField
            name="incidentInformation.patientNumber"
            control={control}
            label="Patient #"
            type="number"
            required
            helperText="Current patient number"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormField
            name="incidentInformation.totalPatients"
            control={control}
            label="of # Total"
            type="number"
            required
            helperText="Total patients on scene"
          />
        </Grid>

        {/* Responding Units */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1, mt: 1 }}>
            Responding Units
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter unit number or name"
                sx={{ flexGrow: 1 }}
                variant="outlined"
              />
              <Button
                onClick={handleAddUnit}
                disabled={!newUnit.trim()}
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {respondingUnits.map((unit: string, index: number) => (
                <Chip
                  key={`unit-${index}`}
                  label={unit || `Unit ${index + 1}`}
                  onDelete={() => handleRemoveUnit(index)}
                  variant="outlined"
                  size="small"
                />
              ))}
              {respondingUnits.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No units added yet
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
        
        {/* Location */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1, mt: 2 }}>
            Incident Location
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormField
            name="incidentInformation.incidentLocation"
            control={control}
            label="Street Address"
            type="text"
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormField
            name="incidentInformation.city"
            control={control}
            label="City"
            type="text"
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <FormField
            name="incidentInformation.state"
            control={control}
            label="State"
            type="text"
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <FormField
            name="incidentInformation.zip"
            control={control}
            label="ZIP"
            type="text"
            required
          />
        </Grid>

        {/* Additional Location Details */}
        <Grid item xs={12} sm={4}>
          <FormField
            name="incidentInformation.milepost"
            control={control}
            label="Milepost"
            type="text"
            helperText="Highway milepost if applicable"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            name="incidentInformation.crossStreets"
            control={control}
            label="Cross Streets"
            type="text"
            helperText="Nearest intersecting streets"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            name="incidentInformation.mapCoordinates"
            control={control}
            label="Map Coordinates"
            type="text"
            helperText="GPS coordinates if available"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};