import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  ContactPhone as ContactIcon,
  Radio as RadioIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { MemberFormData } from '../../types/member';
import memberService from '../../services/memberService';

// Validation schema
const memberSchema = yup.object({
  firstName: yup.string().required('First name is required').max(50, 'First name too long'),
  lastName: yup.string().required('Last name is required').max(50, 'Last name too long'),
  nickname: yup.string().optional().max(30, 'Nickname too long'),
  email: yup.string().optional().email('Invalid email format'),
  phone: yup.string().optional().matches(/^[\d\-\(\)\+\s]+$/, 'Invalid phone format'),
  status: yup.string().required('Status is required'),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().optional().oneOf(['Male', 'Female', 'Other', 'Prefer not to say']),
  fccLicense: yup.object({
    callsign: yup.string().optional().matches(/^[A-Z0-9]*$/, 'Callsign must be uppercase letters and numbers'),
    level: yup.string().optional().oneOf(['Technician', 'General', 'Extra']),
    expirationDate: yup.string().optional(),
  }).optional(),
  address: yup.object({
    street: yup.string().optional(),
    city: yup.string().optional(),
    state: yup.string().optional(),
    zipCode: yup.string().optional(),
  }).optional(),
  emergencyContact: yup.object({
    name: yup.string().optional(),
    relationship: yup.string().optional(),
    phone: yup.string().optional(),
    email: yup.string().optional(),
  }).optional(),
});

const steps = [
  'Personal Information',
  'Contact Details', 
  'FCC License',
  'Address & Emergency Contact'
];

const MemberForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const isEditMode = Boolean(id);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MemberFormData>({
    resolver: yupResolver(memberSchema as any),
    defaultValues: {
      firstName: '',
      lastName: '',
      nickname: '',
      email: '',
      phone: '',
      status: 'In Training',
      dateOfBirth: undefined,
      gender: '',
      fccLicense: {
        callsign: '',
        level: '',
        expirationDate: undefined,
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
        email: '',
      },
    },
  });

  // Load member data for editing
  useEffect(() => {
    if (isEditMode && id) {
      loadMemberForEdit();
    }
  }, [id, isEditMode]);

  const loadMemberForEdit = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await memberService.getMember(id);
      const member = response.data;
      
      // Populate form with member data
      reset({
        firstName: member.firstName,
        lastName: member.lastName,
        nickname: member.nickname || '',
        email: member.email || '',
        phone: member.phone || '',
        status: member.status,
        dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : undefined,
        gender: member.gender || '',
        fccLicense: {
          callsign: member.fccLicense?.callsign || '',
          level: member.fccLicense?.level || '',
          expirationDate: member.fccLicense?.expirationDate ? 
            member.fccLicense.expirationDate.split('T')[0] : undefined,
        },
        address: {
          street: member.address?.street || '',
          city: member.address?.city || '',
          state: member.address?.state || '',
          zipCode: member.address?.zipCode || '',
        },
        emergencyContact: {
          name: member.emergencyContact?.name || '',
          relationship: member.emergencyContact?.relationship || '',
          phone: member.emergencyContact?.phone || '',
          email: member.emergencyContact?.email || '',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load member');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MemberFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isEditMode && id) {
        await memberService.updateMember(id, data);
        setSuccess('Member updated successfully');
      } else {
        await memberService.createMember(data);
        setSuccess('Member created successfully');
      }
      
      setTimeout(() => {
        navigate('/members');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return value;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Personal Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name *"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name *"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="nickname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nickname (Optional)"
                    error={!!errors.nickname}
                    helperText={errors.nickname?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status *</InputLabel>
                    <Select {...field} label="Status *">
                      <MenuItem value="In Training">In Training</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Field Ready">Field Ready</MenuItem>
                      <MenuItem value="Suspended">Suspended</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender">
                      <MenuItem value="">Prefer not to say</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        );

      case 1: // Contact Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 2: // FCC License
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <RadioIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                FCC Amateur Radio License (Optional)
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Enter FCC license information if the member is a licensed amateur radio operator.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="fccLicense.callsign"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Callsign"
                    placeholder="e.g., AK6IL"
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    error={!!errors.fccLicense?.callsign}
                    helperText={errors.fccLicense?.callsign?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="fccLicense.level"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.fccLicense?.level}>
                    <InputLabel>License Class</InputLabel>
                    <Select {...field} label="License Class">
                      <MenuItem value="">Select Class</MenuItem>
                      <MenuItem value="Technician">Technician</MenuItem>
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="Extra">Extra</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="fccLicense.expirationDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="License Expiration Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.fccLicense?.expirationDate}
                    helperText={errors.fccLicense?.expirationDate?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 3: // Address & Emergency Contact
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Address Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Street Address"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="City"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Controller
                name="address.state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="State"
                    inputProps={{ maxLength: 2, style: { textTransform: 'uppercase' } }}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Controller
                name="address.zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="ZIP Code"
                    inputProps={{ maxLength: 10 }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Emergency Contact
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContact.name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Contact Name"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContact.relationship"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Relationship"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContact.phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Contact Phone"
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContact.email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Contact Email"
                    type="email"
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate('/members')}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" flexGrow={1}>
          {isEditMode ? 'Edit Member' : 'Add New Member'}
        </Typography>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}
            
            <Box display="flex" justifyContent="between" alignItems="center" mt={4}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              
              <Box display="flex" gap={2}>
                {activeStep < steps.length - 1 ? (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (isEditMode ? 'Update Member' : 'Create Member')}
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MemberForm;