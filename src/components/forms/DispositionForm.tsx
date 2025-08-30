import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormGroup,
  Divider,
  Chip,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Home as HomeIcon,
  Cancel as CancelIcon,
  PersonOff as RefusedIcon,
} from '@mui/icons-material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface DispositionFormProps {
  control: Control<EPCRData>;
}

const dispositionTypes = [
  { value: 'transport', label: 'Transported', icon: HospitalIcon },
  { value: 'refusal', label: 'Refused Care', icon: RefusedIcon },
  { value: 'cancelled', label: 'Cancelled', icon: CancelIcon },
  { value: 'no-transport', label: 'Treated - No Transport', icon: HomeIcon },
];

const transportMethods = [
  'Ground Ambulance',
  'Air Medical',
  'Private Vehicle',
  'Other EMS Unit',
  'Walk-in'
];

const transportPriorities = [
  { value: 'emergency', label: 'Emergency (Lights & Siren)' },
  { value: 'priority', label: 'Priority (No L&S)' },
  { value: 'routine', label: 'Routine' },
];

const patientConditions = [
  'Improved',
  'Unchanged', 
  'Worse',
  'Stable',
  'Critical'
];

const refusalTypes = [
  'Refused all care',
  'Refused transport only',
  'Left AMA (Against Medical Advice)',
  'Patient competent to refuse'
];

const commonDestinations = [
  'Springfield General Hospital',
  'Memorial Medical Center',
  'St. John\'s Hospital',
  'HSHS St. John\'s Children\'s Hospital',
  'OSF HealthCare Saint Francis',
];

export const DispositionForm: React.FC<DispositionFormProps> = ({
  control,
}) => {
  const { field: dispositionTypeField } = useController({
    name: 'disposition.type',
    control,
    defaultValue: 'transport' as const,
  });

  const { field: destinationField } = useController({
    name: 'disposition.destination',
    control,
    defaultValue: '',
  });

  const { field: transportMethodField } = useController({
    name: 'disposition.transportMethod',
    control,
    defaultValue: '',
  });

  const { field: transportPriorityField } = useController({
    name: 'disposition.transportPriority',
    control,
    defaultValue: '',
  });

  const { field: patientConditionField } = useController({
    name: 'disposition.patientCondition',
    control,
    defaultValue: '',
  });

  const { field: refusalTypeField } = useController({
    name: 'disposition.refusalType',
    control,
    defaultValue: '',
  });

  const { field: refusalWitnessField } = useController({
    name: 'disposition.refusalWitness',
    control,
    defaultValue: '',
  });

  const { field: handoffProviderField } = useController({
    name: 'disposition.handoffProvider',
    control,
    defaultValue: '',
  });

  const { field: handoffTimeField } = useController({
    name: 'disposition.handoffTime',
    control,
    defaultValue: '',
  });

  const { field: notesField } = useController({
    name: 'disposition.notes',
    control,
    defaultValue: '',
  });

  const { field: followupInstructionsField } = useController({
    name: 'disposition.followupInstructions',
    control,
    defaultValue: '',
  });

  const showTransportFields = dispositionTypeField.value === 'transport';
  const showRefusalFields = dispositionTypeField.value === 'refusal';

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Patient Disposition
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Disposition Type */}
          <Grid item xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Final Disposition</FormLabel>
              <RadioGroup
                {...dispositionTypeField}
                row
                sx={{ gap: 2, mt: 1 }}
              >
                {dispositionTypes.map(({ value, label, icon: Icon }) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon fontSize="small" />
                        {label}
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Transport Fields */}
          {showTransportFields && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Chip label="Transport Information" />
                </Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...destinationField}
                  label="Destination"
                  fullWidth
                  required
                  placeholder="Hospital or facility name"
                  helperText="Select common destination or enter manually"
                />
                <Box sx={{ mt: 1 }}>
                  {commonDestinations.map(dest => (
                    <Chip
                      key={dest}
                      label={dest}
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={() => destinationField.onChange(dest)}
                      sx={{ m: 0.25 }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Transport Method</InputLabel>
                  <Select {...transportMethodField} label="Transport Method">
                    {transportMethods.map(method => (
                      <MenuItem key={method} value={method}>{method}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Transport Priority</InputLabel>
                  <Select {...transportPriorityField} label="Transport Priority">
                    {transportPriorities.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...handoffTimeField}
                  label="Hospital Handoff Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...handoffProviderField}
                  label="Receiving Provider"
                  fullWidth
                  placeholder="Name and title of receiving healthcare provider"
                />
              </Grid>
            </>
          )}

          {/* Refusal Fields */}
          {showRefusalFields && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Chip label="Refusal Information" />
                </Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Refusal Type</InputLabel>
                  <Select {...refusalTypeField} label="Refusal Type">
                    {refusalTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...refusalWitnessField}
                  label="Witness to Refusal"
                  fullWidth
                  placeholder="Name of witness (family member, police, etc.)"
                />
              </Grid>
            </>
          )}

          {/* Common Fields */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Chip label="Patient Status" />
            </Divider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Patient Condition at Disposition</InputLabel>
              <Select {...patientConditionField} label="Patient Condition at Disposition">
                {patientConditions.map(condition => (
                  <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...followupInstructionsField}
              label="Follow-up Instructions Given"
              fullWidth
              multiline
              rows={2}
              placeholder="Instructions provided to patient/family for follow-up care"
              helperText="Document any instructions given to patient or family"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...notesField}
              label="Disposition Notes"
              fullWidth
              multiline
              rows={3}
              placeholder="Additional notes about the patient disposition..."
              helperText="Any additional relevant information about the disposition"
            />
          </Grid>

          {/* Quality Metrics */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Chip label="Quality Indicators" />
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Quality Indicators (check all that apply)</FormLabel>
              <FormGroup row sx={{ mt: 1 }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Patient satisfied with care"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Family satisfied with care"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Smooth handoff to receiving facility"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="All protocols followed"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Complete documentation"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="No complications during transport"
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};