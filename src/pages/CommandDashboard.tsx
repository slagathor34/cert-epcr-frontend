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
  Avatar,
  Alert,
  AlertTitle,
  IconButton,
  Badge,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
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
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Radio as RadioIcon,
  AccessTime as TimeIcon,
  Psychology as AIIcon,
  Map as MapIcon,
  BatteryFull as BatteryIcon,
  SignalCellular4Bar as SignalIcon,
  LocationOn as LocationIcon,
  FlashOn as FlashIcon,
  Visibility as ViewIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';

// Import tactical components
import TacticalMap from '../components/operations/TacticalMap';
import MeshtasticChat from '../components/operations/MeshtasticChat';
import AIAnalysisPanel from '../components/operations/AIAnalysisPanel';
import FairgroundsHeatmap from '../components/charts/FairgroundsHeatmap';
import TacticalMetricsGrid from '../components/charts/TacticalMetricsGrid';
import IntegratedCommandMetrics from '../components/charts/IntegratedCommandMetrics';

const CommandDashboard: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [tacticalDialogOpen, setTacticalDialogOpen] = useState(false);
  const [selectedDialog, setSelectedDialog] = useState<string | null>(null);

  // Enhanced real-time tactical data
  const [systemStatus, setSystemStatus] = useState({
    operational: 95,
    incidents: 4,
    unitsDeployed: 12,
    personnelActive: 34,
    lastIncident: '00:12:34',
    condition: 'ALPHA',
    meshtasticNodes: 8,
    aiAnalysisActive: true,
    weatherStatus: 'Fair',
    communicationsStatus: 'Optimal'
  });

  // Enhanced tactical team data with real positioning
  const tacticalTeams = [
    {
      id: 'CERT-01',
      leader: 'Lisa Walda',
      members: 6,
      position: { lat: 38.5816, lng: -121.4944 },
      status: 'Deployed',
      mission: 'Structure Fire Support',
      battery: 85,
      lastUpdate: '2 min ago',
      temperature: 72
    },
    {
      id: 'CERT-02', 
      leader: 'Marcus Rodriguez',
      members: 8,
      position: { lat: 38.5822, lng: -121.4952 },
      status: 'En Route',
      mission: 'Medical Emergency',
      battery: 92,
      lastUpdate: '1 min ago',
      temperature: 74
    },
    {
      id: 'CERT-03',
      leader: 'David Thompson',
      members: 5,
      position: { lat: 38.5808, lng: -121.4938 },
      status: 'Staging',
      mission: 'Search & Rescue',
      battery: 78,
      lastUpdate: '3 min ago',
      temperature: 71
    },
    {
      id: 'CERT-04',
      leader: 'Jennifer Chang',
      members: 7,
      position: { lat: 38.5835, lng: -121.4965 },
      status: 'Active',
      mission: 'Hazmat Response',
      battery: 67,
      lastUpdate: '45 sec ago',
      temperature: 75
    }
  ];

  // Active incidents with enhanced tactical details
  const activeIncidents = [
    {
      id: 'INC-2024-001',
      type: 'Structure Fire',
      location: '1234 Oak Street',
      priority: 'Critical',
      unitsAssigned: 3,
      timeElapsed: '00:45:32',
      commandPost: 'CP-01',
      casualties: 2,
      status: 'Active',
      coordinates: { lat: 38.5815, lng: -121.4945 }
    },
    {
      id: 'INC-2024-002',
      type: 'Medical Emergency', 
      location: '5678 Pine Ave',
      priority: 'High',
      unitsAssigned: 2,
      timeElapsed: '00:23:15',
      commandPost: 'CP-02',
      casualties: 1,
      status: 'Responding',
      coordinates: { lat: 38.5822, lng: -121.4952 }
    },
    {
      id: 'INC-2024-003',
      type: 'Search & Rescue',
      location: 'Warehouse District Grid 4',
      priority: 'High',
      unitsAssigned: 4,
      timeElapsed: '01:12:08',
      commandPost: 'CP-03', 
      casualties: 0,
      status: 'Contained',
      coordinates: { lat: 38.5808, lng: -121.4938 }
    },
    {
      id: 'INC-2024-004',
      type: 'Hazmat Containment',
      location: 'Industrial District Zone B',
      priority: 'Critical',
      unitsAssigned: 5,
      timeElapsed: '02:15:44',
      commandPost: 'CP-04',
      casualties: 0,
      status: 'Monitoring',
      coordinates: { lat: 38.5835, lng: -121.4965 }
    }
  ];

  // AI Analysis Summary for Command Staff
  const aiSummary = {
    threatLevel: 'Moderate',
    confidence: 87,
    keyInsights: [
      'Optimal resource allocation across all active incidents',
      'Weather conditions favorable for air operations',
      'Communications network operating at 95% efficiency',
      'CERT-04 battery levels require monitoring within 2 hours'
    ],
    recommendations: [
      'Deploy backup team to support CERT-04 operations',
      'Consider establishing forward command post in Grid 4',
      'Monitor air quality readings in Industrial District'
    ],
    riskFactors: [
      'Wind shift possible at 1600 hours - affects hazmat containment',
      'Resource fatigue expected after 4+ hour operations'
    ]
  };

  // Communications status
  const commStatus = {
    meshtasticNodes: 8,
    networkHealth: 95,
    activeChannels: 4,
    messageRate: 47,
    signalStrength: 'Excellent',
    lastMessage: '15 sec ago'
  };

  // Enhanced tactical alerts with priority and actionable intelligence
  const activeAlerts = [
    { 
      id: 1, 
      type: 'critical', 
      message: 'CERT-04 battery critical - 67% remaining, estimated 2hrs operation time', 
      time: '1 min ago', 
      section: 'Operations',
      actionRequired: true,
      location: 'Industrial District Zone B'
    },
    { 
      id: 2, 
      type: 'critical', 
      message: 'Environmental hazard detected - CO levels elevated in Sector 3', 
      time: '3 min ago', 
      section: 'Operations',
      actionRequired: true,
      location: 'Warehouse District Grid 4'
    },
    { 
      id: 3, 
      type: 'warning', 
      message: 'Wind shift expected 1600hrs - may affect hazmat containment operations', 
      time: '8 min ago', 
      section: 'Planning',
      actionRequired: false,
      location: 'All Sectors'
    },
    { 
      id: 4, 
      type: 'warning', 
      message: 'Resource allocation suboptimal - recommend team redistribution', 
      time: '12 min ago', 
      section: 'AI Analysis',
      actionRequired: false,
      location: 'Command'
    },
    { 
      id: 5, 
      type: 'info', 
      message: 'Meshtastic network optimal - all 8 nodes reporting green status', 
      time: '15 min ago', 
      section: 'Communications',
      actionRequired: false,
      location: 'Network'
    }
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate tactical data refresh with realistic variations
    setTimeout(() => {
      setLastUpdated(new Date());
      setSystemStatus(prev => ({
        ...prev,
        incidents: Math.max(1, prev.incidents + Math.floor(Math.random() * 3) - 1),
        unitsDeployed: Math.max(5, prev.unitsDeployed + Math.floor(Math.random() * 5) - 2),
        personnelActive: Math.max(25, prev.personnelActive + Math.floor(Math.random() * 10) - 5),
        operational: Math.max(85, Math.min(100, prev.operational + Math.floor(Math.random() * 6) - 3)),
        meshtasticNodes: Math.max(6, Math.min(8, prev.meshtasticNodes + Math.floor(Math.random() * 3) - 1)),
      }));
      setLoading(false);
    }, 1500);
  };

  const handleOpenTacticalDialog = (type: string) => {
    setSelectedDialog(type);
    setTacticalDialogOpen(true);
  };

  const handleCloseTacticalDialog = () => {
    setTacticalDialogOpen(false);
    setSelectedDialog(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning'; 
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Deployed': return 'info';
      case 'En Route': return 'warning';
      case 'Staging': return 'default';
      default: return 'default';
    }
  };

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

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Command Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DashboardIcon sx={{ fontSize: 'inherit', color: 'primary.main' }} />
              🚀 Unified Command Center
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Medical • Operations • Logistics • Planning • Members - Integrated C4I
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Card sx={{ bgcolor: systemStatus.condition === 'ALPHA' ? 'error.50' : 'success.50', minWidth: 120 }}>
              <CardContent sx={{ pb: '16px !important', textAlign: 'center' }}>
                <Typography variant="h6" color={systemStatus.condition === 'ALPHA' ? 'error.main' : 'success.main'}>
                  CONDITION: {systemStatus.condition}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {systemStatus.incidents} Active Incidents
                </Typography>
              </CardContent>
            </Card>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Auto-refresh: 30s
              </Typography>
            </Box>
            <IconButton onClick={handleRefresh} disabled={loading} size="large">
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Box>
        </Box>
        
        {/* Tactical Action Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant="outlined" 
            startIcon={<MapIcon />} 
            onClick={() => handleOpenTacticalDialog('map')}
            size="small"
          >
            Tactical Map
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RadioIcon />} 
            onClick={() => handleOpenTacticalDialog('comms')}
            size="small"
          >
            Meshtastic Net
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<AIIcon />} 
            onClick={() => handleOpenTacticalDialog('ai')}
            size="small"
          >
            AI Analysis
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ViewIcon />} 
            onClick={() => window.open('/operations', '_blank')}
            size="small"
          >
            Full Operations Center
          </Button>
        </Box>
      </Box>

      {/* Integrated Command Metrics - All Sections */}
      <Box sx={{ mb: 4 }}>
        <IntegratedCommandMetrics />
      </Box>

      {/* Enhanced Tactical Alerts */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Alert severity={systemStatus.condition === 'ALPHA' ? 'error' : 'success'} sx={{ animation: systemStatus.condition === 'ALPHA' ? 'pulse 2s infinite' : 'none' }}>
            <AlertTitle>🚨 TACTICAL STATUS</AlertTitle>
            CONDITION {systemStatus.condition} - {systemStatus.incidents} active incidents across {systemStatus.unitsDeployed} operational zones
          </Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <Alert severity={commStatus.networkHealth > 90 ? 'success' : 'warning'}>
            <AlertTitle>📡 COMMUNICATIONS</AlertTitle>
            Meshtastic: {commStatus.meshtasticNodes}/8 nodes • Network health: {commStatus.networkHealth}%
          </Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <Alert severity={aiSummary.confidence > 80 ? 'info' : 'warning'}>
            <AlertTitle>🤖 AI ANALYSIS</AlertTitle>
            Threat level: {aiSummary.threatLevel} • Confidence: {aiSummary.confidence}% • {aiSummary.recommendations.length} recommendations
          </Alert>
        </Grid>
      </Grid>

      {/* Enhanced Tactical KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => handleOpenTacticalDialog('map')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Tactical Teams
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {tacticalTeams.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tacticalTeams.filter(t => t.status === 'Active' || t.status === 'Deployed').length} operational
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                  <MapIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => handleOpenTacticalDialog('comms')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Meshtastic Network
                  </Typography>
                  <Typography variant="h4" color={systemStatus.meshtasticNodes >= 8 ? "success.main" : "warning.main"}>
                    {systemStatus.meshtasticNodes}/8
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nodes online • {commStatus.messageRate} msgs/hr
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: systemStatus.meshtasticNodes >= 8 ? 'success.light' : 'warning.light', width: 56, height: 56 }}>
                  <SignalIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => handleOpenTacticalDialog('ai')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    AI Analysis
                  </Typography>
                  <Typography variant="h4" color={aiSummary.confidence > 80 ? "info.main" : "warning.main"}>
                    {aiSummary.confidence}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidence • {aiSummary.threatLevel} threat
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: aiSummary.confidence > 80 ? 'info.light' : 'warning.light', width: 56, height: 56 }}>
                  <AIIcon />
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
                  <Typography variant="h4" color={systemStatus.incidents > 3 ? "error.main" : "success.main"}>
                    {systemStatus.incidents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activeIncidents.filter(i => i.priority === 'Critical').length} critical priority
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: systemStatus.incidents > 3 ? 'error.light' : 'success.light', width: 56, height: 56 }}>
                  <EmergencyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Tactical Team Status Table */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon color="primary" />
                Deployed Tactical Teams Status
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Team ID</strong></TableCell>
                      <TableCell><strong>Leader</strong></TableCell>
                      <TableCell align="center"><strong>Members</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Mission</strong></TableCell>
                      <TableCell align="center"><strong>Battery</strong></TableCell>
                      <TableCell><strong>Position</strong></TableCell>
                      <TableCell><strong>Last Update</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tacticalTeams.map((team) => (
                      <TableRow key={team.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {team.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {team.leader}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Badge badgeContent={team.members} color="primary">
                            <PeopleIcon />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={team.status}
                            color={getTeamStatusColor(team.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 150 }} noWrap>
                            {team.mission}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BatteryIcon 
                              fontSize="small" 
                              color={team.battery > 70 ? 'success' : team.battery > 40 ? 'warning' : 'error'}
                            />
                            <Typography variant="caption">
                              {team.battery}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {team.position.lat.toFixed(4)}, {team.position.lng.toFixed(4)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {team.lastUpdate}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Real-time tactical positioning via Meshtastic network
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<MapIcon />} 
                  onClick={() => handleOpenTacticalDialog('map')}
                >
                  View on Tactical Map
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Enhanced Tactical Alerts with Actions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon color="warning" />
                Priority Tactical Alerts
              </Typography>
              <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
                {activeAlerts.map((alert, index) => (
                  <ListItem key={alert.id} divider sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar sx={{ bgcolor: `${getAlertColor(alert.type)}.light`, width: 28, height: 28, mt: 0.5 }}>
                        {alert.type === 'critical' ? <EmergencyIcon fontSize="small" /> : 
                         alert.type === 'warning' ? <WarningIcon fontSize="small" /> : 
                         <NotificationsIcon fontSize="small" />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                          {alert.message}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {alert.section} • {alert.time}
                          </Typography>
                          {alert.location && (
                            <Chip 
                              label={alert.location}
                              size="small"
                              variant="outlined"
                              icon={<LocationIcon />}
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                        {alert.actionRequired && (
                          <Chip 
                            label="ACTION REQUIRED"
                            color="error"
                            size="small"
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
                          />
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Analysis Summary Panel */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AIIcon color="secondary" />
                AI Situational Analysis & Command Recommendations
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="primary.main">
                    🎯 Key Insights
                  </Typography>
                  <List dense>
                    {aiSummary.keyInsights.map((insight, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant="caption">{insight}</Typography>
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="success.main">
                    💡 Command Recommendations
                  </Typography>
                  <List dense>
                    {aiSummary.recommendations.map((rec, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <FlashIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant="caption">{rec}</Typography>
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="warning.main">
                    ⚠️ Risk Factors
                  </Typography>
                  <List dense>
                    {aiSummary.riskFactors.map((risk, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <WarningIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant="caption">{risk}</Typography>
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  AI Analysis Confidence: {aiSummary.confidence}% • Threat Level: {aiSummary.threatLevel} • Updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<AIIcon />} 
                  onClick={() => handleOpenTacticalDialog('ai')}
                >
                  Full AI Analysis
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Tactical Analytics Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon color="primary" />
          Advanced Tactical Analytics & Situational Intelligence
        </Typography>
        
        {/* Fair Grounds Population Heatmap */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <FairgroundsHeatmap />
          </Grid>
        </Grid>

        {/* Tactical Metrics Grid */}
        <Box sx={{ mb: 4 }}>
          <TacticalMetricsGrid />
        </Box>
      </Box>

      {/* Tactical Component Dialogs */}
      <Dialog 
        fullScreen 
        open={tacticalDialogOpen}
        onClose={handleCloseTacticalDialog}
        TransitionComponent={React.forwardRef((props: any, ref) => <Box ref={ref} {...props} />)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedDialog === 'map' && <><MapIcon /> Tactical Map - Full Command View</>}
            {selectedDialog === 'comms' && <><RadioIcon /> Meshtastic Communications - Command Net</>}
            {selectedDialog === 'ai' && <><AIIcon /> AI Analysis - Command Intelligence</>}
          </Typography>
          <IconButton onClick={handleCloseTacticalDialog}>
            <FullscreenExitIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedDialog === 'map' && <TacticalMap />}
          {selectedDialog === 'comms' && <MeshtasticChat />}
          {selectedDialog === 'ai' && <AIAnalysisPanel />}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

// Add pulse animation for critical alerts
const pulseKeyframes = `
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
    }
  }
`;

// Inject CSS for animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

export default CommandDashboard;