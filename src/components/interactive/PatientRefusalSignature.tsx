import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Edit as SignIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Controller, Control } from 'react-hook-form';

interface SignaturePadData {
  patientSignature?: string;
  patientName: string;
  patientDate: string;
  witnessSignature?: string;
  witnessName: string;
  witnessDate: string;
  refusalReason: string;
  risksExplained: boolean;
  patientCompetent: boolean;
  alternativesOffered: boolean;
}

interface PatientRefusalSignatureProps {
  control: Control<any>;
  name: string;
  label?: string;
}

// Simple signature pad component using canvas
const SignaturePad: React.FC<{
  width?: number;
  height?: number;
  onSignatureChange: (signature: string) => void;
  signature?: string;
}> = ({ width = 400, height = 150, onSignatureChange, signature }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up canvas
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Load existing signature if provided
    if (signature) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = signature;
    }
  }, [signature]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      onSignatureChange(signatureData);
    }
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onSignatureChange('');
    }
  };
  
  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'crosshair',
          backgroundColor: '#fff',
        }}
      />
      <Button
        size="small"
        startIcon={<ClearIcon />}
        onClick={clearSignature}
        sx={{ mt: 1 }}
      >
        Clear
      </Button>
    </Box>
  );
};

export function PatientRefusalSignature({ 
  control, 
  name, 
  label = 'Patient Refusal of Care' 
}: PatientRefusalSignatureProps) {
  const theme = useTheme();
  const [patientDialog, setPatientDialog] = useState(false);
  const [witnessDialog, setWitnessDialog] = useState(false);

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-US'),
      time: now.toLocaleTimeString('en-US', { hour12: false })
    };
  };

  const refusalText = `I acknowledge that I have been advised by Sacramento Fire Department personnel that my condition may be serious and that I should go to a hospital for evaluation and treatment. I understand that my refusal to accept treatment and/or transport may result in serious harm to my health, including permanent disability or death.

I understand that the Sacramento Fire Department personnel have explained:
• The nature of my condition or injury
• The recommended treatment and/or transport
• The risks associated with refusal of care
• Alternative treatment options available

Despite these explanations and warnings, I voluntarily refuse the recommended medical care and/or transport. I assume full responsibility for any consequences that may result from my refusal.

I acknowledge that I am mentally competent to make this decision and am not under the influence of alcohol or drugs that would impair my judgment.`;

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 2,
        backgroundColor: theme.palette.warning.light + '20',
        border: `2px solid ${theme.palette.warning.main}`,
        '@media print': {
          boxShadow: 'none',
          border: '2px solid #000',
          pageBreakInside: 'avoid',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <WarningIcon color="warning" />
        <Typography variant="h6" sx={{ color: theme.palette.warning.dark, fontWeight: 'bold' }}>
          {label}
        </Typography>
      </Box>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>IMPORTANT:</strong> This form must be completed when a patient refuses medical care or transport. 
          Ensure all risks have been explained and the patient demonstrates competency to refuse care.
        </Typography>
      </Alert>

      <Controller
        name={name}
        control={control}
        defaultValue={{
          patientName: '',
          patientDate: '',
          patientSignature: '',
          witnessName: '',
          witnessDate: '',
          witnessSignature: '',
          refusalReason: '',
          risksExplained: false,
          patientCompetent: false,
          alternativesOffered: false,
        }}
        render={({ field }) => (
          <Box>
            {/* Legal Text */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: 1,
              mb: 3
            }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {refusalText}
              </Typography>
            </Box>

            {/* Refusal Reason */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Reason for Refusal
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Document the patient's stated reason for refusing care..."
                value={field.value.refusalReason}
                onChange={(e) => field.onChange({ ...field.value, refusalReason: e.target.value })}
                variant="outlined"
              />
            </Box>

            {/* Compliance Checklist */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Required Documentation (Check all that apply)
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.risksExplained}
                        onChange={(e) => field.onChange({ 
                          ...field.value, 
                          risksExplained: e.target.checked 
                        })}
                      />
                    }
                    label="Risks and consequences of refusal were explained to the patient"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.patientCompetent}
                        onChange={(e) => field.onChange({ 
                          ...field.value, 
                          patientCompetent: e.target.checked 
                        })}
                      />
                    }
                    label="Patient demonstrated mental competency to make this decision"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.alternativesOffered}
                        onChange={(e) => field.onChange({ 
                          ...field.value, 
                          alternativesOffered: e.target.checked 
                        })}
                      />
                    }
                    label="Alternative care options and resources were offered"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Signature Areas */}
            <Grid container spacing={3}>
              {/* Patient Signature */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 2, 
                  border: '1px solid #ddd', 
                  borderRadius: 1,
                  backgroundColor: '#fff'
                }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Patient Signature
                  </Typography>
                  
                  {field.value.patientSignature ? (
                    <Box>
                      <img 
                        src={field.value.patientSignature} 
                        alt="Patient Signature"
                        style={{ 
                          maxWidth: '100%', 
                          height: '80px',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <Button
                        size="small"
                        startIcon={<SignIcon />}
                        onClick={() => setPatientDialog(true)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Re-sign
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={() => field.onChange({ 
                          ...field.value, 
                          patientSignature: '',
                          patientName: '',
                          patientDate: ''
                        })}
                        color="error"
                        sx={{ mt: 1 }}
                      >
                        Clear
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<SignIcon />}
                      onClick={() => setPatientDialog(true)}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Sign Here
                    </Button>
                  )}

                  {field.value.patientSignature && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Print Name"
                        value={field.value.patientName}
                        onChange={(e) => field.onChange({ 
                          ...field.value, 
                          patientName: e.target.value 
                        })}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Date"
                        value={field.value.patientDate}
                        onChange={(e) => field.onChange({ 
                          ...field.value, 
                          patientDate: e.target.value 
                        })}
                        placeholder="MM/DD/YYYY"
                      />
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Witness Signature */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 2, 
                  border: '1px solid #ddd', 
                  borderRadius: 1,
                  backgroundColor: '#fff'
                }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Witness Signature (SFD Personnel)
                  </Typography>
                  
                  {field.value.witnessSignature ? (
                    <Box>
                      <img 
                        src={field.value.witnessSignature} 
                        alt="Witness Signature"
                        style={{ 
                          maxWidth: '100%', 
                          height: '80px',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <Button
                        size="small"
                        startIcon={<SignIcon />}
                        onClick={() => setWitnessDialog(true)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Re-sign
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={() => field.onChange({ 
                          ...field.value, 
                          witnessSignature: '',
                          witnessName: '',
                          witnessDate: ''
                        })}
                        color="error"
                        sx={{ mt: 1 }}
                      >
                        Clear
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<SignIcon />}
                      onClick={() => setWitnessDialog(true)}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Sign Here
                    </Button>
                  )}

                  {field.value.witnessSignature && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Print Name & Certification"
                        value={field.value.witnessName}
                        onChange={(e) => field.onChange({ 
                          ...field.value, 
                          witnessName: e.target.value 
                        })}
                        placeholder="John Doe, EMT-B #12345"
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Date"
                        value={field.value.witnessDate}
                        onChange={(e) => field.onChange({ 
                          ...field.value, 
                          witnessDate: e.target.value 
                        })}
                        placeholder="MM/DD/YYYY"
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Validation Alert */}
            {(!field.value.risksExplained || !field.value.patientCompetent || 
              !field.value.alternativesOffered || !field.value.patientSignature || 
              !field.value.witnessSignature) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Incomplete Refusal Documentation:</strong> All checkboxes must be selected and both patient and witness signatures are required for a valid refusal.
                </Typography>
              </Alert>
            )}

            {/* Patient Signature Dialog */}
            <Dialog 
              open={patientDialog} 
              onClose={() => setPatientDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Patient Signature</DialogTitle>
              <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Please have the patient sign below to acknowledge refusal of medical care:
                </Typography>
                <SignaturePad
                  width={400}
                  height={150}
                  signature={field.value.patientSignature}
                  onSignatureChange={(signature) => {
                    const dateTime = getCurrentDateTime();
                    field.onChange({ 
                      ...field.value, 
                      patientSignature: signature,
                      patientDate: field.value.patientDate || dateTime.date
                    });
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPatientDialog(false)}>Cancel</Button>
                <Button 
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => setPatientDialog(false)}
                  disabled={!field.value.patientSignature}
                >
                  Save Signature
                </Button>
              </DialogActions>
            </Dialog>

            {/* Witness Signature Dialog */}
            <Dialog 
              open={witnessDialog} 
              onClose={() => setWitnessDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>SFD Witness Signature</DialogTitle>
              <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Sign below to witness the patient's refusal of medical care:
                </Typography>
                <SignaturePad
                  width={400}
                  height={150}
                  signature={field.value.witnessSignature}
                  onSignatureChange={(signature) => {
                    const dateTime = getCurrentDateTime();
                    field.onChange({ 
                      ...field.value, 
                      witnessSignature: signature,
                      witnessDate: field.value.witnessDate || dateTime.date
                    });
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setWitnessDialog(false)}>Cancel</Button>
                <Button 
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => setWitnessDialog(false)}
                  disabled={!field.value.witnessSignature}
                >
                  Save Signature
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      />
    </Paper>
  );
}