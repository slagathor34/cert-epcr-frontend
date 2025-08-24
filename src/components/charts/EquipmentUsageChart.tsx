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
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, Typography, Box, Tabs, Tab } from '@mui/material';

interface EquipmentUsageChartProps {
  title?: string;
}

const EquipmentUsageChart: React.FC<EquipmentUsageChartProps> = ({ 
  title = "Equipment Usage Analytics" 
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  // Mock data for equipment usage over time
  const usageData = [
    { month: 'Jan', medical: 65, communication: 45, rescue: 78, tools: 32, shelter: 28 },
    { month: 'Feb', medical: 72, communication: 52, rescue: 85, tools: 38, shelter: 31 },
    { month: 'Mar', medical: 68, communication: 48, rescue: 82, tools: 35, shelter: 29 },
    { month: 'Apr', medical: 81, communication: 58, rescue: 91, tools: 42, shelter: 36 },
    { month: 'May', medical: 75, communication: 55, rescue: 88, tools: 39, shelter: 33 },
    { month: 'Jun', medical: 89, communication: 62, rescue: 95, tools: 45, shelter: 38 },
    { month: 'Jul', medical: 92, communication: 68, rescue: 98, tools: 48, shelter: 41 },
    { month: 'Aug', medical: 87, communication: 65, rescue: 94, tools: 46, shelter: 39 },
  ];

  // Mock data for equipment checkout frequency
  const checkoutData = [
    { equipment: 'Trauma Kits', checkouts: 145, returns: 142, maintenance: 3 },
    { equipment: 'Radios', checkouts: 89, returns: 87, maintenance: 2 },
    { equipment: 'Flashlights', checkouts: 234, returns: 230, maintenance: 4 },
    { equipment: 'First Aid', checkouts: 178, returns: 175, maintenance: 3 },
    { equipment: 'Search Lights', checkouts: 67, returns: 65, maintenance: 2 },
    { equipment: 'Emergency Blankets', checkouts: 98, returns: 96, maintenance: 2 },
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
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{`Month: ${label}`}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {`${entry.dataKey}: ${entry.value} uses`}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
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

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Usage Trends" />
            <Tab label="Checkout Activity" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="medical" 
                stroke="#d32f2f" 
                strokeWidth={3}
                name="Medical Supplies"
                dot={{ fill: '#d32f2f', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="communication" 
                stroke="#1976d2" 
                strokeWidth={3}
                name="Communication"
                dot={{ fill: '#1976d2', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="rescue" 
                stroke="#2e7d32" 
                strokeWidth={3}
                name="Search & Rescue"
                dot={{ fill: '#2e7d32', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="tools" 
                stroke="#f57c00" 
                strokeWidth={3}
                name="Tools & Hardware"
                dot={{ fill: '#f57c00', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="shelter" 
                stroke="#7b1fa2" 
                strokeWidth={3}
                name="Shelter & Comfort"
                dot={{ fill: '#7b1fa2', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {tabValue === 1 && (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={checkoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="equipment" 
                tick={{ fontSize: 11 }}
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend />
              <Bar 
                dataKey="checkouts" 
                fill="#1976d2" 
                name="Checkouts"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="returns" 
                fill="#2e7d32" 
                name="Returns"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="maintenance" 
                fill="#f57c00" 
                name="In Maintenance"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EquipmentUsageChart;