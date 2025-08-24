import React from 'react';
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
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  Store as StoreIcon,
  Build as BuildIcon,
  LocalHospital as MedicalIcon,
  Security as SecurityIcon,
  Radio as RadioIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import EquipmentUsageChart from '../components/charts/EquipmentUsageChart';
import InventoryForecastChart from '../components/charts/InventoryForecastChart';

const LogisticsPage: React.FC = () => {
  // Mock data for logistics visualizations
  const inventoryStats = {
    totalItems: 1247,
    lowStockItems: 23,
    outOfStock: 7,
    recentlyUpdated: 156,
    totalValue: 89500
  };

  const equipmentCategories = [
    { name: 'Medical Supplies', count: 312, value: 25800, status: 'good', icon: <MedicalIcon /> },
    { name: 'Search & Rescue', count: 189, value: 34200, status: 'warning', icon: <SecurityIcon /> },
    { name: 'Communication', count: 87, value: 18900, status: 'good', icon: <RadioIcon /> },
    { name: 'Tools & Hardware', count: 234, value: 7800, status: 'critical', icon: <BuildIcon /> },
    { name: 'Shelter & Comfort', count: 145, value: 2800, status: 'good', icon: <StoreIcon /> },
  ];

  const recentTransactions = [
    { id: 'TXN-001', type: 'Check Out', item: 'Trauma Kit Alpha-7', member: 'J. Martinez', date: '2024-01-20', status: 'active' },
    { id: 'TXN-002', type: 'Check In', item: 'Radio Motorola T460', member: 'S. Chen', date: '2024-01-20', status: 'returned' },
    { id: 'TXN-003', type: 'Maintenance', item: 'Defibrillator Unit B', member: 'Tech Support', date: '2024-01-19', status: 'maintenance' },
    { id: 'TXN-004', type: 'Check Out', item: 'Search Light LED-300', member: 'R. Johnson', date: '2024-01-19', status: 'active' },
    { id: 'TXN-005', type: 'Procurement', item: 'Medical Gauze 4x4 (50pk)', member: 'Supply Chain', date: '2024-01-18', status: 'received' },
  ];

  const lowStockAlerts = [
    { item: 'N95 Masks', current: 12, minimum: 50, category: 'Medical' },
    { item: 'Emergency Radios', current: 3, minimum: 15, category: 'Communication' },
    { item: 'Flashlights (LED)', current: 8, minimum: 25, category: 'Equipment' },
    { item: 'First Aid Kits', current: 4, minimum: 20, category: 'Medical' },
    { item: 'Emergency Blankets', current: 15, minimum: 75, category: 'Shelter' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getTransactionColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'returned': return 'success';
      case 'maintenance': return 'warning';
      case 'received': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InventoryIcon sx={{ fontSize: 'inherit', color: 'primary.main' }} />
          Logistics Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Equipment tracking, inventory management, and resource allocation for emergency response operations
        </Typography>

        {/* Critical Alerts */}
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Low Stock Alert</AlertTitle>
          7 items are critically low or out of stock. Immediate procurement action required.
        </Alert>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Total Inventory
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {inventoryStats.totalItems.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items tracked
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                  <InventoryIcon />
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
                    Low Stock
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {inventoryStats.lowStockItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Need attention
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                  <WarningIcon />
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
                    Total Value
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    ${inventoryStats.totalValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Equipment value
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                  <TrendingIcon />
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
                    Out of Stock
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {inventoryStats.outOfStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Critical items
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
                  <ShippingIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Equipment Categories */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PieChartIcon color="primary" />
                Equipment Categories
              </Typography>
              <List>
                {equipmentCategories.map((category, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${getStatusColor(category.status)}.light`, width: 40, height: 40 }}>
                        {category.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {category.name}
                          </Typography>
                          <Chip 
                            label={category.status.toUpperCase()} 
                            color={getStatusColor(category.status) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {category.count} items • ${category.value.toLocaleString()} value
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={category.status === 'good' ? 85 : category.status === 'warning' ? 60 : 25}
                              sx={{ flexGrow: 1, mr: 1, height: 6, borderRadius: 3 }}
                              color={getStatusColor(category.status) as any}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {category.status === 'good' ? '85%' : category.status === 'warning' ? '60%' : '25%'}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="warning" />
                Low Stock Alerts
              </Typography>
              <List dense>
                {lowStockAlerts.map((alert, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.item}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Current: {alert.current} | Minimum: {alert.minimum} | Category: {alert.category}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(alert.current / alert.minimum) * 100}
                            sx={{ mt: 1, height: 4, borderRadius: 2 }}
                            color={alert.current < alert.minimum * 0.3 ? 'error' : 'warning'}
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

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon color="primary" />
                Recent Equipment Transactions
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Equipment Item</TableCell>
                      <TableCell>Member</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTransactions.map((transaction, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {transaction.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transaction.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {transaction.item}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transaction.member}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(transaction.date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={transaction.status.replace('_', ' ').toUpperCase()}
                            color={getTransactionColor(transaction.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Transaction">
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

        {/* Interactive Analytics Charts */}
        <Grid item xs={12} md={6}>
          <EquipmentUsageChart title="Equipment Usage Analytics" />
        </Grid>

        <Grid item xs={12} md={6}>
          <InventoryForecastChart title="Inventory Forecasting" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LogisticsPage;