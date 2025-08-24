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
  Divider,
  Button,
  Badge,
} from '@mui/material';
import {
  EventNote as PlanningIcon,
  Map as MapIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Group as TeamIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Assignment as TaskIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  Place as PlaceIcon,
  Router as RouterIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Construction as ConstructionIcon,
  LocalHospital as HospitalIcon,
  Security as SecurityIcon,
  WbSunny as WeatherIcon,
  Traffic as TrafficIcon,
} from '@mui/icons-material';
import RiskTrendsChart from '../components/charts/RiskTrendsChart';
import ResourceAllocationMap from '../components/charts/ResourceAllocationMap';

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

const PlanningPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for planning visualizations
  const emergencyPlans = [
    { id: 'EP-001', name: 'Earthquake Response Plan', status: 'active', lastUpdated: '2024-01-15', completeness: 95 },
    { id: 'EP-002', name: 'Wildfire Evacuation Plan', status: 'review', lastUpdated: '2024-01-10', completeness: 87 },
    { id: 'EP-003', name: 'Flood Response Protocol', status: 'draft', lastUpdated: '2024-01-08', completeness: 72 },
    { id: 'EP-004', name: 'Mass Casualty Incident', status: 'active', lastUpdated: '2024-01-12', completeness: 91 },
    { id: 'EP-005', name: 'Shelter Operations Plan', status: 'active', lastUpdated: '2024-01-14', completeness: 88 },
  ];

  const upcomingEvents = [
    { id: 'EV-001', name: 'Quarterly Drill Exercise', date: '2024-02-15', type: 'drill', participants: 45, status: 'scheduled' },
    { id: 'EV-002', name: 'Community Preparedness Fair', date: '2024-02-28', type: 'outreach', participants: 125, status: 'planning' },
    { id: 'EV-003', name: 'Inter-agency Coordination Meeting', date: '2024-03-05', type: 'meeting', participants: 12, status: 'confirmed' },
    { id: 'EV-004', name: 'Equipment Inventory Audit', date: '2024-03-10', type: 'logistics', participants: 8, status: 'scheduled' },
    { id: 'EV-005', name: 'Annual Preparedness Conference', date: '2024-03-20', type: 'training', participants: 200, status: 'registration' },
  ];

  const riskAssessments = [
    { hazard: 'Earthquake (7.0+)', probability: 'Medium', impact: 'High', risk: 'High', lastAssessed: '2024-01-15' },
    { hazard: 'Wildfire', probability: 'High', impact: 'High', risk: 'Critical', lastAssessed: '2024-01-12' },
    { hazard: 'Urban Flooding', probability: 'Medium', impact: 'Medium', risk: 'Medium', lastAssessed: '2024-01-10' },
    { hazard: 'Severe Weather', probability: 'High', impact: 'Low', risk: 'Medium', lastAssessed: '2024-01-18' },
    { hazard: 'Infrastructure Failure', probability: 'Low', impact: 'High', risk: 'Medium', lastAssessed: '2024-01-08' },
  ];

  const resourceAllocation = [
    { sector: 'North Sacramento', teams: 12, equipment: 95, status: 'optimal', population: 45000 },
    { sector: 'South Sacramento', teams: 8, equipment: 78, status: 'needs attention', population: 38000 },
    { sector: 'East Sacramento', teams: 15, equipment: 88, status: 'good', population: 52000 },
    { sector: 'West Sacramento', teams: 10, equipment: 92, status: 'optimal', population: 41000 },
    { sector: 'Downtown Core', teams: 6, equipment: 65, status: 'critical', population: 28000 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
      case 'optimal': 
      case 'confirmed': 
      case 'scheduled': return 'success';
      case 'review': 
      case 'good': 
      case 'planning': 
      case 'registration': return 'info';
      case 'draft': 
      case 'needs attention': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'drill': return <SecurityIcon />;
      case 'outreach': return <PeopleIcon />;
      case 'meeting': return <TeamIcon />;
      case 'logistics': return <ConstructionIcon />;
      case 'training': return <HospitalIcon />;
      default: return <CalendarIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PlanningIcon sx={{ fontSize: 'inherit', color: 'primary.main' }} />
          Emergency Planning
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Strategic planning, risk assessment, resource allocation, and event coordination for comprehensive emergency preparedness
        </Typography>

        {/* Critical Alerts */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Alert severity="error">
              <AlertTitle>High-Priority Risk Alert</AlertTitle>
              Wildfire risk assessment indicates critical threat level. Review evacuation plans immediately.
            </Alert>
          </Grid>
          <Grid item xs={12} md={6}>
            <Alert severity="warning">
              <AlertTitle>Resource Shortage</AlertTitle>
              Downtown Core sector requires additional team assignments and equipment allocation.
            </Alert>
          </Grid>
        </Grid>
      </Box>

      {/* Planning Tabs */}
      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Emergency Plans" icon={<AssessmentIcon />} />
            <Tab label="Risk Assessment" icon={<WarningIcon />} />
            <Tab label="Resource Allocation" icon={<MapIcon />} />
            <Tab label="Events & Drills" icon={<ScheduleIcon />} />
          </Tabs>
        </Box>

        {/* Emergency Plans Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Plan Status Overview */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TaskIcon color="primary" />
                    Plan Status Overview
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Active Plans</Typography>
                      <Typography variant="body2" fontWeight="bold">3</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={75} color="success" sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Under Review</Typography>
                      <Typography variant="body2" fontWeight="bold">1</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={25} color="info" sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Draft Status</Typography>
                      <Typography variant="body2" fontWeight="bold">1</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={20} color="warning" />
                  </Box>
                  
                  <Typography variant="h4" color="primary" sx={{ textAlign: 'center', mt: 2 }}>
                    87%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Overall Completeness
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Plans List */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Emergency Response Plans
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Plan ID</TableCell>
                          <TableCell>Plan Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Completeness</TableCell>
                          <TableCell>Last Updated</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {emergencyPlans.map((plan, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {plan.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {plan.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={plan.status.toUpperCase()}
                                color={getStatusColor(plan.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={plan.completeness}
                                  sx={{ flexGrow: 1, height: 6 }}
                                />
                                <Typography variant="body2">
                                  {plan.completeness}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(plan.lastUpdated).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Plan">
                                <IconButton size="small">
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Plan">
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Risk Assessment Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Risk Matrix Analysis
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Hazard Type</TableCell>
                          <TableCell>Probability</TableCell>
                          <TableCell>Impact</TableCell>
                          <TableCell>Risk Level</TableCell>
                          <TableCell>Last Assessed</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {riskAssessments.map((risk, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {risk.hazard}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={risk.probability} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Chip label={risk.impact} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={risk.risk}
                                color={getRiskColor(risk.risk) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(risk.lastAssessed).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <RiskTrendsChart title="Risk Probability Trends" />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Resource Allocation Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Interactive Resource Allocation */}
            <Grid item xs={12} md={8}>
              <ResourceAllocationMap title="Interactive Resource Allocation" />
            </Grid>

            {/* Resource Status */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RouterIcon color="primary" />
                    Sector Resource Status
                  </Typography>
                  <List dense>
                    {resourceAllocation.map((sector, index) => (
                      <ListItem key={index} divider>
                        <ListItemIcon>
                          <PlaceIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight="medium">
                                {sector.sector}
                              </Typography>
                              <Chip 
                                label={sector.status.toUpperCase()}
                                color={getStatusColor(sector.status) as any}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Teams: {sector.teams} | Equipment: {sector.equipment}% | Pop: {sector.population.toLocaleString()}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={sector.equipment}
                                sx={{ mt: 0.5, height: 4 }}
                                color={getStatusColor(sector.status) as any}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Resource Metrics */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                        <TeamIcon />
                      </Avatar>
                      <Typography variant="h4" color="primary">51</Typography>
                      <Typography variant="body2" color="text.secondary">Total Teams</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                        <SpeedIcon />
                      </Avatar>
                      <Typography variant="h4" color="success.main">84%</Typography>
                      <Typography variant="body2" color="text.secondary">Coverage Rate</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                        <LocationIcon />
                      </Avatar>
                      <Typography variant="h4" color="info.main">5</Typography>
                      <Typography variant="body2" color="text.secondary">Active Sectors</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                        <NotificationsIcon />
                      </Avatar>
                      <Typography variant="h4" color="warning.main">2</Typography>
                      <Typography variant="body2" color="text.secondary">Attention Needed</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Events & Drills Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="primary" />
                    Upcoming Events & Training
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Event</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Participants</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {upcomingEvents.map((event, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                                  {getEventIcon(event.type)}
                                </Avatar>
                                <Typography variant="body2" fontWeight="medium">
                                  {event.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(event.date).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {event.type}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Badge badgeContent={event.participants} color="primary">
                                <PeopleIcon />
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={event.status.toUpperCase()}
                                color={getStatusColor(event.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Event">
                                <IconButton size="small">
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Event">
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
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon color="primary" />
                    Event Calendar
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Interactive Calendar View
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly and weekly views with drag-and-drop scheduling
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WeatherIcon color="warning" />
                    Environmental Factors
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><WeatherIcon /></ListItemIcon>
                      <ListItemText primary="Weather Alert" secondary="High wind warning active" />
                      <Chip label="Active" color="warning" size="small" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><TrafficIcon /></ListItemIcon>
                      <ListItemText primary="Traffic Conditions" secondary="Major routes clear" />
                      <Chip label="Normal" color="success" size="small" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SecurityIcon /></ListItemIcon>
                      <ListItemText primary="Threat Level" secondary="Low risk assessment" />
                      <Chip label="Green" color="success" size="small" />
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

export default PlanningPage;