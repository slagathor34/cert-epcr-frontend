import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  RadioButtonChecked as ActiveIcon,
  Battery3Bar as BatteryIcon,
  Thermostat as TempIcon,
  Speed as AltitudeIcon,
  Visibility as VisibilityIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';

interface TeamMember {
  id: string;
  name: string;
  callsign: string;
  position: {
    lat: number;
    lng: number;
    altitude: number;
  };
  battery: number;
  temperature: number;
  lastSeen: string;
  status: 'active' | 'idle' | 'emergency' | 'offline';
  role: string;
}

interface IncidentLocation {
  id: string;
  type: string;
  position: {
    lat: number;
    lng: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

const TacticalMap: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [zoomLevel, setZoomLevel] = useState(15);

  // Simulated team positions around Sacramento area
  const teamMembers: TeamMember[] = [
    {
      id: 'cert-001',
      name: 'Lisa Walda',
      callsign: 'CERT-01',
      position: { lat: 38.5816, lng: -121.4944, altitude: 56 },
      battery: 85,
      temperature: 72,
      lastSeen: '2 min ago',
      status: 'active',
      role: 'Team Leader'
    },
    {
      id: 'cert-002',
      name: 'Scott Green',
      callsign: 'CERT-02',
      position: { lat: 38.5825, lng: -121.4955, altitude: 58 },
      battery: 92,
      temperature: 71,
      lastSeen: '1 min ago',
      status: 'active',
      role: 'Medical Officer'
    },
    {
      id: 'cert-003',
      name: 'Maria Rodriguez',
      callsign: 'CERT-03',
      position: { lat: 38.5805, lng: -121.4930, altitude: 54 },
      battery: 67,
      temperature: 73,
      lastSeen: '3 min ago',
      status: 'active',
      role: 'Communications'
    },
    {
      id: 'cert-004',
      name: 'David Chen',
      callsign: 'CERT-04',
      position: { lat: 38.5830, lng: -121.4960, altitude: 59 },
      battery: 44,
      temperature: 70,
      lastSeen: '1 min ago',
      status: 'idle',
      role: 'Logistics'
    },
    {
      id: 'cert-005',
      name: 'Jennifer Thompson',
      callsign: 'CERT-05',
      position: { lat: 38.5810, lng: -121.4940, altitude: 55 },
      battery: 28,
      temperature: 74,
      lastSeen: '30 sec ago',
      status: 'emergency',
      role: 'Search & Rescue'
    },
    {
      id: 'cert-006',
      name: 'Kevin Jackson',
      callsign: 'CERT-06',
      position: { lat: 38.5820, lng: -121.4950, altitude: 57 },
      battery: 78,
      temperature: 69,
      lastSeen: '2 min ago',
      status: 'active',
      role: 'Safety Officer'
    }
  ];

  const incidentLocations: IncidentLocation[] = [
    {
      id: 'inc-001',
      type: 'Structure Fire',
      position: { lat: 38.5815, lng: -121.4945 },
      severity: 'critical',
      description: '1234 Oak Street - Working structure fire, multiple units responding'
    },
    {
      id: 'inc-002',
      type: 'Medical Emergency',
      position: { lat: 38.5822, lng: -121.4952 },
      severity: 'high',
      description: '5678 Pine Ave - Cardiac arrest, CPR in progress'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'idle': return '#ff9800';
      case 'emergency': return '#f44336';
      case 'offline': return '#9e9e9e';
      default: return '#2196f3';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return '#4caf50';
    if (battery > 30) return '#ff9800';
    return '#f44336';
  };

  // Simulated map area (Sacramento downtown area)
  const mapBounds = {
    north: 38.5850,
    south: 38.5780,
    east: -121.4900,
    west: -121.5000
  };

  const getRelativePosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
    const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <Box sx={{ display: 'flex', height: 600, gap: 2 }}>
      {/* Main Map Area */}
      <Paper 
        sx={{ 
          flex: 1,
          position: 'relative',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 20%, #10b981 80%, #059669 100%)',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Map Controls */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)' }} onClick={() => setZoomLevel(z => Math.min(z + 1, 20))}>
            <ZoomInIcon />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)' }} onClick={() => setZoomLevel(z => Math.max(z - 1, 10))}>
            <ZoomOutIcon />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
            <CenterIcon />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
            <LayersIcon />
          </IconButton>
        </Box>

        {/* Map Legend */}
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Typography variant="subtitle2" gutterBottom>
                Tactical Situational Display
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sacramento County - Zoom Level: {zoomLevel}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
                  <Typography variant="caption">Active</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800' }} />
                  <Typography variant="caption">Idle</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336' }} />
                  <Typography variant="caption">Emergency</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Simulated Map Grid */}
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
          {[...Array(20)].map((_, i) => (
            <Box 
              key={`h-${i}`}
              sx={{ 
                position: 'absolute', 
                left: 0, 
                right: 0, 
                top: `${i * 5}%`, 
                height: 1, 
                bgcolor: 'rgba(255,255,255,0.2)' 
              }} 
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <Box 
              key={`v-${i}`}
              sx={{ 
                position: 'absolute', 
                top: 0, 
                bottom: 0, 
                left: `${i * 5}%`, 
                width: 1, 
                bgcolor: 'rgba(255,255,255,0.2)' 
              }} 
            />
          ))}
        </Box>

        {/* Team Member Positions */}
        {teamMembers.map((member) => {
          const pos = getRelativePosition(member.position.lat, member.position.lng);
          return (
            <Tooltip 
              key={member.id} 
              title={`${member.name} (${member.callsign}) - ${member.status.toUpperCase()}`}
              arrow
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 5,
                }}
                onClick={() => setSelectedMember(member)}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: getStatusColor(member.status),
                    border: selectedMember?.id === member.id ? '3px solid #fff' : '2px solid rgba(255,255,255,0.7)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                >
                  {member.callsign.split('-')[1]}
                </Avatar>
                {member.status === 'emergency' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: '#f44336',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.7, transform: 'scale(1.2)' },
                        '100%': { opacity: 1, transform: 'scale(1)' }
                      }
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          );
        })}

        {/* Incident Locations */}
        {incidentLocations.map((incident) => {
          const pos = getRelativePosition(incident.position.lat, incident.position.lng);
          return (
            <Tooltip 
              key={incident.id} 
              title={`${incident.type} - ${incident.description}`}
              arrow
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 4,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: getSeverityColor(incident.severity),
                    border: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    animation: incident.severity === 'critical' ? 'pulse 1.5s infinite' : 'none',
                  }}
                >
                  <LocationIcon sx={{ color: 'white', fontSize: 16 }} />
                </Box>
              </Box>
            </Tooltip>
          );
        })}
      </Paper>

      {/* Team Member Details Panel */}
      <Paper sx={{ width: 300, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Team Status
        </Typography>
        
        {selectedMember && (
          <Card sx={{ mb: 2, bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: getStatusColor(selectedMember.status) }}>
                  <PersonIcon sx={{ fontSize: 14 }} />
                </Avatar>
                <Typography variant="subtitle2">
                  {selectedMember.name}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                {selectedMember.callsign} - {selectedMember.role}
              </Typography>
              
              <List dense sx={{ mt: 1 }}>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <LocationIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${selectedMember.position.lat.toFixed(4)}, ${selectedMember.position.lng.toFixed(4)}`}
                    secondary={`Alt: ${selectedMember.position.altitude}ft`}
                    primaryTypographyProps={{ variant: 'caption' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <BatteryIcon fontSize="small" sx={{ color: getBatteryColor(selectedMember.battery) }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${selectedMember.battery}%`}
                    secondary="Battery"
                    primaryTypographyProps={{ variant: 'caption' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <TempIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${selectedMember.temperature}°F`}
                    secondary="Temperature"
                    primaryTypographyProps={{ variant: 'caption' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <ActiveIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={selectedMember.lastSeen}
                    secondary="Last Seen"
                    primaryTypographyProps={{ variant: 'caption' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              </List>
              
              <Chip 
                label={selectedMember.status.toUpperCase()}
                size="small"
                sx={{ mt: 1, bgcolor: getStatusColor(selectedMember.status), color: 'white' }}
              />
            </CardContent>
          </Card>
        )}

        <Typography variant="subtitle2" gutterBottom>
          All Team Members
        </Typography>
        
        <List dense>
          {teamMembers.map((member) => (
            <React.Fragment key={member.id}>
              <ListItem 
                button 
                onClick={() => setSelectedMember(member)}
                selected={selectedMember?.id === member.id}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: getStatusColor(member.status) }}>
                    <PersonIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={member.name}
                  secondary={`${member.callsign} - ${member.status}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BatteryIcon 
                    fontSize="small" 
                    sx={{ color: getBatteryColor(member.battery) }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    {member.battery}%
                  </Typography>
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TacticalMap;