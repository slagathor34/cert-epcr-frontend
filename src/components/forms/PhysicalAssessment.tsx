import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface PhysicalAssessmentProps {
  control: Control<EPCRData>;
}

const skinColorOptions = [
  'Normal', 'Cyanotic', 'Pale', 'Flushed', 'Jaundice', 'Ashen'
];

const skinTemperatureOptions = [
  'Normal', 'Hot', 'Warm', 'Cool', 'Cold'
];

const skinMoistureOptions = [
  'Normal', 'Moist', 'Wet', 'Dry'
];

const pupilOptions = [
  'Normal', 'Constricted', 'Dilated', 'Sluggish', 'Fixed'
];

const lungSoundOptions = [
  'Clear', 'Absent', 'Diminished', 'Crackles', 'Ronchi', 'Wheeze'
];

export const PhysicalAssessment: React.FC<PhysicalAssessmentProps> = ({ control }) => {
  const { field: skinColorField } = useController({
    name: 'physicalAssessment.skinColor',
    control,
    defaultValue: '',
  });

  const { field: skinTemperatureField } = useController({
    name: 'physicalAssessment.skinTemperature',
    control,
    defaultValue: '',
  });

  const { field: skinMoistureField } = useController({
    name: 'physicalAssessment.skinMoisture',
    control,
    defaultValue: '',
  });

  const { field: pupilLeftField } = useController({
    name: 'physicalAssessment.pupils.left',
    control,
    defaultValue: '',
  });

  const { field: pupilRightField } = useController({
    name: 'physicalAssessment.pupils.right',
    control,
    defaultValue: '',
  });

  const { field: perlField } = useController({
    name: 'physicalAssessment.perl',
    control,
    defaultValue: false,
  });

  const { field: lungSoundsLeftField } = useController({
    name: 'physicalAssessment.lungSounds.left',
    control,
    defaultValue: '',
  });

  const { field: lungSoundsRightField } = useController({
    name: 'physicalAssessment.lungSounds.right',
    control,
    defaultValue: '',
  });

  return (
    <Box className="physical-assessment-section" sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
        PHYSICAL ASSESSMENT
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #000', mb: 2 }}>
        <Grid container spacing={2}>
          {/* Skin Signs Section */}
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
              Skin Signs
            </Typography>
            
            {/* Skin Color */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', mb: 0.5, display: 'block' }}>
                Color:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {skinColorOptions.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        size="small"
                        checked={skinColorField.value === option}
                        onChange={() => skinColorField.onChange(
                          skinColorField.value === option ? '' : option
                        )}
                        sx={{ p: 0.5 }}
                      />
                    }
                    label={option}
                    sx={{ 
                      '& .MuiFormControlLabel-label': { fontSize: '0.7rem' },
                      mr: 1
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Skin Temperature */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', mb: 0.5, display: 'block' }}>
                Temperature:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {skinTemperatureOptions.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        size="small"
                        checked={skinTemperatureField.value === option}
                        onChange={() => skinTemperatureField.onChange(
                          skinTemperatureField.value === option ? '' : option
                        )}
                        sx={{ p: 0.5 }}
                      />
                    }
                    label={option}
                    sx={{ 
                      '& .MuiFormControlLabel-label': { fontSize: '0.7rem' },
                      mr: 1
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Skin Moisture */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', mb: 0.5, display: 'block' }}>
                Moisture:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {skinMoistureOptions.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        size="small"
                        checked={skinMoistureField.value === option}
                        onChange={() => skinMoistureField.onChange(
                          skinMoistureField.value === option ? '' : option
                        )}
                        sx={{ p: 0.5 }}
                      />
                    }
                    label={option}
                    sx={{ 
                      '& .MuiFormControlLabel-label': { fontSize: '0.7rem' },
                      mr: 1
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Pupils Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
              Pupils
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {pupilOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      checked={pupilLeftField.value === option || pupilRightField.value === option}
                      onChange={(e) => {
                        if (e.target.checked) {
                          pupilLeftField.onChange(option);
                          pupilRightField.onChange(option);
                        } else {
                          pupilLeftField.onChange('');
                          pupilRightField.onChange('');
                        }
                      }}
                      sx={{ p: 0.5 }}
                    />
                  }
                  label={option}
                  sx={{ 
                    '& .MuiFormControlLabel-label': { fontSize: '0.7rem' },
                    mr: 1
                  }}
                />
              ))}
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...perlField}
                    size="small"
                    sx={{ p: 0.5 }}
                  />
                }
                label="PERL"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.7rem' } }}
              />
              <Box display="flex" gap={1}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>L</Typography>
                <Checkbox size="small" sx={{ p: 0.5 }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>R</Typography>
                <Checkbox size="small" sx={{ p: 0.5 }} />
              </Box>
            </Box>
          </Grid>

          {/* Lung Sounds Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
              Lung Sounds
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {lungSoundOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      checked={
                        lungSoundsLeftField.value === option || 
                        lungSoundsRightField.value === option
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          lungSoundsLeftField.onChange(option);
                          lungSoundsRightField.onChange(option);
                        } else {
                          lungSoundsLeftField.onChange('');
                          lungSoundsRightField.onChange('');
                        }
                      }}
                      sx={{ p: 0.5 }}
                    />
                  }
                  label={option}
                  sx={{ 
                    '& .MuiFormControlLabel-label': { fontSize: '0.7rem' },
                    mr: 1
                  }}
                />
              ))}
            </Box>

            <Box display="flex" gap={1} alignItems="center">
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>L</Typography>
              <Checkbox size="small" sx={{ p: 0.5 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>R</Typography>
              <Checkbox size="small" sx={{ p: 0.5 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};