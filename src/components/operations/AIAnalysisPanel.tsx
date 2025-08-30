import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Divider,
  Button,
  Collapse,
  IconButton,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Psychology as AIIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Speed as MetricsIcon,
  Timeline as AnalyticsIcon,
  Visibility as MonitorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  People as TeamIcon,
  LocalHospital as MedicalIcon,
  FireTruck as FireIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

interface AIInsight {
  id: string;
  category: 'tactical' | 'medical' | 'logistics' | 'communication' | 'safety' | 'predictive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  confidence: number;
  recommendations: string[];
  timestamp: Date;
  source: string[];
  impactAssessment: string;
}

interface OperationalMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

const AIAnalysisPanel: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<OperationalMetric[]>([]);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const initialInsights: AIInsight[] = [
    {
      id: '1',
      category: 'tactical',
      priority: 'critical',
      title: 'Resource Allocation Optimization',
      description: 'Analysis indicates suboptimal team positioning for current incident spread. CERT-05 shows emergency status requiring immediate support.',
      confidence: 92,
      recommendations: [
        'Redirect CERT-06 and CERT-07 to support CERT-05 emergency situation',
        'Establish backup communication relay at grid reference 38.5815, -121.4945',
        'Deploy additional medical supplies to building C staging area'
      ],
      timestamp: new Date(Date.now() - 120000),
      source: ['Meshtastic Network', 'Team Positions', 'Incident Reports'],
      impactAssessment: 'High - Could reduce response time by 40% and improve team safety'
    },
    {
      id: '2',
      category: 'medical',
      priority: 'high',
      title: 'Triage Pattern Analysis',
      description: 'Medical telemetry shows increasing stress indicators across multiple team members. Ambient temperature and exertion levels trending upward.',
      confidence: 87,
      recommendations: [
        'Implement mandatory 15-minute rest cycles for all active personnel',
        'Increase water supply distribution frequency',
        'Monitor CERT-05 closely - battery at 28% with elevated stress indicators'
      ],
      timestamp: new Date(Date.now() - 180000),
      source: ['Environmental Sensors', 'Biometric Data', 'Activity Logs'],
      impactAssessment: 'Medium - Prevents potential heat-related incidents and maintains operational effectiveness'
    },
    {
      id: '3',
      category: 'predictive',
      priority: 'high',
      title: 'Incident Escalation Probability',
      description: 'Current weather patterns and structural assessment data indicate 73% probability of incident escalation within next 30 minutes.',
      confidence: 84,
      recommendations: [
        'Pre-position additional resources at 0.5km radius from incident center',
        'Activate mutual aid agreements with adjacent jurisdictions',
        'Prepare evacuation routes for wider area if needed'
      ],
      timestamp: new Date(Date.now() - 60000),
      source: ['Weather Data', 'Structural Analysis', 'Historical Patterns'],
      impactAssessment: 'High - Early positioning could reduce escalation response time by 60%'
    },
    {
      id: '4',
      category: 'communication',
      priority: 'medium',
      title: 'Network Performance Optimization',
      description: 'Meshtastic network showing signal degradation in grid sectors 2-4. Message delivery success rate decreased to 89%.',
      confidence: 91,
      recommendations: [
        'Deploy portable repeater at elevation point 38.5825, -121.4950',
        'Adjust transmission power on nodes CERT-04 and CERT-08',
        'Implement mesh healing protocol for improved redundancy'
      ],
      timestamp: new Date(Date.now() - 240000),
      source: ['Network Telemetry', 'Signal Analysis', 'Message Logs'],
      impactAssessment: 'Medium - Improves communication reliability by 25%'
    },
    {
      id: '5',
      category: 'logistics',
      priority: 'medium',
      title: 'Supply Chain Efficiency',
      description: 'Equipment utilization analysis shows 78% efficiency. Medical supplies at 60% capacity with uneven distribution.',
      confidence: 79,
      recommendations: [
        'Redistribute trauma kits from staging area A to area C (higher demand)',
        'Request additional oxygen units for extended operations',
        'Implement real-time inventory tracking system'
      ],
      timestamp: new Date(Date.now() - 300000),
      source: ['Inventory Systems', 'Usage Patterns', 'Team Reports'],
      impactAssessment: 'Low-Medium - Optimizes resource utilization and reduces waste'
    },
    {
      id: '6',
      category: 'safety',
      priority: 'critical',
      title: 'Environmental Hazard Detection',
      description: 'Atmospheric sensors detecting elevated CO levels in sector 3. Structural integrity compromised in building C northeast section.',
      confidence: 96,
      recommendations: [
        'IMMEDIATE: Evacuate all personnel from building C northeast quadrant',
        'Deploy hazmat monitoring equipment to sector 3',
        'Establish safe corridor for civilian evacuation',
        'Require full respiratory protection for all teams in affected areas'
      ],
      timestamp: new Date(Date.now() - 30000),
      source: ['Environmental Sensors', 'Structural Analysis', 'Air Quality Monitors'],
      impactAssessment: 'Critical - Prevents potential casualties and ensures team safety'
    }
  ];

  const initialMetrics: OperationalMetric[] = [
    { name: 'Response Time', current: 5.2, target: 4.0, unit: 'min', trend: 'down', status: 'warning' },
    { name: 'Team Efficiency', current: 78, target: 85, unit: '%', trend: 'up', status: 'warning' },
    { name: 'Communication Success', current: 89, target: 95, unit: '%', trend: 'down', status: 'warning' },
    { name: 'Resource Utilization', current: 67, target: 75, unit: '%', trend: 'stable', status: 'good' },
    { name: 'Safety Compliance', current: 94, target: 98, unit: '%', trend: 'up', status: 'good' },
    { name: 'Incident Resolution', current: 73, target: 80, unit: '%', trend: 'up', status: 'warning' }
  ];

  useEffect(() => {
    setInsights(initialInsights);
    setMetrics(initialMetrics);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Randomly update metrics
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        current: Math.max(0, Math.min(100, metric.current + (Math.random() - 0.5) * 5)),
        trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : metric.trend
      })));

      // Occasionally add new insights
      if (Math.random() > 0.8) {
        const newInsight: AIInsight = {
          id: Date.now().toString(),
          category: ['tactical', 'medical', 'logistics', 'communication', 'safety'][Math.floor(Math.random() * 5)] as any,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          title: 'Real-time Analysis Update',
          description: 'New patterns detected in operational data requiring attention.',
          confidence: 70 + Math.random() * 25,
          recommendations: ['Review current protocols', 'Adjust resource allocation'],
          timestamp: new Date(),
          source: ['AI Analysis Engine'],
          impactAssessment: 'Variable based on response implementation'
        };
        
        setInsights(prev => [newInsight, ...prev.slice(0, 5)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastUpdate(new Date());
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tactical': return <AssessmentIcon />;
      case 'medical': return <MedicalIcon />;
      case 'logistics': return <FireIcon />;
      case 'communication': return <MonitorIcon />;
      case 'safety': return <WarningIcon />;
      case 'predictive': return <AnalyticsIcon />;
      default: return <InfoIcon />;
    }
  };

  const getMetricIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon color="success" />;
      case 'down': return <TrendingDownIcon color="error" />;
      default: return <MetricsIcon color="info" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'critical': return <ErrorIcon color="error" />;
      default: return <InfoIcon />;
    }
  };

  const criticalInsights = insights.filter(i => i.priority === 'critical');
  const highInsights = insights.filter(i => i.priority === 'high');
  const otherInsights = insights.filter(i => !['critical', 'high'].includes(i.priority));

  return (
    <Box sx={{ height: 600, overflow: 'auto' }}>
      {/* AI Analysis Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <AIIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">
              AI Tactical Analysis
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefreshAnalysis}
          disabled={isAnalyzing}
          size="small"
        >
          {isAnalyzing ? 'Analyzing...' : 'Refresh'}
        </Button>
      </Box>

      {/* Critical Alerts */}
      {criticalInsights.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Critical Tactical Alerts ({criticalInsights.length})</AlertTitle>
          Immediate command attention required for operational safety and efficiency.
        </Alert>
      )}

      {/* Performance Metrics Overview */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MetricsIcon color="primary" />
            Real-Time Operational Metrics
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            {metrics.map((metric, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {metric.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getMetricIcon(metric.trend)}
                    {getStatusIcon(metric.status)}
                  </Box>
                </Box>
                <Typography variant="h6" color={metric.status === 'good' ? 'success.main' : metric.status === 'warning' ? 'warning.main' : 'error.main'}>
                  {metric.current.toFixed(1)}{metric.unit}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(metric.current / metric.target) * 100}
                  color={metric.status === 'good' ? 'success' : metric.status === 'warning' ? 'warning' : 'error'}
                  sx={{ mt: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Target: {metric.target}{metric.unit}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon color="primary" />
        AI-Generated Insights
      </Typography>

      {/* Critical Insights */}
      {criticalInsights.map((insight) => (
        <Card key={insight.id} sx={{ mb: 1, border: '2px solid', borderColor: 'error.main', bgcolor: 'error.50' }}>
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getCategoryIcon(insight.category)}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {insight.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip 
                      label={`${insight.priority.toUpperCase()} PRIORITY`}
                      color={getPriorityColor(insight.priority) as any}
                      size="small"
                    />
                    <Chip 
                      label={`${insight.confidence}% confidence`}
                      variant="outlined"
                      size="small"
                    />
                    <Chip 
                      label={insight.category}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
              <IconButton 
                size="small"
                onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
              >
                {expandedInsight === insight.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Typography variant="body2" gutterBottom>
              {insight.description}
            </Typography>

            <Collapse in={expandedInsight === insight.id}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  📋 Recommended Actions:
                </Typography>
                <List dense>
                  {insight.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={rec}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  📊 Impact Assessment: {insight.impactAssessment}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" display="block">
                  📡 Data Sources: {insight.source.join(', ')}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" display="block">
                  🕒 Generated: {insight.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      {/* High Priority Insights */}
      {highInsights.map((insight) => (
        <Card key={insight.id} sx={{ mb: 1, border: '1px solid', borderColor: 'warning.main' }}>
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getCategoryIcon(insight.category)}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {insight.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip 
                      label={insight.priority.toUpperCase()}
                      color={getPriorityColor(insight.priority) as any}
                      size="small"
                    />
                    <Chip 
                      label={`${insight.confidence}% confidence`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
              <IconButton 
                size="small"
                onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
              >
                {expandedInsight === insight.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Typography variant="body2" gutterBottom>
              {insight.description}
            </Typography>

            <Collapse in={expandedInsight === insight.id}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recommendations:
                </Typography>
                <List dense>
                  {insight.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <InfoIcon fontSize="small" color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={rec}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      {/* Other Insights */}
      {otherInsights.map((insight) => (
        <Card key={insight.id} sx={{ mb: 1 }}>
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getCategoryIcon(insight.category)}
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {insight.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {insight.category} • {insight.confidence}% confidence
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={insight.priority}
                color={getPriorityColor(insight.priority) as any}
                size="small"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      ))}

      {isAnalyzing && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      )}
    </Box>
  );
};

export default AIAnalysisPanel;