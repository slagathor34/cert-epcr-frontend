import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  LinearProgress,
  Chip
} from '@mui/material';
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
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const TacticalMetricsGrid: React.FC = () => {
  // Response Time Data
  const responseTimeData = [
    { time: '08:00', medical: 3.2, fire: 4.1, security: 2.8, ems: 3.5 },
    { time: '10:00', medical: 2.8, fire: 3.9, security: 2.5, ems: 3.1 },
    { time: '12:00', medical: 4.2, fire: 4.5, security: 3.2, ems: 4.0 },
    { time: '14:00', medical: 3.8, fire: 4.2, security: 3.0, ems: 3.7 },
    { time: '16:00', medical: 5.1, fire: 5.8, security: 4.1, ems: 4.9 },
    { time: '18:00', medical: 4.5, fire: 5.2, security: 3.8, ems: 4.3 },
    { time: '20:00', medical: 3.9, fire: 4.8, security: 3.4, ems: 4.1 }
  ];

  // Incident Distribution
  const incidentData = [
    { name: 'Medical Emergency', value: 45, color: '#ff5722' },
    { name: 'Security Alert', value: 25, color: '#2196f3' },
    { name: 'Fire Hazard', value: 15, color: '#f44336' },
    { name: 'Lost Person', value: 10, color: '#ff9800' },
    { name: 'Equipment Failure', value: 5, color: '#9c27b0' }
  ];

  // Resource Utilization
  const resourceData = [
    { category: 'Medical', available: 12, deployed: 8, capacity: 20 },
    { category: 'Security', available: 18, deployed: 15, capacity: 33 },
    { category: 'Fire/EMS', available: 6, deployed: 4, capacity: 10 },
    { category: 'Communications', available: 8, deployed: 6, capacity: 14 },
    { category: 'Transport', available: 4, deployed: 2, capacity: 6 }
  ];

  // Threat Assessment Radar
  const threatData = [
    { threat: 'Crowd Control', current: 85, baseline: 60 },
    { threat: 'Weather', current: 30, baseline: 45 },
    { threat: 'Medical Load', current: 70, baseline: 50 },
    { threat: 'Security Risk', current: 45, baseline: 40 },
    { threat: 'Infrastructure', current: 25, baseline: 35 },
    { threat: 'Communication', current: 15, baseline: 20 }
  ];

  // Real-time Activity
  const activityData = [
    { time: '08:00', incidents: 2, resolved: 2, active: 0 },
    { time: '10:00', incidents: 5, resolved: 4, active: 1 },
    { time: '12:00', incidents: 8, resolved: 7, active: 1 },
    { time: '14:00', incidents: 12, resolved: 10, active: 2 },
    { time: '16:00', incidents: 18, resolved: 15, active: 3 },
    { time: '18:00', incidents: 15, resolved: 13, active: 2 },
    { time: '20:00', incidents: 10, resolved: 9, active: 1 }
  ];

  const getUtilizationPercentage = (deployed: number, capacity: number) => {
    return Math.round((deployed / capacity) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return '#f44336';
    if (percentage >= 60) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Grid container spacing={2}>
      {/* Response Times */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ height: 300 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Response Times (Minutes)</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="medical" stroke="#ff5722" strokeWidth={2} name="Medical" />
                <Line type="monotone" dataKey="fire" stroke="#f44336" strokeWidth={2} name="Fire" />
                <Line type="monotone" dataKey="security" stroke="#2196f3" strokeWidth={2} name="Security" />
                <Line type="monotone" dataKey="ems" stroke="#4caf50" strokeWidth={2} name="EMS" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Incident Distribution */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ height: 300 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Incident Types Distribution</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={incidentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incidentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Resource Utilization */}
      <Grid item xs={12} lg={8}>
        <Card sx={{ height: 350 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Resource Utilization Status</Typography>
            <Grid container spacing={2}>
              {resourceData.map((resource, index) => {
                const utilization = getUtilizationPercentage(resource.deployed, resource.capacity);
                const color = getUtilizationColor(utilization);
                
                return (
                  <Grid item xs={12} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                          {resource.category}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`${utilization}%`} 
                            size="small" 
                            sx={{ 
                              backgroundColor: color, 
                              color: '#fff',
                              fontWeight: 'bold'
                            }} 
                          />
                          <Typography variant="caption" color="textSecondary">
                            {resource.deployed}/{resource.capacity}
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={utilization} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#f5f5f5',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: color
                          }
                        }} 
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Available: {resource.available}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Deployed: {resource.deployed}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Threat Assessment Radar */}
      <Grid item xs={12} lg={4}>
        <Card sx={{ height: 350 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Threat Assessment Matrix</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={threatData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="threat" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar 
                  name="Current Level" 
                  dataKey="current" 
                  stroke="#f44336" 
                  fill="#f44336" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar 
                  name="Baseline" 
                  dataKey="baseline" 
                  stroke="#4caf50" 
                  fill="#4caf50" 
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Activity Timeline */}
      <Grid item xs={12}>
        <Card sx={{ height: 300 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Real-Time Activity Timeline</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stackId="1" 
                  stroke="#2196f3" 
                  fill="#2196f3" 
                  fillOpacity={0.6}
                  name="Total Incidents"
                />
                <Area 
                  type="monotone" 
                  dataKey="resolved" 
                  stackId="2" 
                  stroke="#4caf50" 
                  fill="#4caf50" 
                  fillOpacity={0.6}
                  name="Resolved"
                />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stackId="3" 
                  stroke="#ff5722" 
                  fill="#ff5722" 
                  fillOpacity={0.8}
                  name="Active"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TacticalMetricsGrid;