import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import {
  People as PeopleIcon,
  Warning as WarningIcon,
  LocalHospital as MedicalIcon,
  Security as SecurityIcon,
  Restaurant as FoodIcon,
  Attractions as AttractionIcon,
  DirectionsCar as ParkingIcon,
  ExitToApp as ExitIcon
} from '@mui/icons-material';

interface HeatmapZone {
  id: string;
  name: string;
  density: number;
  color: string;
  people: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  type: 'attraction' | 'food' | 'parking' | 'entrance' | 'medical' | 'security';
}

const FairgroundsHeatmap: React.FC = () => {
  const zones: HeatmapZone[] = [
    { id: 'main_stage', name: 'Main Stage', density: 95, color: '#ff1744', people: 2500, risk: 'critical', type: 'attraction' },
    { id: 'ferris_wheel', name: 'Ferris Wheel', density: 85, color: '#ff5722', people: 850, risk: 'high', type: 'attraction' },
    { id: 'food_court', name: 'Food Court', density: 78, color: '#ff9800', people: 1200, risk: 'high', type: 'food' },
    { id: 'carnival_games', name: 'Carnival Games', density: 65, color: '#ffc107', people: 680, risk: 'medium', type: 'attraction' },
    { id: 'petting_zoo', name: 'Petting Zoo', density: 45, color: '#8bc34a', people: 320, risk: 'low', type: 'attraction' },
    { id: 'north_parking', name: 'North Parking', density: 25, color: '#4caf50', people: 150, risk: 'low', type: 'parking' },
    { id: 'south_entrance', name: 'South Entrance', density: 70, color: '#ff9800', people: 450, risk: 'medium', type: 'entrance' },
    { id: 'medical_tent', name: 'Medical Tent', density: 15, color: '#4caf50', people: 25, risk: 'low', type: 'medical' },
    { id: 'beer_garden', name: 'Beer Garden', density: 80, color: '#ff5722', people: 600, risk: 'high', type: 'food' },
    { id: 'kiddie_rides', name: 'Kiddie Rides', density: 55, color: '#ffeb3b', people: 280, risk: 'medium', type: 'attraction' }
  ];

  const totalPeople = zones.reduce((sum, zone) => sum + zone.people, 0);
  const averageDensity = Math.round(zones.reduce((sum, zone) => sum + zone.density, 0) / zones.length);

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'attraction': return <AttractionIcon />;
      case 'food': return <FoodIcon />;
      case 'parking': return <ParkingIcon />;
      case 'entrance': return <ExitIcon />;
      case 'medical': return <MedicalIcon />;
      case 'security': return <SecurityIcon />;
      default: return <PeopleIcon />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#fbc02d';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon color="primary" />
          Fair Grounds Population Heatmap
        </Typography>

        <Grid container spacing={2}>
          {/* Heatmap Visualization */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: 400, position: 'relative', backgroundColor: '#f5f5f5' }}>
              {/* Fair Grounds Layout */}
              <svg width="100%" height="100%" viewBox="0 0 800 350">
                {/* Background */}
                <rect width="800" height="350" fill="#e8f5e8" stroke="#ccc" strokeWidth="2" rx="10" />
                
                {/* Roads */}
                <path d="M 0 175 L 800 175" stroke="#666" strokeWidth="4" />
                <path d="M 400 0 L 400 350" stroke="#666" strokeWidth="4" />
                
                {/* Zone Rectangles with Heat Colors */}
                <g>
                  {/* Main Stage - Top Center */}
                  <rect x="300" y="50" width="200" height="100" fill="#ff1744" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="400" y="90" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Main Stage</text>
                  <text x="400" y="110" textAnchor="middle" fill="#fff" fontSize="10">2500 people</text>
                  
                  {/* Ferris Wheel - Top Right */}
                  <circle cx="650" cy="80" r="60" fill="#ff5722" fillOpacity="0.7" stroke="#000" strokeWidth="1" />
                  <text x="650" y="75" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Ferris Wheel</text>
                  <text x="650" y="90" textAnchor="middle" fill="#fff" fontSize="9">850 people</text>
                  
                  {/* Food Court - Bottom Left */}
                  <rect x="50" y="200" width="150" height="120" fill="#ff9800" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="125" y="250" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">Food Court</text>
                  <text x="125" y="270" textAnchor="middle" fill="#fff" fontSize="9">1200 people</text>
                  
                  {/* Beer Garden - Bottom Right */}
                  <rect x="550" y="220" width="200" height="100" fill="#ff5722" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="650" y="260" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">Beer Garden</text>
                  <text x="650" y="280" textAnchor="middle" fill="#fff" fontSize="9">600 people</text>
                  
                  {/* Carnival Games - Middle Left */}
                  <rect x="80" y="90" width="120" height="70" fill="#ffc107" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="140" y="120" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">Carnival Games</text>
                  <text x="140" y="135" textAnchor="middle" fill="#000" fontSize="9">680 people</text>
                  
                  {/* Kiddie Rides - Middle Right */}
                  <rect x="550" y="120" width="120" height="60" fill="#ffeb3b" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="610" y="145" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">Kiddie Rides</text>
                  <text x="610" y="160" textAnchor="middle" fill="#000" fontSize="9">280 people</text>
                  
                  {/* Petting Zoo - Top Left */}
                  <rect x="50" y="20" width="120" height="60" fill="#8bc34a" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="110" y="45" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">Petting Zoo</text>
                  <text x="110" y="60" textAnchor="middle" fill="#000" fontSize="9">320 people</text>
                  
                  {/* South Entrance - Bottom Center */}
                  <rect x="350" y="320" width="100" height="25" fill="#ff9800" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="400" y="337" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">South Entrance</text>
                  
                  {/* Medical Tent - Center */}
                  <rect x="250" y="180" width="60" height="40" fill="#4caf50" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="280" y="195" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">Medical</text>
                  <text x="280" y="208" textAnchor="middle" fill="#000" fontSize="8">25 people</text>
                  
                  {/* North Parking - Top */}
                  <rect x="220" y="5" width="60" height="30" fill="#4caf50" fillOpacity="0.7" stroke="#000" strokeWidth="1" rx="5" />
                  <text x="250" y="25" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">N. Parking</text>
                </g>
                
                {/* Legend */}
                <g transform="translate(20, 280)">
                  <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#333">Population Density</text>
                  <rect x="0" y="10" width="15" height="10" fill="#4caf50" />
                  <text x="20" y="19" fontSize="8" fill="#333">Low (&lt;50%)</text>
                  <rect x="80" y="10" width="15" height="10" fill="#ffeb3b" />
                  <text x="100" y="19" fontSize="8" fill="#333">Medium (50-70%)</text>
                  <rect x="0" y="25" width="15" height="10" fill="#ff9800" />
                  <text x="20" y="34" fontSize="8" fill="#333">High (70-85%)</text>
                  <rect x="80" y="25" width="15" height="10" fill="#ff1744" />
                  <text x="100" y="34" fontSize="8" fill="#333">Critical (&gt;85%)</text>
                </g>
              </svg>
            </Paper>
          </Grid>

          {/* Zone Statistics */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: 400, overflow: 'auto' }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Zone Status
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Attendees: <strong>{totalPeople.toLocaleString()}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Average Density: <strong>{averageDensity}%</strong>
                </Typography>
              </Box>

              <List dense>
                {zones.map((zone) => (
                  <ListItem key={zone.id} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {getZoneIcon(zone.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {zone.name}
                          </Typography>
                          <Chip
                            label={`${zone.density}%`}
                            size="small"
                            sx={{
                              backgroundColor: zone.color,
                              color: zone.density > 70 ? '#fff' : '#000',
                              fontWeight: 'bold',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption">
                            {zone.people} people
                          </Typography>
                          <Chip
                            label={zone.risk.toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: getRiskColor(zone.risk),
                              color: getRiskColor(zone.risk),
                              fontSize: '0.6rem',
                              height: 16
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FairgroundsHeatmap;