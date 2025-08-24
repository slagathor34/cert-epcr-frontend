import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Button,
  Badge,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from '@mui/material';
import {
  Security as OperationsIcon,
  RadioButtonChecked as ActiveIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Assignment as TaskIcon,
  Phone as PhoneIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingIcon,
  Notifications as NotificationsIcon,
  ReportProblem as EmergencyIcon,
  LocalFireDepartment as FireIcon,
  LocalHospital as MedicalIcon,
  Build as ToolsIcon,
  Search as SearchIcon,
  FlashOn as FlashIcon,
  GroupWork as TeamIcon,
  RadioTwoTone as RadioIcon,
  Map as MapIcon,
  Speed as SpeedIcon,
  AccessTime as TimeIcon,
  Psychology as AIIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';

// Import our new tactical components
import TacticalMap from '../components/operations/TacticalMap';
import MeshtasticChat from '../components/operations/MeshtasticChat';
import AIAnalysisPanel from '../components/operations/AIAnalysisPanel';
import SDRInterface from '../components/operations/SDRInterface';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const OperationsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [fullscreenDialog, setFullscreenDialog] = useState<string | null>(null);
  const [alertsCount, setAlertsCount] = useState(3);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFullscreen = (component: string) => {
    setFullscreenDialog(component);
  };

  const handleCloseFullscreen = () => {
    setFullscreenDialog(null);
  };

  // Enhanced incident data with more tactical details
  const activeIncidents = [
    { 
      id: 'INC-2024-001', 
      type: 'Structure Fire', 
      location: '1234 Oak Street', 
      coordinates: { lat: 38.5815, lng: -121.4945 },
      status: 'active', 
      priority: 'critical', 
      units: 8, 
      timeElapsed: '00:45:32',
      commandPost: 'CP-01',
      casualties: 2,
      evacuated: 15,
      threatLevel: 'High',
      weatherImpact: 'Moderate wind affecting smoke direction'
    },
    { 
      id: 'INC-2024-002', 
      type: 'Medical Emergency', 
      location: '5678 Pine Ave', 
      coordinates: { lat: 38.5822, lng: -121.4952 },
      status: 'active', 
      priority: 'critical', 
      units: 4, 
      timeElapsed: '00:23:15',
      commandPost: 'CP-02',
      casualties: 1,
      evacuated: 0,
      threatLevel: 'Low',
      weatherImpact: 'None'
    },
    { 
      id: 'INC-2024-003', 
      type: 'Search & Rescue', 
      location: 'Warehouse District Grid 4', 
      coordinates: { lat: 38.5808, lng: -121.4938 },
      status: 'responding', 
      priority: 'high', 
      units: 12, 
      timeElapsed: '01:12:08',
      commandPost: 'CP-03',
      casualties: 0,
      evacuated: 3,
      threatLevel: 'Medium',
      weatherImpact: 'Reduced visibility due to debris'
    },
    { 
      id: 'INC-2024-004', 
      type: 'Hazmat Containment', 
      location: 'Industrial District Zone B', 
      coordinates: { lat: 38.5835, lng: -121.4965 },
      status: 'contained', 
      priority: 'high', 
      units: 16, 
      timeElapsed: '02:15:44',
      commandPost: 'CP-04',
      casualties: 0,
      evacuated: 47,
      threatLevel: 'High',
      weatherImpact: 'Wind speed 8mph NW - containment favorable'
    },
  ];

  const deployedUnits = [
    { id: 'ENG-01', type: 'Engine Company', location: 'Downtown Station', status: 'available', crew: 4, responseTime: '4.2 min' },
    { id: 'TRK-02', type: 'Truck Company', location: 'Midtown Station', status: 'active', crew: 5, responseTime: '5.8 min' },
    { id: 'MED-03', type: 'Medic Unit', location: 'North Station', status: 'responding', crew: 2, responseTime: '3.5 min' },
    { id: 'HAZ-04', type: 'Hazmat Team', location: 'Central Station', status: 'active', crew: 6, responseTime: '8.1 min' },
    { id: 'RES-05', type: 'Rescue Squad', location: 'South Station', status: 'available', crew: 4, responseTime: '6.2 min' },
    { id: 'CERT-06', type: 'CERT Team Alpha', location: 'East Sector', status: 'deployed', crew: 8, responseTime: '12.5 min' },
    { id: 'CERT-07', type: 'CERT Team Bravo', location: 'West Sector', status: 'available', crew: 6, responseTime: '10.3 min' },
  ];

  const operationalMetrics = [
    { metric: 'Response Time Avg', value: '5.2 min', target: '4.0 min', status: 'warning' },
    { metric: 'Unit Availability', value: '78%', target: '85%', status: 'critical' },
    { metric: 'Active Incidents', value: '4', target: '< 6', status: 'good' },
    { metric: 'Crew Readiness', value: '92%', target: '95%', status: 'good' },
  ];

  const communicationChannels = [
    { channel: 'Command Net', frequency: '154.280', status: 'active', users: 12 },
    { channel: 'Tactical 1', frequency: '154.190', status: 'active', users: 8 },
    { channel: 'Tactical 2', frequency: '154.205', status: 'standby', users: 0 },
    { channel: 'CERT Net', frequency: '146.520', status: 'active', users: 24 },
    { channel: 'Medical', frequency: '155.340', status: 'active', users: 6 },
    { channel: 'Mutual Aid', frequency: '154.310', status: 'standby', users: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
      case 'good': return 'success';
      case 'responding':
      case 'deployed':
      case 'warning': return 'warning';
      case 'contained':
      case 'standby': return 'info';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'structure fire': return <FireIcon />;
      case 'medical emergency': return <MedicalIcon />;
      case 'vehicle accident': return <WarningIcon />;
      case 'hazmat spill': return <ToolsIcon />;
      default: return <EmergencyIcon />;
    }
  };

  const getUnitIcon = (type: string) => {
    if (type.includes('CERT')) return <TeamIcon />;
    if (type.includes('Engine')) return <FireIcon />;
    if (type.includes('Medic')) return <MedicalIcon />;
    if (type.includes('Hazmat')) return <ToolsIcon />;
    if (type.includes('Rescue')) return <SearchIcon />;
    return <FlashIcon />;
  };

  // Auto-refresh for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate alert count changes
      setAlertsCount(prev => Math.max(1, prev + (Math.random() > 0.7 ? 1 : -1)));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Tactical Operations Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <OperationsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Tactical Operations Center
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Real-time incident command, tactical communications, and AI-powered situational analysis
              </Typography>
            </Box>
          </Box>
          <Card sx={{ minWidth: 180 }}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Typography variant="h6" color="error.main" gutterBottom>
                CONDITION: ALPHA
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                4 Active Incidents
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Last Update: {new Date().toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Critical Status Alerts */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Alert severity="error" sx={{ animation: 'pulse 2s infinite' }}>
              <AlertTitle>🚨 PRIORITY ALERT</AlertTitle>
              Environmental hazard detected - CO levels elevated in Sector 3
            </Alert>
          </Grid>
          <Grid item xs={12} md={4}>
            <Alert severity="warning">
              <AlertTitle>⚠️ RESOURCE STATUS</AlertTitle>
              CERT-05 emergency status - battery critical, immediate support dispatched
            </Alert>
          </Grid>
          <Grid item xs={12} md={4}>
            <Alert severity="info">
              <AlertTitle>📡 COMMUNICATIONS</AlertTitle>
              Meshtastic network: 8 nodes online, signal strength good
            </Alert>
          </Grid>
        </Grid>
      </Box>

      {/* Key Operational Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {operationalMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="h6">
                      {metric.metric}
                    </Typography>
                    <Typography variant="h4" color={`${getStatusColor(metric.status)}.main`}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Target: {metric.target}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${getStatusColor(metric.status)}.light`, width: 56, height: 56 }}>
                    {metric.metric.includes('Time') && <TimeIcon />}
                    {metric.metric.includes('Availability') && <SpeedIcon />}
                    {metric.metric.includes('Incidents') && <EmergencyIcon />}
                    {metric.metric.includes('Readiness') && <CheckIcon />}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Operations Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Tactical View" icon={<MapIcon />} />
            <Tab label="Communications" icon={<RadioIcon />} />
            <Tab label="AI Analysis" icon={<AIIcon />} />
            <Tab label="Active Incidents" icon={<EmergencyIcon />} />
          </Tabs>
        </Box>

        {/* Tactical View Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapIcon color="primary" />
              Tactical Map & Team Positions
            </Typography>
            <IconButton onClick={() => handleFullscreen('tactical')}>
              <FullscreenIcon />
            </IconButton>
          </Box>
          <TacticalMap />
        </TabPanel>

        {/* Communications Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RadioIcon color="info" />
              Meshtastic Communications Network
            </Typography>
            <IconButton onClick={() => handleFullscreen('comms')}>
              <FullscreenIcon />
            </IconButton>
          </Box>
          <MeshtasticChat />
          
          {/* SDR Interface Section */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TuneIcon color="success" />
                Software Defined Radio Control
              </Typography>
              <IconButton onClick={() => handleFullscreen('sdr')}>
                <FullscreenIcon />
              </IconButton>
            </Box>
            <SDRInterface />
          </Box>
        </TabPanel>

        {/* AI Analysis Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AIIcon color="secondary" />
              AI Situational Analysis
            </Typography>
            <IconButton onClick={() => handleFullscreen('ai')}>
              <FullscreenIcon />
            </IconButton>
          </Box>
          <AIAnalysisPanel />
        </TabPanel>

        {/* Active Incidents Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmergencyIcon color="error" />
            Active Emergency Incidents
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Incident ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Units Assigned</TableCell>
                  <TableCell>Time Elapsed</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeIncidents.map((incident, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {incident.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'error.light' }}>
                          {getIncidentIcon(incident.type)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {incident.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {incident.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={incident.priority.toUpperCase()}
                        color={getPriorityColor(incident.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={incident.status.toUpperCase()}
                        color={getStatusColor(incident.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={incident.units} color="primary">
                        <PeopleIcon />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {incident.timeElapsed}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Incident">
                        <IconButton size="small">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Incident">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Unit Status Tab (keeping for reference but moved to index 4) */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TeamIcon color="primary" />
            Deployed Units & Response Teams
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Unit ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Current Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Crew Size</TableCell>
                  <TableCell>Avg Response Time</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deployedUnits.map((unit, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {unit.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                          {getUnitIcon(unit.type)}
                        </Avatar>
                        <Typography variant="body2">
                          {unit.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {unit.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={unit.status.toUpperCase()}
                        color={getStatusColor(unit.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={unit.crew} color="secondary">
                        <PeopleIcon />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {unit.responseTime}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Unit">
                        <IconButton size="small">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dispatch Unit">
                        <IconButton size="small">
                          <NotificationsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* Fullscreen Dialogs */}
      <Dialog 
        fullScreen 
        open={fullscreenDialog === 'tactical'} 
        onClose={handleCloseFullscreen}
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapIcon /> Tactical Map - Full View
          </Typography>
          <IconButton onClick={handleCloseFullscreen}>
            <FullscreenExitIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <TacticalMap />
        </DialogContent>
      </Dialog>

      <Dialog 
        fullScreen 
        open={fullscreenDialog === 'comms'} 
        onClose={handleCloseFullscreen}
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RadioIcon /> Meshtastic Communications - Full View
          </Typography>
          <IconButton onClick={handleCloseFullscreen}>
            <FullscreenExitIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <MeshtasticChat />
        </DialogContent>
      </Dialog>

      <Dialog 
        fullScreen 
        open={fullscreenDialog === 'ai'} 
        onClose={handleCloseFullscreen}
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon /> AI Analysis - Full View
          </Typography>
          <IconButton onClick={handleCloseFullscreen}>
            <FullscreenExitIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <AIAnalysisPanel />
        </DialogContent>
      </Dialog>

      <Dialog 
        fullScreen 
        open={fullscreenDialog === 'sdr'} 
        onClose={handleCloseFullscreen}
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1a1a1a', color: '#ffffff' }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#00ff41' }}>
            <TuneIcon /> Software Defined Radio - Full View
          </Typography>
          <IconButton onClick={handleCloseFullscreen} sx={{ color: '#ffffff' }}>
            <FullscreenExitIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, backgroundColor: '#1a1a1a' }}>
          <SDRInterface />
        </DialogContent>
      </Dialog>

      {/* Legacy Communications Tab (kept for reference) */}
      <Card sx={{ display: 'none' }}>
        <TabPanel value={tabValue} index={999}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RadioIcon color="info" />
                Radio Communication Channels
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Channel Name</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Active Users</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {communicationChannels.map((channel, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {channel.channel}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {channel.frequency} MHz
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={channel.status.toUpperCase()}
                            color={getStatusColor(channel.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge badgeContent={channel.users} color="primary">
                            <RadioIcon />
                          </Badge>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Monitor Channel">
                            <IconButton size="small">
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="success" />
                    Emergency Contacts
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Fire Dispatch" 
                        secondary="(916) 808-1300" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Medical Dispatch" 
                        secondary="(916) 875-9100" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText 
                        primary="CERT Command" 
                        secondary="(916) 555-CERT" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText 
                        primary="EOC Main" 
                        secondary="(916) 874-6851" 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Legacy Command Center Tab (kept for reference) */}
        <TabPanel value={tabValue} index={998}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: 400 }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <MapIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Tactical Operations Map
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                    Real-time incident locations, unit positions, and resource deployment across Sacramento County
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    Launch Command Map
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Weather Conditions
                  </Typography>
                  <Typography variant="body1">72°F Clear</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wind: 5 mph SW • Humidity: 45%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visibility: 10 miles • Pressure: 30.12"
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Status
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="CAD System" secondary="Online" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Radio Network" secondary="Operational" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                      <ListItemText primary="Mobile Data" secondary="Degraded" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary="GPS Tracking" secondary="Active" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Container>
  );
};

export default OperationsPage;