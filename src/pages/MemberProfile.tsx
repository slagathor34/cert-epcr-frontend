import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Radio as RadioIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  LocalHospital as MedicalIcon,
  Build as EquipmentIcon,
  Event as EventIcon,
  Note as NoteIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Member, EventParticipation, EquipmentAssignment, MemberNote } from '../types/member';
import memberService, { MemberService } from '../services/memberService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`member-tabpanel-${index}`}
    aria-labelledby={`member-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newNote, setNewNote] = useState({ content: '', type: 'General' });
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDate: '',
    eventType: 'Training',
    hoursServed: 0,
    role: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      loadMember();
    }
  }, [id]);

  const loadMember = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await memberService.getMember(id);
      setMember(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load member');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddNote = async () => {
    if (!member || !newNote.content.trim()) return;
    
    try {
      await memberService.addNote(member._id, newNote);
      setNewNote({ content: '', type: 'General' });
      setShowAddNote(false);
      loadMember(); // Reload to get updated notes
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleAddEvent = async () => {
    if (!member || !newEvent.eventName.trim() || !newEvent.eventDate) return;
    
    try {
      await memberService.addEventParticipation(member._id, newEvent);
      setNewEvent({
        eventName: '',
        eventDate: '',
        eventType: 'Training',
        hoursServed: 0,
        role: '',
        notes: ''
      });
      setShowAddEvent(false);
      loadMember(); // Reload to get updated events
    } catch (err) {
      console.error('Failed to add event:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    return MemberService.getStatusColor(status);
  };

  const getCertificationIcon = (isCompleted: boolean, expirationDate?: string) => {
    if (!isCompleted) return <CancelIcon sx={{ color: '#d32f2f' }} />;
    
    if (expirationDate) {
      if (MemberService.isCertificationExpired(expirationDate)) {
        return <WarningIcon sx={{ color: '#d32f2f' }} />;
      }
      if (MemberService.isCertificationExpiringSoon(expirationDate)) {
        return <WarningIcon sx={{ color: '#f57c00' }} />;
      }
    }
    
    return <CheckIcon sx={{ color: '#2e7d32' }} />;
  };

  const renderCertificationSection = (title: string, certifications: any, prefix: string = '') => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Grid container spacing={2}>
          {certifications && Object.entries(certifications).map(([key, cert]: [string, any]) => {
            if (typeof cert !== 'object' || cert === null) return null;
            
            const displayName = key.toUpperCase().replace(/([A-Z])/g, ' $1').trim();
            const isCompleted = cert.isCompleted || false;
            const dateCompleted = cert.dateCompleted;
            const expirationDate = cert.expirationDate;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Box display="flex" alignItems="center" gap={1} p={1}>
                  {getCertificationIcon(isCompleted, expirationDate)}
                  <Box flexGrow={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {displayName}
                    </Typography>
                    {dateCompleted && (
                      <Typography variant="caption" color="textSecondary">
                        Completed: {formatDate(dateCompleted)}
                      </Typography>
                    )}
                    {expirationDate && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        Expires: {formatDate(expirationDate)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  if (error || !member) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Member not found'}
        </Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/members')} sx={{ mt: 2 }}>
          Back to Members
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate('/members')}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" flexGrow={1}>
          {MemberService.formatMemberName(member)}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/members/${member._id}/edit`)}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Member Overview Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ width: 80, height: 80 }}>
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {MemberService.formatMemberName(member)}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {member.idNumber}
                  </Typography>
                  <Chip
                    label={member.status}
                    color={getStatusColor(member.status) as any}
                    size="small"
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <List dense>
                {member.email && (
                  <ListItem disableGutters>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary={member.email} />
                  </ListItem>
                )}
                {member.phone && (
                  <ListItem disableGutters>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary={MemberService.formatPhoneNumber(member.phone)} />
                  </ListItem>
                )}
                {member.fccLicense?.callsign && (
                  <ListItem disableGutters>
                    <ListItemIcon><RadioIcon /></ListItemIcon>
                    <ListItemText 
                      primary={`${member.fccLicense.callsign} (${member.fccLicense.level})`}
                      secondary={member.fccLicense.expirationDate && `Expires: ${formatDate(member.fccLicense.expirationDate)}`}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary">
                    {member.totalHoursServed || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Hours Served
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary">
                    {member.certificationSummary?.femaCertType2?.percentage || 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    CERT Progress
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Certifications" icon={<SchoolIcon sx={{ color: '#2e7d32' }} />} />
            <Tab label="Events" icon={<EventIcon />} />
            <Tab label="Equipment" icon={<EquipmentIcon />} />
            <Tab label="Notes" icon={<NoteIcon />} />
            <Tab label="Details" icon={<PersonIcon />} />
          </Tabs>
        </Box>

        {/* Certifications Tab */}
        <TabPanel value={tabValue} index={0}>
          {renderCertificationSection('FEMA CERT Type 2', member.femaCertType2)}
          {renderCertificationSection('FEMA CERT Type 1 Plus', member.femaCertType1Plus)}
          {renderCertificationSection('Section Chief', member.femaSectionChief)}
          {renderCertificationSection('Team Leader Type 2', member.femaTeamLeader?.type2)}
          {renderCertificationSection('Team Leader Type 1', member.femaTeamLeader?.type1)}
          {renderCertificationSection('Emergency Medical Responder', member.emergencyMedicalResponder)}
          {renderCertificationSection('Instructor', member.instructor)}
        </TabPanel>

        {/* Events Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={8}
            sx={{ minHeight: 300 }}
          >
            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              Event History
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" fontWeight="bold">
              Feature Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={1} maxWidth={400}>
              Track member participation in drills, deployments, and training events
            </Typography>
          </Box>
        </TabPanel>

        {/* Equipment Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={8}
            sx={{ minHeight: 300 }}
          >
            <EquipmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              Equipment Management
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" fontWeight="bold">
              Feature Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={1} maxWidth={400}>
              Track assigned equipment, serial numbers, and condition status
            </Typography>
          </Box>
        </TabPanel>

        {/* Notes Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={8}
            sx={{ minHeight: 300 }}
          >
            <NoteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              Administrative Notes
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" fontWeight="bold">
              Feature Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={1} maxWidth={400}>
              Track member notes, performance reviews, and administrative documentation
            </Typography>
          </Box>
        </TabPanel>

        {/* Details Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={MemberService.formatMemberName(member)} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="ID Number" secondary={member.idNumber} />
                </ListItem>
                {member.dateOfBirth && (
                  <ListItem>
                    <ListItemText 
                      primary="Date of Birth" 
                      secondary={formatDate(member.dateOfBirth)} 
                    />
                  </ListItem>
                )}
                {member.gender && (
                  <ListItem>
                    <ListItemText primary="Gender" secondary={member.gender} />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemText primary="Join Date" secondary={formatDate(member.joinDate)} />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Last Active" 
                    secondary={formatDate(member.lastActiveDate)} 
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Address & Emergency Contact</Typography>
              {member.address && (
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>Address</Typography>
                  <Typography variant="body2">
                    {[
                      member.address.street,
                      member.address.city,
                      member.address.state,
                      member.address.zipCode
                    ].filter(Boolean).join(', ')}
                  </Typography>
                </Box>
              )}
              
              {member.emergencyContact && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Emergency Contact</Typography>
                  <Typography variant="body2">
                    {member.emergencyContact.name}
                    {member.emergencyContact.relationship && 
                      ` (${member.emergencyContact.relationship})`}
                  </Typography>
                  {member.emergencyContact.phone && (
                    <Typography variant="body2">
                      {MemberService.formatPhoneNumber(member.emergencyContact.phone)}
                    </Typography>
                  )}
                  {member.emergencyContact.email && (
                    <Typography variant="body2">{member.emergencyContact.email}</Typography>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Add Note Dialog */}
      <Dialog open={showAddNote} onClose={() => setShowAddNote(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Administrative Note</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Note Type</InputLabel>
                <Select
                  value={newNote.type}
                  label="Note Type"
                  onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
                >
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Training">Training</MenuItem>
                  <MenuItem value="Performance">Performance</MenuItem>
                  <MenuItem value="Administrative">Administrative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Note Content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddNote(false)}>Cancel</Button>
          <Button onClick={handleAddNote} variant="contained">Add Note</Button>
        </DialogActions>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={showAddEvent} onClose={() => setShowAddEvent(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Event Participation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Event Name"
                value={newEvent.eventName}
                onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Event Date"
                InputLabelProps={{ shrink: true }}
                value={newEvent.eventDate}
                onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={newEvent.eventType}
                  label="Event Type"
                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                >
                  <MenuItem value="Training">Training</MenuItem>
                  <MenuItem value="Deployment">Deployment</MenuItem>
                  <MenuItem value="Community Event">Community Event</MenuItem>
                  <MenuItem value="Meeting">Meeting</MenuItem>
                  <MenuItem value="Exercise">Exercise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Hours Served"
                value={newEvent.hoursServed}
                onChange={(e) => setNewEvent({ ...newEvent, hoursServed: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                value={newEvent.role}
                onChange={(e) => setNewEvent({ ...newEvent, role: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddEvent(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained">Add Event</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemberProfile;