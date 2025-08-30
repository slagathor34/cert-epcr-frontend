import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Alert,
  AlertTitle,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  LocalHospital as MedicalIcon,
  Inventory as LogisticsIcon,
  EventNote as PlanningIcon,
  Groups as MembersIcon,
  Security as OperationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  Assignment as TaskIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Build as EquipmentIcon,
  LocalShipping as SupplyIcon,
  Schedule as ScheduleIcon,
  Notifications as AlertIcon,
  Radio as CommsIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const IntegratedCommandMetrics: React.FC = () => {
  // Medical Section Data
  const medicalData = {
    activePatients: 23,
    criticalCases: 4,
    hospitalTransports: 12,
    onSceneCrews: 8,
    avgResponseTime: '4.2 min',
    capacityUtilization: 78,
    trends: [
      { time: '08:00', incidents: 2, transports: 1 },
      { time: '10:00', incidents: 5, transports: 3 },
      { time: '12:00', incidents: 8, transports: 5 },
      { time: '14:00', incidents: 12, transports: 8 },
      { time: '16:00', incidents: 18, transports: 12 },
      { time: '18:00', incidents: 15, transports: 10 },
      { time: '20:00', incidents: 10, transports: 6 }
    ]
  };

  // Operations Section Data
  const operationsData = {
    activeIncidents: 7,
    unitsDeployed: 15,
    communicationsStatus: 'Optimal',
    securityAlerts: 3,
    operationalReadiness: 92,
    incidentTypes: [
      { name: 'Medical Emergency', value: 45, color: '#f44336' },
      { name: 'Security Alert', value: 25, color: '#2196f3' },
      { name: 'Lost Person', value: 20, color: '#ff9800' },
      { name: 'Equipment Issue', value: 10, color: '#9c27b0' }
    ]
  };

  // Logistics Section Data
  const logisticsData = {
    inventoryStatus: 85,
    criticalSupplies: 2,
    equipmentDeployed: 78,
    supplyRequests: 5,
    deliveryStatus: 'On Schedule',
    categories: [
      { name: 'Medical Supplies', stock: 85, critical: 15, deployed: 23 },
      { name: 'Communication Equipment', stock: 92, critical: 8, deployed: 18 },
      { name: 'Safety Gear', stock: 76, critical: 24, deployed: 31 },
      { name: 'Transport Vehicles', stock: 88, critical: 12, deployed: 12 },
      { name: 'Emergency Tools', stock: 94, critical: 6, deployed: 15 }
    ]
  };

  // Planning Section Data
  const planningData = {
    activePlans: 6,
    taskCompletion: 73,
    resourceAllocation: 'Optimal',
    nextBriefing: '20:00',
    criticalTasks: 8,
    objectives: [
      { objective: 'Fair Grounds Crowd Management', completion: 85, priority: 'High' },
      { objective: 'Emergency Response Coordination', completion: 92, priority: 'Critical' },
      { objective: 'Supply Chain Management', completion: 68, priority: 'Medium' },
      { objective: 'Personnel Scheduling', completion: 76, priority: 'High' },
      { objective: 'Communication Protocols', completion: 94, priority: 'Critical' }
    ]
  };

  // Members Section Data
  const membersData = {
    totalPersonnel: 67,
    onDuty: 45,
    available: 22,
    avgExperience: '4.2 years',
    certificationStatus: 89,
    deploymentStatus: [
      { unit: 'Medical Team Alpha', personnel: 8, status: 'Deployed', location: 'Main Stage' },
      { unit: 'Security Team Bravo', personnel: 12, status: 'Deployed', location: 'North Entrance' },
      { unit: 'Logistics Team Charlie', personnel: 6, status: 'Available', location: 'Command Post' },
      { unit: 'Communications Delta', personnel: 4, status: 'Deployed', location: 'Mobile Units' },
      { unit: 'Planning Team Echo', personnel: 5, status: 'Available', location: 'Command Post' }
    ]
  };

  const getSectionStatusColor = (percentage: number) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 70) return '#ff9800';
    return '#f44336';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#f44336';
      case 'High': return '#ff9800';
      case 'Medium': return '#fbc02d';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Section Overview Cards */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <OperationsIcon color="primary" />
          Unified Command Dashboard - All Sections Status
        </Typography>
        
        <Grid container spacing={2}>
          {/* Medical Section */}
          <Grid item xs={12} md={2.4}>
            <Card sx={{ height: 160, background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <MedicalIcon fontSize="large" />
                  <Typography variant="h4">{medicalData.activePatients}</Typography>
                </Box>
                <Typography variant="h6">Medical</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {medicalData.criticalCases} Critical • {medicalData.onSceneCrews} Crews
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Avg Response: {medicalData.avgResponseTime}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Operations Section */}
          <Grid item xs={12} md={2.4}>
            <Card sx={{ height: 160, background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <OperationsIcon fontSize="large" />
                  <Typography variant="h4">{operationsData.activeIncidents}</Typography>
                </Box>
                <Typography variant="h6">Operations</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {operationsData.unitsDeployed} Units • {operationsData.securityAlerts} Alerts
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Comms: {operationsData.communicationsStatus}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Logistics Section */}
          <Grid item xs={12} md={2.4}>
            <Card sx={{ height: 160, background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <LogisticsIcon fontSize="large" />
                  <Typography variant="h4">{logisticsData.inventoryStatus}%</Typography>
                </Box>
                <Typography variant="h6">Logistics</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {logisticsData.criticalSupplies} Critical • {logisticsData.supplyRequests} Requests
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Status: {logisticsData.deliveryStatus}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Planning Section */}
          <Grid item xs={12} md={2.4}>
            <Card sx={{ height: 160, background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <PlanningIcon fontSize="large" />
                  <Typography variant="h4">{planningData.taskCompletion}%</Typography>
                </Box>
                <Typography variant="h6">Planning</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {planningData.activePlans} Plans • {planningData.criticalTasks} Tasks
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Next Brief: {planningData.nextBriefing}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Members Section */}
          <Grid item xs={12} md={2.4}>
            <Card sx={{ height: 160, background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <MembersIcon fontSize="large" />
                  <Typography variant="h4">{membersData.onDuty}</Typography>
                </Box>
                <Typography variant="h6">Members</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {membersData.totalPersonnel} Total • {membersData.available} Available
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Avg Exp: {membersData.avgExperience}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Medical & Operations Analytics */}
      <Grid item xs={12} lg={8}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Medical Response & Operations Activity</Typography>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={medicalData.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stackId="1" 
                  stroke="#f44336" 
                  fill="#f44336" 
                  fillOpacity={0.6}
                  name="Medical Incidents"
                />
                <Area 
                  type="monotone" 
                  dataKey="transports" 
                  stackId="2" 
                  stroke="#2196f3" 
                  fill="#2196f3" 
                  fillOpacity={0.6}
                  name="Hospital Transports"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Operations Incident Types */}
      <Grid item xs={12} lg={4}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Incident Distribution</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={operationsData.incidentTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name.split(' ')[0]}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {operationsData.incidentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Logistics Supply Status */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ height: 350 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Logistics Supply Status</Typography>
            <Grid container spacing={1}>
              {logisticsData.categories.map((category, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">{category.name}</Typography>
                      <Chip 
                        label={`${category.stock}%`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getSectionStatusColor(category.stock), 
                          color: '#fff'
                        }} 
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={category.stock} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: '#f5f5f5',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getSectionStatusColor(category.stock)
                        }
                      }} 
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        Deployed: {category.deployed}
                      </Typography>
                      <Typography variant="caption" color="error">
                        Critical: {category.critical}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Planning Objectives */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ height: 350 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Strategic Planning Objectives</Typography>
            <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
              {planningData.objectives.map((obj, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <TaskIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {obj.objective}
                        </Typography>
                        <Chip
                          label={obj.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(obj.priority),
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={obj.completion}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: '#f5f5f5',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getSectionStatusColor(obj.completion)
                            }
                          }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {obj.completion}% Complete
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

      {/* Members Deployment Status */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Personnel Deployment Status</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Unit</TableCell>
                    <TableCell align="center">Personnel</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="center">Readiness</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {membersData.deploymentStatus.map((unit, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                            {unit.unit.split(' ')[0][0]}{unit.unit.split(' ')[1][0]}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {unit.unit}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Badge badgeContent={unit.personnel} color="primary">
                          <PersonIcon />
                        </Badge>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={unit.status}
                          size="small"
                          color={unit.status === 'Deployed' ? 'success' : 'default'}
                          variant={unit.status === 'Deployed' ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">{unit.location}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <CheckIcon color="success" />
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
  );
};

export default IntegratedCommandMetrics;