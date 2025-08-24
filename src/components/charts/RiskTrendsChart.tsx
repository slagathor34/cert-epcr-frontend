import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, Typography, Box, Tabs, Tab, Alert } from '@mui/material';

interface RiskTrendsChartProps {
  title?: string;
}

const RiskTrendsChart: React.FC<RiskTrendsChartProps> = ({ 
  title = "Risk Probability Trends" 
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  // Mock data for risk trends over time
  const riskTrendsData = [
    { month: 'Jan', earthquake: 25, wildfire: 15, flood: 35, severe_weather: 45, infrastructure: 20, overall: 28 },
    { month: 'Feb', earthquake: 28, wildfire: 20, flood: 32, severe_weather: 38, infrastructure: 18, overall: 27.2 },
    { month: 'Mar', earthquake: 30, wildfire: 35, flood: 28, severe_weather: 35, infrastructure: 22, overall: 30 },
    { month: 'Apr', earthquake: 32, wildfire: 45, flood: 25, severe_weather: 42, infrastructure: 25, overall: 33.8 },
    { month: 'May', earthquake: 35, wildfire: 60, flood: 22, severe_weather: 38, infrastructure: 28, overall: 36.6 },
    { month: 'Jun', earthquake: 38, wildfire: 75, flood: 18, severe_weather: 35, infrastructure: 30, overall: 39.2 },
    { month: 'Jul', earthquake: 40, wildfire: 85, flood: 15, severe_weather: 32, infrastructure: 32, overall: 40.8 },
    { month: 'Aug', earthquake: 42, wildfire: 90, flood: 20, severe_weather: 28, infrastructure: 35, overall: 43 },
    { month: 'Sep', earthquake: 45, wildfire: 80, flood: 25, severe_weather: 40, infrastructure: 38, overall: 45.6 },
    { month: 'Oct', earthquake: 48, wildfire: 65, flood: 30, severe_weather: 45, infrastructure: 40, overall: 45.6 },
    { month: 'Nov', earthquake: 45, wildfire: 45, flood: 35, severe_weather: 50, infrastructure: 35, overall: 42 },
    { month: 'Dec', earthquake: 42, wildfire: 25, flood: 40, severe_weather: 55, infrastructure: 32, overall: 38.8 },
  ];

  // Mock data for current risk radar
  const currentRiskData = [
    { risk: 'Earthquake', probability: 42, impact: 90, preparedness: 75, fullMark: 100 },
    { risk: 'Wildfire', probability: 85, impact: 85, preparedness: 80, fullMark: 100 },
    { risk: 'Flooding', probability: 40, impact: 60, preparedness: 85, fullMark: 100 },
    { risk: 'Severe Weather', probability: 55, impact: 40, preparedness: 90, fullMark: 100 },
    { risk: 'Infrastructure', probability: 32, impact: 70, preparedness: 65, fullMark: 100 },
    { risk: 'Cybersecurity', probability: 65, impact: 50, preparedness: 70, fullMark: 100 },
  ];

  // Mock data for seasonal risk patterns
  const seasonalData = [
    { month: 'Winter', earthquake: 35, wildfire: 10, flood: 45, severe_weather: 70, infrastructure: 40 },
    { month: 'Spring', earthquake: 40, wildfire: 35, flood: 55, severe_weather: 60, infrastructure: 35 },
    { month: 'Summer', earthquake: 45, wildfire: 90, flood: 15, severe_weather: 30, infrastructure: 45 },
    { month: 'Fall', earthquake: 42, wildfire: 70, flood: 35, severe_weather: 50, infrastructure: 38 },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{`${label}`}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {`${entry.name}: ${entry.value}${entry.unit || '%'}`}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const RadarTooltip = ({ active, payload, label }: any) => {
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
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{`Risk: ${label}`}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {`${entry.dataKey}: ${entry.value}%`}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const getRiskLevel = (value: number) => {
    if (value >= 70) return 'critical';
    if (value >= 50) return 'high';
    if (value >= 30) return 'medium';
    return 'low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Risk Trends" />
            <Tab label="Current Assessment" />
            <Tab label="Seasonal Patterns" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box>
            {riskTrendsData[riskTrendsData.length - 1].overall >= 40 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Overall risk trend increasing. Current level: {riskTrendsData[riskTrendsData.length - 1].overall}%
              </Alert>
            )}
            <ResponsiveContainer width="100%" height="75%">
              <AreaChart data={riskTrendsData}>
                <defs>
                  <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="overall"
                  stroke="#1976d2"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#overallGradient)"
                  name="Overall Risk Level"
                />
                <Line 
                  type="monotone" 
                  dataKey="wildfire" 
                  stroke="#d32f2f" 
                  strokeWidth={2}
                  name="Wildfire Risk"
                  dot={{ fill: '#d32f2f', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="earthquake" 
                  stroke="#f57c00" 
                  strokeWidth={2}
                  name="Earthquake Risk"
                  dot={{ fill: '#f57c00', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="severe_weather" 
                  stroke="#2e7d32" 
                  strokeWidth={2}
                  name="Severe Weather"
                  dot={{ fill: '#2e7d32', r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}

        {tabValue === 1 && (
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart data={currentRiskData}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis 
                dataKey="risk" 
                tick={{ fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<RadarTooltip />} />
              <Legend />
              <Radar
                name="Probability"
                dataKey="probability"
                stroke="#d32f2f"
                fill="#d32f2f"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Impact"
                dataKey="impact"
                stroke="#f57c00"
                fill="#f57c00"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Preparedness"
                dataKey="preparedness"
                stroke="#2e7d32"
                fill="#2e7d32"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {tabValue === 2 && (
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={seasonalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="wildfire" 
                stroke="#d32f2f" 
                strokeWidth={4}
                name="Wildfire Risk"
                dot={{ fill: '#d32f2f', r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="severe_weather" 
                stroke="#2e7d32" 
                strokeWidth={4}
                name="Severe Weather"
                dot={{ fill: '#2e7d32', r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="flood" 
                stroke="#1976d2" 
                strokeWidth={4}
                name="Flooding"
                dot={{ fill: '#1976d2', r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="earthquake" 
                stroke="#f57c00" 
                strokeWidth={4}
                name="Earthquake"
                dot={{ fill: '#f57c00', r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="infrastructure" 
                stroke="#7b1fa2" 
                strokeWidth={4}
                name="Infrastructure"
                dot={{ fill: '#7b1fa2', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskTrendsChart;