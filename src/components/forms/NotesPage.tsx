import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface NotesPageProps {
  control: Control<EPCRData>;
}

export const NotesPage: React.FC<NotesPageProps> = ({ control }) => {
  const { field: narrativeField } = useController({
    name: 'notesPage.narrative',
    control,
    defaultValue: '',
  });

  return (
    <Box className="notes-page-section" sx={{ mb: 2, pageBreakBefore: 'always' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        FIRST RESPONDER EMERGENCY RECORD - PAGE 2
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #000', minHeight: '600px' }}>
        <Typography variant="body1" sx={{ fontSize: '0.9rem', fontWeight: 'bold', mb: 2 }}>
          NOTES:
        </Typography>
        
        <TextField
          {...narrativeField}
          multiline
          fullWidth
          variant="outlined"
          rows={25}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'transparent',
              fontSize: '0.8rem',
              lineHeight: 1.8,
            },
            '& .MuiInputBase-input': {
              padding: '8px',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
            // Create lined paper effect
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent 28px,
              #ccc 28px,
              #ccc 29px
            )`,
            backgroundSize: '100% 29px',
            backgroundAttachment: 'local',
          }}
          placeholder="Document patient care narrative, assessment findings, treatment provided, and patient response..."
        />
      </Paper>
    </Box>
  );
};