import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, Typography, Box, Tabs, Tab, Chip } from '@mui/material';

interface InventoryForecastChartProps {
  title?: string;
}

const InventoryForecastChart: React.FC<InventoryForecastChartProps> = ({ 
  title = "Inventory Forecasting & Analysis" 
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  // Mock data for inventory forecasting
  const forecastData = [
    { month: 'Sep', actual: 1247, predicted: 1250, procurement: 150, depletion: 125, confidence: 95 },
    { month: 'Oct', actual: 1289, predicted: 1285, procurement: 175, depletion: 140, confidence: 93 },
    { month: 'Nov', actual: 1324, predicted: 1320, procurement: 160, depletion: 135, confidence: 92 },
    { month: 'Dec', actual: null, predicted: 1365, procurement: 180, depletion: 145, confidence: 88 },
    { month: 'Jan', actual: null, predicted: 1398, procurement: 170, depletion: 150, confidence: 85 },
    { month: 'Feb', actual: null, predicted: 1425, procurement: 185, depletion: 155, confidence: 82 },
    { month: 'Mar', actual: null, predicted: 1460, procurement: 190, depletion: 160, confidence: 79 },
    { month: 'Apr', actual: null, predicted: 1495, procurement: 195, depletion: 165, confidence: 76 },
  ];

  // Mock data for category distribution
  const categoryData = [
    { name: 'Medical Supplies', value: 312, percentage: 25.0, color: '#d32f2f' },
    { name: 'Search & Rescue', value: 289, percentage: 23.2, color: '#2e7d32' },
    { name: 'Tools & Hardware', value: 234, percentage: 18.8, color: '#f57c00' },
    { name: 'Communication', value: 187, percentage: 15.0, color: '#1976d2' },
    { name: 'Shelter & Comfort', value: 145, percentage: 11.6, color: '#7b1fa2' },
    { name: 'Safety Equipment', value: 80, percentage: 6.4, color: '#00796b' },
  ];

  // Mock data for seasonal patterns
  const seasonalData = [
    { month: 'Jan', medical: 85, rescue: 45, communication: 65, tools: 35, historical: 78 },
    { month: 'Feb', medical: 78, rescue: 42, communication: 58, tools: 32, historical: 72 },
    { month: 'Mar', medical: 92, rescue: 68, communication: 75, tools: 48, historical: 85 },
    { month: 'Apr', medical: 105, rescue: 78, communication: 82, tools: 55, historical: 92 },
    { month: 'May', medical: 118, rescue: 85, communication: 95, tools: 62, historical: 98 },
    { month: 'Jun', medical: 125, rescue: 92, communication: 105, tools: 68, historical: 105 },
    { month: 'Jul', medical: 135, rescue: 98, communication: 115, tools: 75, historical: 112 },
    { month: 'Aug', medical: 142, rescue: 105, communication: 125, tools: 82, historical: 118 },
    { month: 'Sep', medical: 128, rescue: 88, communication: 108, tools: 65, historical: 108 },
    { month: 'Oct', medical: 115, rescue: 72, communication: 92, tools: 58, historical: 95 },
    { month: 'Nov', medical: 98, rescue: 58, communication: 78, tools: 45, historical: 85 },
    { month: 'Dec', medical: 88, rescue: 52, communication: 68, tools: 38, historical: 78 },
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
              {`${entry.name}: ${entry.value}${entry.dataKey === 'confidence' ? '%' : ' items'}`}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
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
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{data.name}</Typography>
          <Typography variant="body2">Items: {data.value}</Typography>
          <Typography variant="body2">Percentage: {data.percentage}%</Typography>
        </Box>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Forecast Model" />
            <Tab label="Category Distribution" />
            <Tab label="Seasonal Patterns" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="actual" 
                fill="#1976d2" 
                name="Actual Inventory"
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="predicted" 
                stroke="#d32f2f" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Predicted Inventory"
                dot={{ fill: '#d32f2f', r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="confidence" 
                stroke="#2e7d32" 
                strokeWidth={2}
                name="Confidence %"
                dot={{ fill: '#2e7d32', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {tabValue === 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '85%' }}>
            <Box sx={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ flex: 1, pl: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Category Breakdown</Typography>
              {categoryData.map((category, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      bgcolor: category.color, 
                      mr: 1,
                      borderRadius: '2px'
                    }} 
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {category.name}
                  </Typography>
                  <Chip 
                    label={`${category.value} items`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {tabValue === 2 && (
          <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={seasonalData}>
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
              <Bar 
                dataKey="historical" 
                fill="#e0e0e0" 
                name="Historical Average"
                radius={[2, 2, 0, 0]}
              />
              <Line 
                type="monotone" 
                dataKey="medical" 
                stroke="#d32f2f" 
                strokeWidth={2}
                name="Medical Supplies"
                dot={{ fill: '#d32f2f', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="rescue" 
                stroke="#2e7d32" 
                strokeWidth={2}
                name="Search & Rescue"
                dot={{ fill: '#2e7d32', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="communication" 
                stroke="#1976d2" 
                strokeWidth={2}
                name="Communication"
                dot={{ fill: '#1976d2', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="tools" 
                stroke="#f57c00" 
                strokeWidth={2}
                name="Tools & Hardware"
                dot={{ fill: '#f57c00', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryForecastChart;