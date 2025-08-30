import React from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Control, useController, useFieldArray } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface MedicationsAndProceduresFormProps {
  control: Control<EPCRData>;
}

const commonMedications = [
  'Aspirin', 'Nitroglycerin', 'Albuterol', 'Epinephrine', 'Atropine',
  'Morphine', 'Fentanyl', 'Dextrose', 'Naloxone', 'Diphenhydramine',
  'Lorazepam', 'Midazolam', 'Adenosine', 'Amiodarone', 'Lidocaine'
];

const commonProcedures = [
  'IV Access', 'Intubation', 'Chest Compressions', 'Defibrillation',
  'Cardioversion', 'Needle Decompression', 'Splinting', 'Bandaging',
  'Oxygen Administration', 'Bag Valve Mask', 'King Airway', 'C-Collar',
  'Spinal Immobilization', '12-Lead ECG', 'Wound Care'
];

const medicationRoutes = [
  'IV', 'IM', 'SQ', 'PO', 'SL', 'Inhaled', 'Topical', 'PR', 'IO', 'ET'
];

export const MedicationsAndProceduresForm: React.FC<MedicationsAndProceduresFormProps> = ({
  control,
}) => {
  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = useFieldArray({
    control,
    name: 'medications',
  });

  const { fields: procedureFields, append: appendProcedure, remove: removeProcedure } = useFieldArray({
    control,
    name: 'procedures',
  });

  const addMedication = () => {
    appendMedication({
      name: '',
      dose: '',
      route: '',
      time: '',
      administeredBy: '',
      effect: '',
    });
  };

  const addProcedure = () => {
    appendProcedure({
      name: '',
      time: '',
      performedBy: '',
      outcome: '',
      complications: '',
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Medications & Procedures
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        {/* Medications Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Medications</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={addMedication}
                variant="outlined"
                size="small"
              >
                Add Medication
              </Button>
            </Box>

            {medicationFields.length > 0 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dose</TableCell>
                      <TableCell>Route</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Given By</TableCell>
                      <TableCell>Effect</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicationFields.map((field, index) => (
                      <MedicationRow
                        key={field.id}
                        control={control}
                        index={index}
                        onRemove={() => removeMedication(index)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Common medications: {commonMedications.map(med => (
                  <Chip
                    key={med}
                    label={med}
                    size="small"
                    variant="outlined"
                    sx={{ m: 0.25 }}
                  />
                ))}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Procedures Section */}
        <Accordion defaultExpanded sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Procedures</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={addProcedure}
                variant="outlined"
                size="small"
              >
                Add Procedure
              </Button>
            </Box>

            {procedureFields.length > 0 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Procedure</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Performed By</TableCell>
                      <TableCell>Outcome</TableCell>
                      <TableCell>Complications</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {procedureFields.map((field, index) => (
                      <ProcedureRow
                        key={field.id}
                        control={control}
                        index={index}
                        onRemove={() => removeProcedure(index)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Common procedures: {commonProcedures.map(proc => (
                  <Chip
                    key={proc}
                    label={proc}
                    size="small"
                    variant="outlined"
                    sx={{ m: 0.25 }}
                  />
                ))}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
};

interface MedicationRowProps {
  control: Control<EPCRData>;
  index: number;
  onRemove: () => void;
}

const MedicationRow: React.FC<MedicationRowProps> = ({ control, index, onRemove }) => {
  const { field: nameField } = useController({
    name: `medications.${index}.name`,
    control,
    defaultValue: '',
  });

  const { field: doseField } = useController({
    name: `medications.${index}.dose`,
    control,
    defaultValue: '',
  });

  const { field: routeField } = useController({
    name: `medications.${index}.route`,
    control,
    defaultValue: '',
  });

  const { field: timeField } = useController({
    name: `medications.${index}.time`,
    control,
    defaultValue: '',
  });

  const { field: administeredByField } = useController({
    name: `medications.${index}.administeredBy`,
    control,
    defaultValue: '',
  });

  const { field: effectField } = useController({
    name: `medications.${index}.effect`,
    control,
    defaultValue: '',
  });

  return (
    <TableRow>
      <TableCell>
        <TextField
          {...nameField}
          size="small"
          fullWidth
          placeholder="Medication name"
        />
      </TableCell>
      <TableCell>
        <TextField
          {...doseField}
          size="small"
          fullWidth
          placeholder="Dose & units"
        />
      </TableCell>
      <TableCell>
        <FormControl size="small" fullWidth>
          <Select {...routeField} displayEmpty>
            <MenuItem value="">Select route</MenuItem>
            {medicationRoutes.map(route => (
              <MenuItem key={route} value={route}>{route}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <TextField
          {...timeField}
          size="small"
          type="time"
          fullWidth
        />
      </TableCell>
      <TableCell>
        <TextField
          {...administeredByField}
          size="small"
          fullWidth
          placeholder="Provider name"
        />
      </TableCell>
      <TableCell>
        <TextField
          {...effectField}
          size="small"
          fullWidth
          placeholder="Patient response"
        />
      </TableCell>
      <TableCell>
        <IconButton size="small" onClick={onRemove} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

interface ProcedureRowProps {
  control: Control<EPCRData>;
  index: number;
  onRemove: () => void;
}

const ProcedureRow: React.FC<ProcedureRowProps> = ({ control, index, onRemove }) => {
  const { field: nameField } = useController({
    name: `procedures.${index}.name`,
    control,
    defaultValue: '',
  });

  const { field: timeField } = useController({
    name: `procedures.${index}.time`,
    control,
    defaultValue: '',
  });

  const { field: performedByField } = useController({
    name: `procedures.${index}.performedBy`,
    control,
    defaultValue: '',
  });

  const { field: outcomeField } = useController({
    name: `procedures.${index}.outcome`,
    control,
    defaultValue: '',
  });

  const { field: complicationsField } = useController({
    name: `procedures.${index}.complications`,
    control,
    defaultValue: '',
  });

  return (
    <TableRow>
      <TableCell>
        <TextField
          {...nameField}
          size="small"
          fullWidth
          placeholder="Procedure name"
        />
      </TableCell>
      <TableCell>
        <TextField
          {...timeField}
          size="small"
          type="time"
          fullWidth
        />
      </TableCell>
      <TableCell>
        <TextField
          {...performedByField}
          size="small"
          fullWidth
          placeholder="Provider name"
        />
      </TableCell>
      <TableCell>
        <TextField
          {...outcomeField}
          size="small"
          fullWidth
          placeholder="Successful/Failed"
        />
      </TableCell>
      <TableCell>
        <TextField
          {...complicationsField}
          size="small"
          fullWidth
          placeholder="None or describe"
        />
      </TableCell>
      <TableCell>
        <IconButton size="small" onClick={onRemove} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};