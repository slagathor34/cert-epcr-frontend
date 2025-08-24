import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  Place as PlaceIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface ResourceAllocationMapProps {
  title?: string;
}

const ResourceAllocationMap: React.FC<ResourceAllocationMapProps> = ({ 
  title = "Interactive Resource Allocation" 
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  // Mock data for resource distribution across sectors
  const sectorData = [
    { 
      sector: 'North Sacramento', 
      teams: 12, 
      equipment: 95, 
      coverage: 85, 
      population: 45000,
      status: 'optimal',
      lat: 38.65,
      lng: -121.45,
      responseTime: 8.5
    },
    { 
      sector: 'South Sacramento', 
      teams: 8, 
      equipment: 78, 
      coverage: 72, 
      population: 38000,
      status: 'needs attention',
      lat: 38.50,
      lng: -121.48,
      responseTime: 12.2
    },
    { 
      sector: 'East Sacramento', 
      teams: 15, 
      equipment: 88, 
      coverage: 90, 
      population: 52000,
      status: 'good',
      lat: 38.58,
      lng: -121.35,
      responseTime: 9.8
    },
    { 
      sector: 'West Sacramento', 
      teams: 10, 
      equipment: 92, 
      coverage: 88, 
      population: 41000,
      status: 'optimal',
      lat: 38.58,
      lng: -121.55,
      responseTime: 7.5
    },
    { 
      sector: 'Downtown Core', 
      teams: 6, 
      equipment: 65, 
      coverage: 60, 
      population: 28000,
      status: 'critical',
      lat: 38.58,
      lng: -121.49,
      responseTime: 15.3
    },
  ];

  // Mock data for equipment distribution
  const equipmentData = [
    { category: 'Medical', north: 45, south: 32, east: 52, west: 38, downtown: 18 },
    { category: 'Communication', north: 28, south: 22, east: 35, west: 30, downtown: 15 },
    { category: 'Search & Rescue', north: 35, south: 28, east: 42, west: 33, downtown: 12 },
    { category: 'Tools', north: 22, south: 18, east: 28, west: 25, downtown: 8 },
    { category: 'Shelter', north: 18, south: 15, east: 22, west: 20, downtown: 6 },
  ];

  // Mock data for coverage vs population scatter plot
  const coverageData = sectorData.map(sector => ({
    ...sector,
    efficiency: (sector.coverage / sector.teams) * 10,
    populationDensity: sector.population / 1000,
  }));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return '#2e7d32';
      case 'good': return '#1976d2';
      case 'needs attention': return '#f57c00';
      case 'critical': return '#d32f2f';
      default: return '#666';
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'success';
      case 'good': return 'info';
      case 'needs attention': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 2, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {`${entry.dataKey}: ${entry.value}`}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 2, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{data.sector}</Typography>
          <Typography variant="body2">Teams: {data.teams}</Typography>
          <Typography variant="body2">Coverage: {data.coverage}%</Typography>
          <Typography variant="body2">Population: {data.population.toLocaleString()}</Typography>
          <Typography variant="body2">Response Time: {data.responseTime} min</Typography>
          <Chip 
            label={data.status.toUpperCase()}
            color={getStatusChipColor(data.status) as any}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Sector Overview" />
            <Tab label="Equipment Distribution" />
            <Tab label="Coverage Analysis" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box sx={{ height: '85%' }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              <Grid item xs={8}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="sector" 
                      tick={{ fontSize: 10 }}
                      stroke="#666"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="teams" 
                      fill="#1976d2" 
                      name="Teams Assigned"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="coverage" 
                      fill="#2e7d32" 
                      name="Coverage %"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={4}>
                <List dense sx={{ maxHeight: '100%', overflow: 'auto' }}>
                  {sectorData.map((sector, index) => (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: getStatusColor(sector.status), 
                            width: 32, 
                            height: 32 
                          }}
                        >
                          <PlaceIcon fontSize="small" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {sector.sector}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {sector.teams} teams • {sector.population.toLocaleString()} pop
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={sector.coverage}
                              sx={{ mt: 0.5, height: 4 }}
                              color={getStatusChipColor(sector.status) as any}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {sector.responseTime} min avg response
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={equipmentData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                type="category"
                dataKey="category"
                tick={{ fontSize: 12 }}
                stroke="#666"
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="north" stackId="a" fill="#1976d2" name="North" />
              <Bar dataKey="south" stackId="a" fill="#d32f2f" name="South" />
              <Bar dataKey="east" stackId="a" fill="#2e7d32" name="East" />
              <Bar dataKey="west" stackId="a" fill="#f57c00" name="West" />
              <Bar dataKey="downtown" stackId="a" fill="#7b1fa2" name="Downtown" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {tabValue === 2 && (
          <ResponsiveContainer width="100%" height="85%">
            <ScatterChart data={coverageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                type="number" 
                dataKey="teams"
                name="Teams"
                tick={{ fontSize: 12 }}
                stroke="#666"
                label={{ value: 'Number of Teams', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="coverage"
                name="Coverage"
                tick={{ fontSize: 12 }}
                stroke="#666"
                domain={[40, 100]}
                label={{ value: 'Coverage %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<ScatterTooltip />} />
              <Legend />
              {sectorData.map((sector, index) => (
                <Scatter
                  key={index}
                  name={sector.sector}
                  data={[{
                    teams: sector.teams,
                    coverage: sector.coverage,
                    sector: sector.sector,
                    population: sector.population,
                    responseTime: sector.responseTime,
                    status: sector.status
                  }]}
                  fill={getStatusColor(sector.status)}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceAllocationMap;