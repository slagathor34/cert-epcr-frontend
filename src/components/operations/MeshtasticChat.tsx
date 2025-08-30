import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Badge,
  Divider,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  RadioButtonChecked as RadioIcon,
  LocationOn as LocationIcon,
  Thermostat as TempIcon,
  Speed as SpeedIcon,
  Battery3Bar as BatteryIcon,
  SignalCellular4Bar as SignalIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface MeshtasticMessage {
  id: string;
  from: string;
  fromId: string;
  message: string;
  timestamp: Date;
  messageType: 'text' | 'position' | 'telemetry' | 'nodeinfo' | 'system';
  channel: string;
  snr: number;
  rssi: number;
  hopLimit: number;
  position?: {
    lat: number;
    lng: number;
    altitude: number;
  };
  telemetry?: {
    batteryLevel: number;
    voltage: number;
    temperature: number;
    relativeHumidity: number;
    barometricPressure: number;
  };
}

interface MeshtasticNode {
  id: string;
  shortName: string;
  longName: string;
  macaddr: string;
  lastSeen: Date;
  snr: number;
  rssi: number;
  batteryLevel?: number;
  position?: {
    lat: number;
    lng: number;
    altitude: number;
  };
  status: 'online' | 'away' | 'offline';
}

const MeshtasticChat: React.FC = () => {
  const [messages, setMessages] = useState<MeshtasticMessage[]>([]);
  const [nodes, setNodes] = useState<MeshtasticNode[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('LongFast');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = ['LongFast', 'MediumSlow', 'LongSlow', 'Emergency'];

  // Simulated initial messages and telemetry data
  const initialMessages: MeshtasticMessage[] = [
    {
      id: '1',
      from: 'CERT-01',
      fromId: '!a1b2c3d4',
      message: 'Team Alpha deploying to staging area. ETA 5 minutes.',
      timestamp: new Date(Date.now() - 600000),
      messageType: 'text',
      channel: 'LongFast',
      snr: 8.5,
      rssi: -65,
      hopLimit: 3
    },
    {
      id: '2',
      from: 'CERT-02',
      fromId: '!e5f6g7h8',
      message: 'Position update',
      timestamp: new Date(Date.now() - 580000),
      messageType: 'position',
      channel: 'LongFast',
      snr: 7.2,
      rssi: -72,
      hopLimit: 3,
      position: {
        lat: 38.5816,
        lng: -121.4944,
        altitude: 56
      }
    },
    {
      id: '3',
      from: 'CERT-03',
      fromId: '!i9j0k1l2',
      message: 'Medical supplies inventory: 15 trauma kits, 8 oxygen units, 12 stretchers available',
      timestamp: new Date(Date.now() - 540000),
      messageType: 'text',
      channel: 'LongFast',
      snr: 9.1,
      rssi: -58,
      hopLimit: 3
    },
    {
      id: '4',
      from: 'CERT-04',
      fromId: '!m3n4o5p6',
      message: 'Telemetry data',
      timestamp: new Date(Date.now() - 480000),
      messageType: 'telemetry',
      channel: 'LongFast',
      snr: 6.8,
      rssi: -78,
      hopLimit: 3,
      telemetry: {
        batteryLevel: 67,
        voltage: 3.95,
        temperature: 24.5,
        relativeHumidity: 45,
        barometricPressure: 1013.2
      }
    },
    {
      id: '5',
      from: 'CERT-05',
      fromId: '!q7r8s9t0',
      message: 'PRIORITY: Located 2 civilians in need of assistance at building C, 2nd floor. Requesting additional medical support.',
      timestamp: new Date(Date.now() - 420000),
      messageType: 'text',
      channel: 'Emergency',
      snr: 5.4,
      rssi: -85,
      hopLimit: 3
    },
    {
      id: '6',
      from: 'CERT-06',
      fromId: '!u1v2w3x4',
      message: 'Responding to CERT-05 location. Medical team en route. ETA 3 minutes.',
      timestamp: new Date(Date.now() - 360000),
      messageType: 'text',
      channel: 'Emergency',
      snr: 8.9,
      rssi: -62,
      hopLimit: 3
    },
    {
      id: '7',
      from: 'CERT-01',
      fromId: '!a1b2c3d4',
      message: 'Command, we have visual confirmation of structure damage on north side. Recommend approach from south entrance.',
      timestamp: new Date(Date.now() - 300000),
      messageType: 'text',
      channel: 'LongFast',
      snr: 7.8,
      rssi: -68,
      hopLimit: 3
    },
    {
      id: '8',
      from: 'CERT-07',
      fromId: '!y5z6a7b8',
      message: 'Communication relay established. All teams report status.',
      timestamp: new Date(Date.now() - 240000),
      messageType: 'text',
      channel: 'LongFast',
      snr: 9.5,
      rssi: -55,
      hopLimit: 3
    },
    {
      id: '9',
      from: 'CERT-02',
      fromId: '!e5f6g7h8',
      message: 'Team Bravo status: 4 members operational, 1 minor injury (treated), continuing search pattern grid 2.',
      timestamp: new Date(Date.now() - 180000),
      messageType: 'text',
      channel: 'LongFast',
      snr: 6.9,
      rssi: -74,
      hopLimit: 3
    },
    {
      id: '10',
      from: 'CERT-05',
      fromId: '!q7r8s9t0',
      message: 'Civilians extracted successfully. Moving to triage area. Injuries: 1 smoke inhalation, 1 minor lacerations.',
      timestamp: new Date(Date.now() - 120000),
      messageType: 'text',
      channel: 'Emergency',
      snr: 7.5,
      rssi: -69,
      hopLimit: 3
    },
    {
      id: '11',
      from: 'CERT-08',
      fromId: '!c9d0e1f2',
      message: 'Weather update: Wind shifting to NW at 8mph. Temperature 72°F. Visibility good.',
      timestamp: new Date(Date.now() - 60000),
      messageType: 'text',
      channel: 'LongFast',
      snr: 8.2,
      rssi: -66,
      hopLimit: 3
    }
  ];

  const initialNodes: MeshtasticNode[] = [
    {
      id: '!a1b2c3d4',
      shortName: 'CERT-01',
      longName: 'CERT Team Leader',
      macaddr: '24:6f:28:a1:b2:c3',
      lastSeen: new Date(Date.now() - 30000),
      snr: 8.5,
      rssi: -65,
      batteryLevel: 85,
      position: { lat: 38.5816, lng: -121.4944, altitude: 56 },
      status: 'online'
    },
    {
      id: '!e5f6g7h8',
      shortName: 'CERT-02',
      longName: 'Medical Officer',
      macaddr: '24:6f:28:e5:f6:g7',
      lastSeen: new Date(Date.now() - 45000),
      snr: 7.2,
      rssi: -72,
      batteryLevel: 92,
      position: { lat: 38.5825, lng: -121.4955, altitude: 58 },
      status: 'online'
    },
    {
      id: '!i9j0k1l2',
      shortName: 'CERT-03',
      longName: 'Communications',
      macaddr: '24:6f:28:i9:j0:k1',
      lastSeen: new Date(Date.now() - 20000),
      snr: 9.1,
      rssi: -58,
      batteryLevel: 78,
      position: { lat: 38.5805, lng: -121.4930, altitude: 54 },
      status: 'online'
    },
    {
      id: '!m3n4o5p6',
      shortName: 'CERT-04',
      longName: 'Logistics Officer',
      macaddr: '24:6f:28:m3:n4:o5',
      lastSeen: new Date(Date.now() - 60000),
      snr: 6.8,
      rssi: -78,
      batteryLevel: 67,
      position: { lat: 38.5830, lng: -121.4960, altitude: 59 },
      status: 'online'
    },
    {
      id: '!q7r8s9t0',
      shortName: 'CERT-05',
      longName: 'Search & Rescue',
      macaddr: '24:6f:28:q7:r8:s9',
      lastSeen: new Date(Date.now() - 15000),
      snr: 7.5,
      rssi: -69,
      batteryLevel: 28,
      position: { lat: 38.5810, lng: -121.4940, altitude: 55 },
      status: 'online'
    },
    {
      id: '!u1v2w3x4',
      shortName: 'CERT-06',
      longName: 'Safety Officer',
      macaddr: '24:6f:28:u1:v2:w3',
      lastSeen: new Date(Date.now() - 25000),
      snr: 8.9,
      rssi: -62,
      batteryLevel: 91,
      position: { lat: 38.5820, lng: -121.4950, altitude: 57 },
      status: 'online'
    },
    {
      id: '!y5z6a7b8',
      shortName: 'CERT-07',
      longName: 'Communications Relay',
      macaddr: '24:6f:28:y5:z6:a7',
      lastSeen: new Date(Date.now() - 35000),
      snr: 9.5,
      rssi: -55,
      batteryLevel: 88,
      status: 'online'
    },
    {
      id: '!c9d0e1f2',
      shortName: 'CERT-08',
      longName: 'Weather Station',
      macaddr: '24:6f:28:c9:d0:e1',
      lastSeen: new Date(Date.now() - 10000),
      snr: 8.2,
      rssi: -66,
      batteryLevel: 95,
      status: 'online'
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
    setNodes(initialNodes);

    // Simulate periodic telemetry updates
    const interval = setInterval(() => {
      const randomNode = initialNodes[Math.floor(Math.random() * initialNodes.length)];
      const newMessage: MeshtasticMessage = {
        id: Date.now().toString(),
        from: randomNode.shortName,
        fromId: randomNode.id,
        message: 'Telemetry update',
        timestamp: new Date(),
        messageType: 'telemetry',
        channel: 'LongFast',
        snr: Math.random() * 10,
        rssi: -50 - Math.random() * 40,
        hopLimit: 3,
        telemetry: {
          batteryLevel: Math.max(20, Math.min(100, randomNode.batteryLevel! + (Math.random() - 0.5) * 5)),
          voltage: 3.3 + Math.random() * 0.8,
          temperature: 20 + Math.random() * 15,
          relativeHumidity: 30 + Math.random() * 40,
          barometricPressure: 1000 + Math.random() * 30
        }
      };

      setMessages(prev => [...prev, newMessage]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: MeshtasticMessage = {
        id: Date.now().toString(),
        from: 'Command',
        fromId: '!command01',
        message: currentMessage,
        timestamp: new Date(),
        messageType: 'text',
        channel: selectedChannel,
        snr: 10.0,
        rssi: -45,
        hopLimit: 3
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -60) return 'excellent';
    if (rssi > -70) return 'good';
    if (rssi > -80) return 'fair';
    return 'poor';
  };

  const getSignalColor = (rssi: number) => {
    if (rssi > -60) return '#4caf50';
    if (rssi > -70) return '#8bc34a';
    if (rssi > -80) return '#ff9800';
    return '#f44336';
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'position': return <LocationIcon fontSize="small" />;
      case 'telemetry': return <SpeedIcon fontSize="small" />;
      case 'nodeinfo': return <InfoIcon fontSize="small" />;
      case 'system': return <WarningIcon fontSize="small" />;
      default: return <PersonIcon fontSize="small" />;
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return '#4caf50';
    if (battery > 30) return '#ff9800';
    return '#f44336';
  };

  const filteredMessages = messages.filter(msg => msg.channel === selectedChannel);

  return (
    <Box sx={{ display: 'flex', height: 500, gap: 2 }}>
      {/* Chat Area */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: 500 }}>
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          <RadioIcon color="primary" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              Meshtastic Network Communications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Channel: {selectedChannel} • {nodes.filter(n => n.status === 'online').length} nodes online
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {channels.map(channel => (
              <Chip
                key={channel}
                label={channel}
                size="small"
                color={selectedChannel === channel ? 'primary' : 'default'}
                onClick={() => setSelectedChannel(channel)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        {/* Messages List */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 1,
          minHeight: 0,
          maxHeight: 320,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}>
          <List dense>
            {filteredMessages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: message.from === 'Command' ? 'primary.main' : 'secondary.main' }}>
                      {getMessageIcon(message.messageType)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" component="span">
                          {message.from}
                        </Typography>
                        <Chip 
                          label={message.messageType} 
                          size="small" 
                          variant="outlined"
                          sx={{ height: 16, fontSize: '0.6rem' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(message.timestamp)}
                        </Typography>
                        <Tooltip title={`SNR: ${message.snr.toFixed(1)}dB, RSSI: ${message.rssi}dBm`}>
                          <SignalIcon 
                            fontSize="small" 
                            sx={{ color: getSignalColor(message.rssi) }}
                          />
                        </Tooltip>
                      </Box>
                    }
                    secondary={
                      <Box>
                        {message.messageType === 'text' && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {message.message}
                          </Typography>
                        )}
                        {message.messageType === 'position' && message.position && (
                          <Box sx={{ mt: 0.5, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="caption" display="block">
                              📍 Position Update
                            </Typography>
                            <Typography variant="caption" display="block">
                              Lat: {message.position.lat.toFixed(6)}, Lng: {message.position.lng.toFixed(6)}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Altitude: {message.position.altitude}m
                            </Typography>
                          </Box>
                        )}
                        {message.messageType === 'telemetry' && message.telemetry && (
                          <Box sx={{ mt: 0.5, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="caption" display="block" gutterBottom>
                              📊 Telemetry Data
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              <Chip label={`🔋 ${message.telemetry.batteryLevel}%`} size="small" variant="outlined" />
                              <Chip label={`🌡️ ${message.telemetry.temperature.toFixed(1)}°C`} size="small" variant="outlined" />
                              <Chip label={`💧 ${message.telemetry.relativeHumidity.toFixed(0)}%`} size="small" variant="outlined" />
                              <Chip label={`🌬️ ${message.telemetry.barometricPressure.toFixed(1)}mb`} size="small" variant="outlined" />
                            </Box>
                          </Box>
                        )}
                        {message.channel === 'Emergency' && (
                          <Chip 
                            label="🚨 EMERGENCY" 
                            color="error" 
                            size="small" 
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
          <TextField
            fullWidth
            placeholder={`Send message to ${selectedChannel} channel...`}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Paper>

      {/* Node Status Panel */}
      <Paper sx={{ width: 280, p: 2, maxHeight: 500, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RadioIcon color="primary" />
          Network Status
        </Typography>

        <Card sx={{ mb: 2, bgcolor: 'success.50' }}>
          <CardContent sx={{ pb: '16px !important' }}>
            <Typography variant="subtitle2" gutterBottom>
              Network Health
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">Nodes Online:</Typography>
              <Typography variant="caption" fontWeight="bold">
                {nodes.filter(n => n.status === 'online').length}/{nodes.length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">Avg Signal:</Typography>
              <Typography variant="caption" fontWeight="bold">
                {(nodes.reduce((sum, n) => sum + n.rssi, 0) / nodes.length).toFixed(0)} dBm
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">Messages/Hour:</Typography>
              <Typography variant="caption" fontWeight="bold">
                47
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="subtitle2" gutterBottom>
          Connected Nodes
        </Typography>

        <List dense>
          {nodes.map((node) => (
            <React.Fragment key={node.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Badge 
                    badgeContent={node.status === 'online' ? '●' : '○'}
                    color={node.status === 'online' ? 'success' : 'default'}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                      {node.shortName.split('-')[1] || node.shortName.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {node.shortName}
                      </Typography>
                      {node.batteryLevel && (
                        <BatteryIcon 
                          fontSize="small" 
                          sx={{ color: getBatteryColor(node.batteryLevel) }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {node.longName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <SignalIcon 
                          fontSize="small" 
                          sx={{ color: getSignalColor(node.rssi) }}
                        />
                        <Typography variant="caption">
                          {node.rssi} dBm
                        </Typography>
                        {node.batteryLevel && (
                          <>
                            <Typography variant="caption">•</Typography>
                            <Typography variant="caption">
                              {node.batteryLevel}%
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Last: {Math.floor((Date.now() - node.lastSeen.getTime()) / 1000)}s ago
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MeshtasticChat;