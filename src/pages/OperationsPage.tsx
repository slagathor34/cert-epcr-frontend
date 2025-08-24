import React, { useState } from 'react';
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
} from '@mui/icons-material';

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for operations
  const activeIncidents = [
    { id: 'INC-2024-001', type: 'Structure Fire', location: '1234 Oak Street', status: 'active', priority: 'high', units: 8, timeElapsed: '00:45:32' },
    { id: 'INC-2024-002', type: 'Medical Emergency', location: '5678 Pine Ave', status: 'active', priority: 'critical', units: 4, timeElapsed: '00:23:15' },
    { id: 'INC-2024-003', type: 'Vehicle Accident', location: 'Highway 50 & J St', status: 'responding', priority: 'medium', units: 6, timeElapsed: '00:12:08' },
    { id: 'INC-2024-004', type: 'Hazmat Spill', location: 'Industrial District', status: 'contained', priority: 'high', units: 12, timeElapsed: '02:15:44' },
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <OperationsIcon sx={{ fontSize: 'inherit', color: 'primary.main' }} />
          Operations Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Real-time incident management, unit deployment, and operational coordination for emergency response
        </Typography>

        {/* Operational Status Alerts */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Alert severity="info" sx={{ mb: 1 }}>
              <AlertTitle>Current Operational Status: ELEVATED</AlertTitle>
              4 active incidents, 2 units responding, average response time 5.2 minutes
            </Alert>
          </Grid>
          <Grid item xs={12} md={4}>
            <Alert severity="warning">
              <AlertTitle>Unit Availability Alert</AlertTitle>
              78% availability - below target threshold
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
            <Tab label="Active Incidents" icon={<EmergencyIcon />} />
            <Tab label="Unit Status" icon={<TeamIcon />} />
            <Tab label="Communications" icon={<RadioIcon />} />
            <Tab label="Command Center" icon={<MapIcon />} />
          </Tabs>
        </Box>

        {/* Active Incidents Tab */}
        <TabPanel value={tabValue} index={0}>
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

        {/* Unit Status Tab */}
        <TabPanel value={tabValue} index={1}>
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

        {/* Communications Tab */}
        <TabPanel value={tabValue} index={2}>
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

        {/* Command Center Tab */}
        <TabPanel value={tabValue} index={3}>
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