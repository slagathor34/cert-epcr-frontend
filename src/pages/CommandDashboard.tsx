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
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Badge,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  LocalHospital as MedicalIcon,
  Inventory as LogisticsIcon,
  EventNote as PlanningIcon,
  ReportProblem as EmergencyIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  Radio as RadioIcon,
  Place as PlaceIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const CommandDashboard: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Mock real-time data that updates
  const [systemStatus, setSystemStatus] = useState({
    operational: 95,
    incidents: 4,
    unitsDeployed: 12,
    personnelActive: 147,
    lastIncident: '00:12:34',
  });

  // Mock data for different sections
  const sectionSummary = [
    {
      section: 'Medical',
      icon: <MedicalIcon />,
      color: '#d32f2f',
      metrics: {
        active: 23,
        completed: 156,
        pending: 8,
        critical: 2,
      },
      trend: '+12%',
      status: 'operational',
    },
    {
      section: 'Operations',
      icon: <SecurityIcon />,
      color: '#1976d2',
      metrics: {
        active: 4,
        completed: 89,
        pending: 2,
        critical: 1,
      },
      trend: '+5%',
      status: 'elevated',
    },
    {
      section: 'Logistics',
      icon: <LogisticsIcon />,
      color: '#f57c00',
      metrics: {
        active: 1247,
        completed: 892,
        pending: 23,
        critical: 7,
      },
      trend: '-3%',
      status: 'warning',
    },
    {
      section: 'Planning',
      icon: <PlanningIcon />,
      color: '#2e7d32',
      metrics: {
        active: 5,
        completed: 12,
        pending: 3,
        critical: 0,
      },
      trend: '+8%',
      status: 'optimal',
    },
    {
      section: 'Members',
      icon: <GroupIcon />,
      color: '#7b1fa2',
      metrics: {
        active: 147,
        completed: 245,
        pending: 12,
        critical: 3,
      },
      trend: '+15%',
      status: 'good',
    },
  ];

  // Mock activity timeline data
  const activityData = [
    { time: '09:00', medical: 15, operations: 3, logistics: 45, planning: 2, members: 28 },
    { time: '10:00', medical: 18, operations: 4, logistics: 52, planning: 3, members: 31 },
    { time: '11:00', medical: 22, operations: 2, logistics: 48, planning: 4, members: 29 },
    { time: '12:00', medical: 25, operations: 5, logistics: 55, planning: 3, members: 35 },
    { time: '13:00', medical: 19, operations: 6, logistics: 60, planning: 5, members: 38 },
    { time: '14:00', medical: 23, operations: 4, logistics: 58, planning: 4, members: 33 },
  ];

  // Mock system health data
  const systemHealth = [
    { name: 'CAD System', status: 'online', uptime: '99.8%' },
    { name: 'Radio Network', status: 'online', uptime: '98.5%' },
    { name: 'GPS Tracking', status: 'online', uptime: '97.2%' },
    { name: 'Database', status: 'online', uptime: '99.9%' },
    { name: 'Mobile Data', status: 'degraded', uptime: '92.1%' },
  ];

  // Mock alerts and notifications
  const activeAlerts = [
    { id: 1, type: 'critical', message: 'Unit availability below threshold (78%)', time: '2 min ago', section: 'Operations' },
    { id: 2, type: 'warning', message: 'Low stock alert: N95 masks (12 remaining)', time: '5 min ago', section: 'Logistics' },
    { id: 3, type: 'info', message: 'New CERT member training scheduled', time: '15 min ago', section: 'Members' },
    { id: 4, type: 'warning', message: 'Wildfire risk assessment updated', time: '23 min ago', section: 'Planning' },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setSystemStatus(prev => ({
        ...prev,
        incidents: Math.max(1, prev.incidents + Math.floor(Math.random() * 3) - 1),
        unitsDeployed: Math.max(5, prev.unitsDeployed + Math.floor(Math.random() * 5) - 2),
        personnelActive: Math.max(100, prev.personnelActive + Math.floor(Math.random() * 20) - 10),
      }));
      setLoading(false);
    }, 2000);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': 
      case 'online': return 'success';
      case 'operational':
      case 'good': return 'info';
      case 'elevated':
      case 'warning': return 'warning';
      case 'critical':
      case 'degraded': return 'error';
      default: return 'default';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DashboardIcon sx={{ fontSize: 'inherit', color: 'primary.main' }} />
            Command Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Real-time operational overview and system status monitoring
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          <IconButton onClick={handleRefresh} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Critical Alerts */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Alert severity="info" sx={{ mb: 1 }}>
            <AlertTitle>System Status: OPERATIONAL</AlertTitle>
            All critical systems online. {systemStatus.incidents} active incidents, {systemStatus.unitsDeployed} units deployed.
          </Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <Alert severity={systemStatus.incidents > 3 ? "warning" : "success"}>
            <AlertTitle>Activity Level: {systemStatus.incidents > 3 ? "ELEVATED" : "NORMAL"}</AlertTitle>
            Last incident: {systemStatus.lastIncident} ago
          </Alert>
        </Grid>
      </Grid>

      {/* Key Performance Indicators */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    System Health
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {systemStatus.operational}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All systems operational
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                  <CheckIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Active Incidents
                  </Typography>
                  <Typography variant="h4" color={systemStatus.incidents > 3 ? "warning.main" : "primary.main"}>
                    {systemStatus.incidents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Emergency responses
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: systemStatus.incidents > 3 ? 'warning.light' : 'primary.light', width: 56, height: 56 }}>
                  <EmergencyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Units Deployed
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {systemStatus.unitsDeployed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active response units
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', width: 56, height: 56 }}>
                  <SecurityIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Personnel Active
                  </Typography>
                  <Typography variant="h4" color="secondary.main">
                    {systemStatus.personnelActive}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    On-duty members
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.light', width: 56, height: 56 }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Section Status Overview */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon color="primary" />
                Section Status Overview
              </Typography>
              <Grid container spacing={2}>
                {sectionSummary.map((section, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: section.color, width: 40, height: 40 }}>
                          {section.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="medium">
                            {section.section}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={section.status.toUpperCase()}
                              color={getStatusColor(section.status) as any}
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              {section.trend}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Active</Typography>
                          <Typography variant="body2" fontWeight="bold">{section.metrics.active}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Completed</Typography>
                          <Typography variant="body2" fontWeight="bold">{section.metrics.completed}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Pending</Typography>
                          <Typography variant="body2" fontWeight="bold">{section.metrics.pending}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Critical</Typography>
                          <Typography variant="body2" fontWeight="bold" color={section.metrics.critical > 0 ? 'error.main' : 'text.primary'}>
                            {section.metrics.critical}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Alerts */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon color="warning" />
                Active Alerts
              </Typography>
              <List dense>
                {activeAlerts.map((alert, index) => (
                  <ListItem key={alert.id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${getAlertColor(alert.type)}.light`, width: 32, height: 32 }}>
                        <WarningIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {alert.message}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {alert.section} • {alert.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Timeline Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingIcon color="primary" />
                Activity Timeline (Last 6 Hours)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="medicalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d32f2f" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d32f2f" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="operationsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="medical"
                    stackId="1"
                    stroke="#d32f2f"
                    fill="url(#medicalGradient)"
                    name="Medical"
                  />
                  <Area
                    type="monotone"
                    dataKey="operations"
                    stackId="1"
                    stroke="#1976d2"
                    fill="url(#operationsGradient)"
                    name="Operations"
                  />
                  <Area
                    type="monotone"
                    dataKey="logistics"
                    stackId="1"
                    stroke="#f57c00"
                    fill="#f57c00"
                    fillOpacity={0.2}
                    name="Logistics"
                  />
                  <Area
                    type="monotone"
                    dataKey="planning"
                    stackId="1"
                    stroke="#2e7d32"
                    fill="#2e7d32"
                    fillOpacity={0.2}
                    name="Planning"
                  />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stackId="1"
                    stroke="#7b1fa2"
                    fill="#7b1fa2"
                    fillOpacity={0.2}
                    name="Members"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon color="success" />
                System Health
              </Typography>
              <List dense>
                {systemHealth.map((system, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <CheckIcon 
                        color={system.status === 'online' ? 'success' : 'warning'} 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={system.name}
                      secondary={`${system.uptime} uptime`}
                    />
                    <Chip 
                      label={system.status.toUpperCase()}
                      color={getStatusColor(system.status) as any}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommandDashboard;