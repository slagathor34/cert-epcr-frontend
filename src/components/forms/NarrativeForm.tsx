import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface NarrativeFormProps {
  control: Control<EPCRData>;
}

const narrativeTemplates = [
  'Chest Pain Protocol',
  'Respiratory Distress',
  'Trauma Assessment',
  'Cardiac Arrest',
  'Overdose/Poisoning',
  'Mental Health Crisis',
  'Motor Vehicle Accident',
  'Fall Injury',
  'Stroke Assessment',
  'Allergic Reaction'
];

const commonPhrases = [
  'Patient found conscious and alert',
  'Vitals stable throughout transport',
  'Patient denies chest pain',
  'No acute distress noted',
  'Patient compliant with treatment',
  'Family on scene',
  'Advanced directive on file',
  'Medication compliance good',
  'Patient oriented x3',
  'No obvious trauma'
];

const assessmentFindings = [
  'Normal heart sounds',
  'Clear lung sounds bilaterally',
  'Abdomen soft and non-tender',
  'Extremities warm and dry',
  'Pupils equal and reactive',
  'No peripheral edema',
  'Skin warm, dry, and pink',
  'Capillary refill < 2 seconds',
  'No JVD noted',
  'Pulses strong and regular'
];

export const NarrativeForm: React.FC<NarrativeFormProps> = ({
  control,
}) => {
  const { field: narrativeField } = useController({
    name: 'narrative.description',
    control,
    defaultValue: '',
  });

  const { field: assessmentField } = useController({
    name: 'narrative.assessment',
    control,
    defaultValue: '',
  });

  const { field: planField } = useController({
    name: 'narrative.plan',
    control,
    defaultValue: '',
  });

  const { field: responseField } = useController({
    name: 'narrative.responseToTreatment',
    control,
    defaultValue: '',
  });

  const { field: findingsField } = useController({
    name: 'narrative.physicalFindings',
    control,
    defaultValue: [],
  });

  const insertTemplate = (template: string) => {
    const templates = {
      'Chest Pain Protocol': `EMS dispatched to ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} for chest pain. Patient found conscious and alert, complaining of chest discomfort. Vitals obtained and monitored throughout care. 12-lead ECG performed. Patient assessed for MI protocol. `,
      'Respiratory Distress': `EMS responded to respiratory distress call. Patient found in obvious respiratory distress with labored breathing. Oxygen saturation monitored. Positioned patient for comfort. Albuterol treatment considered per protocol. `,
      'Trauma Assessment': `EMS dispatched to trauma call. Primary survey completed with attention to airway, breathing, and circulation. Secondary assessment performed. C-spine precautions maintained throughout care. `,
      'Cardiac Arrest': `EMS responded to cardiac arrest. CPR in progress on arrival. ACLS protocol initiated. Defibrillation performed per protocol. Advanced airway established. `,
      'Motor Vehicle Accident': `EMS dispatched to motor vehicle accident. Scene safety established. Patient extricated from vehicle. Trauma assessment completed. Spinal immobilization maintained. `,
    };
    
    const templateText = templates[template as keyof typeof templates] || '';
    narrativeField.onChange(narrativeField.value + templateText);
  };

  const insertPhrase = (phrase: string) => {
    const currentText = narrativeField.value;
    const newText = currentText + (currentText ? '. ' : '') + phrase;
    narrativeField.onChange(newText);
  };

  const toggleFinding = (finding: string) => {
    const currentFindings = findingsField.value || [];
    const isSelected = currentFindings.includes(finding);
    
    if (isSelected) {
      findingsField.onChange(currentFindings.filter((f: string) => f !== finding));
    } else {
      findingsField.onChange([...currentFindings, finding]);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Narrative
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        {/* Templates Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Quick Templates & Phrases</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>Templates:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {narrativeTemplates.map(template => (
                    <Chip
                      key={template}
                      label={template}
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={() => insertTemplate(template)}
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>Common Phrases:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonPhrases.map(phrase => (
                    <Chip
                      key={phrase}
                      label={phrase}
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={() => insertPhrase(phrase)}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Main Narrative */}
          <Grid item xs={12}>
            <TextField
              {...narrativeField}
              label="Patient Care Narrative"
              placeholder="Provide a detailed narrative of the patient encounter, treatments provided, and patient response..."
              fullWidth
              multiline
              rows={8}
              required
              helperText="Include dispatch info, scene findings, patient presentation, treatments, response to care, and transport details"
            />
          </Grid>

          {/* Assessment */}
          <Grid item xs={12} md={6}>
            <TextField
              {...assessmentField}
              label="Clinical Assessment"
              placeholder="Your clinical impression and assessment of the patient..."
              fullWidth
              multiline
              rows={4}
              helperText="Primary impression, differential diagnoses, and clinical reasoning"
            />
          </Grid>

          {/* Plan */}
          <Grid item xs={12} md={6}>
            <TextField
              {...planField}
              label="Treatment Plan"
              placeholder="Treatment plan and ongoing care recommendations..."
              fullWidth
              multiline
              rows={4}
              helperText="Interventions provided, medications given, and continuing care plan"
            />
          </Grid>

          {/* Response to Treatment */}
          <Grid item xs={12}>
            <TextField
              {...responseField}
              label="Response to Treatment"
              placeholder="How did the patient respond to interventions?"
              fullWidth
              multiline
              rows={2}
              helperText="Document patient's response to medications, procedures, and interventions"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Physical Findings Checklist */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Physical Assessment Findings
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select all applicable findings from your physical assessment:
          </Typography>
          
          <FormControl component="fieldset">
            <FormGroup row>
              {assessmentFindings.map((finding) => (
                <FormControlLabel
                  key={finding}
                  control={
                    <Checkbox
                      checked={findingsField.value?.includes(finding) || false}
                      onChange={() => toggleFinding(finding)}
                      size="small"
                    />
                  }
                  label={finding}
                  sx={{ 
                    minWidth: '300px',
                    '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>

        {/* AI Assistance Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeIcon />}
            color="primary"
          >
            Generate AI Summary
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Use AI to help generate or improve your narrative based on entered data
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};