import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  Button,
  ButtonGroup,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  Settings as SettingsIcon,
  RadioButtonChecked as TuneIcon,
  TuneOutlined as FilterIcon,
  GraphicEq as SpectrumIcon,
  WaterDrop as WaterfallIcon,
  SignalWifi4Bar as SignalIcon,
  Fullscreen as FullscreenIcon,
  Save as SaveIcon,
  FolderOpen as LoadIcon,
} from '@mui/icons-material';

interface FrequencyBand {
  name: string;
  start: number;
  end: number;
  color: string;
}

interface SignalPeak {
  frequency: number;
  strength: number;
  width: number;
  active: boolean;
  type: 'carrier' | 'burst' | 'sweep' | 'digital';
  animation?: {
    phase: number;
    speed: number;
    pattern: string;
  };
}

const SDRInterface: React.FC = () => {
  // SDR Control States
  const [isRunning, setIsRunning] = useState(false);
  const [centerFreq, setCenterFreq] = useState(462.5625); // MHz - CERT common frequency
  const [sampleRate, setSampleRate] = useState(2.048); // MHz
  const [gain, setGain] = useState(30); // dB
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [demodMode, setDemodMode] = useState('NFM');
  const [filterWidth, setFilterWidth] = useState(12.5); // kHz
  const [squelchLevel, setSquelchLevel] = useState(-60); // dBm
  const [waterfallSpeed, setWaterfallSpeed] = useState(5);
  const [agcEnabled, setAgcEnabled] = useState(true);
  
  // Display States
  const [spectrumData, setSpectrumData] = useState<number[]>([]);
  const [waterfallData, setWaterfallData] = useState<number[][]>([]);
  const [currentSignalStrength, setCurrentSignalStrength] = useState(-85);
  const [audioLevel, setAudioLevel] = useState(0);
  const [animationTime, setAnimationTime] = useState(0);
  const [demoMode, setDemoMode] = useState(true);
  
  // Canvas refs
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const waterfallCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Predefined frequency bands for emergency services
  const frequencyBands: FrequencyBand[] = [
    { name: 'CERT', start: 462.5, end: 462.7, color: '#4CAF50' },
    { name: 'Fire', start: 154.1, end: 154.4, color: '#FF5722' },
    { name: 'Medical', start: 155.3, end: 155.4, color: '#2196F3' },
    { name: 'Police', start: 453.0, end: 453.9, color: '#9C27B0' },
    { name: 'GMRS', start: 462.5, end: 462.7, color: '#FF9800' },
  ];

  // Enhanced signal peaks simulation with animations
  const [signalPeaks] = useState<SignalPeak[]>([
    { 
      frequency: 462.5625, 
      strength: -45, 
      width: 12.5, 
      active: true, 
      type: 'carrier',
      animation: { phase: 0, speed: 0.2, pattern: 'voice' }
    },
    { 
      frequency: 462.6125, 
      strength: -65, 
      width: 12.5, 
      active: false, 
      type: 'burst',
      animation: { phase: 0, speed: 0.1, pattern: 'digital' }
    },
    { 
      frequency: 462.6625, 
      strength: -78, 
      width: 12.5, 
      active: false, 
      type: 'digital',
      animation: { phase: 0, speed: 0.3, pattern: 'packet' }
    },
    { 
      frequency: 154.280, 
      strength: -55, 
      width: 25, 
      active: false, 
      type: 'carrier',
      animation: { phase: 0, speed: 0.15, pattern: 'dispatch' }
    },
    { 
      frequency: 155.340, 
      strength: -70, 
      width: 25, 
      active: false, 
      type: 'burst',
      animation: { phase: 0, speed: 0.25, pattern: 'medical' }
    },
    {
      frequency: 453.450,
      strength: -62,
      width: 25,
      active: false,
      type: 'sweep',
      animation: { phase: 0, speed: 0.4, pattern: 'patrol' }
    },
    {
      frequency: 462.550,
      strength: -85,
      width: 12.5,
      active: false,
      type: 'digital',
      animation: { phase: 0, speed: 0.6, pattern: 'telemetry' }
    }
  ]);

  // Generate realistic spectrum data with enhanced animations
  const generateSpectrumData = () => {
    const points = 512;
    const data: number[] = [];
    const noise_floor = -90;
    const time = animationTime;
    
    for (let i = 0; i < points; i++) {
      const freq = centerFreq - (sampleRate/2) + (i * sampleRate / points);
      let amplitude = noise_floor + (Math.random() * 8 - 4); // Base noise floor
      
      // Add atmospheric noise variations
      amplitude += Math.sin(time * 0.1 + freq * 100) * 2;
      
      // Add signal peaks with dynamic animations
      signalPeaks.forEach((peak, index) => {
        const freqDiff = Math.abs(freq - peak.frequency);
        if (freqDiff <= (peak.width / 1000) * 2) { // Extend range for animations
          
          let signalStrength = peak.strength;
          let animationFactor = 1;
          
          if (peak.animation && (demoMode || isRunning)) {
            const phase = time * peak.animation.speed + index * Math.PI / 3;
            
            switch (peak.type) {
              case 'carrier':
                // Voice activity simulation
                if (peak.animation.pattern === 'voice') {
                  animationFactor = 0.7 + 0.3 * Math.sin(phase) * Math.sin(phase * 3.7);
                  if (Math.sin(phase * 0.3) > 0.6) { // Periodic transmissions
                    animationFactor += 0.4 * (1 + Math.sin(phase * 12));
                  }
                } else if (peak.animation.pattern === 'dispatch') {
                  // Dispatch bursts
                  const burstPhase = Math.sin(phase * 0.2);
                  if (burstPhase > 0.3) {
                    animationFactor = 1.5 + 0.5 * Math.sin(phase * 8);
                  }
                }
                break;
                
              case 'burst':
                // Digital burst transmissions
                const burstTrigger = Math.sin(phase * 0.4);
                if (burstTrigger > 0.5) {
                  animationFactor = 2 + Math.random() * 0.5;
                  // Add digital artifacts
                  if (Math.random() > 0.7) {
                    signalStrength += 10 + Math.random() * 5;
                  }
                } else {
                  animationFactor = 0.1;
                }
                break;
                
              case 'sweep':
                // Frequency sweeping signals (like radar)
                const sweepFreq = peak.frequency + 0.1 * Math.sin(phase * 0.8);
                const sweepDiff = Math.abs(freq - sweepFreq);
                if (sweepDiff < peak.width / 1000) {
                  animationFactor = 1.5 + 0.5 * Math.cos(phase * 2);
                }
                break;
                
              case 'digital':
                // Digital modulation patterns
                const digitalPattern = Math.floor(phase * 4) % 4;
                animationFactor = digitalPattern === 0 ? 1.8 : (digitalPattern < 3 ? 1.2 : 0.3);
                // Add digital noise spikes
                if (Math.random() > 0.95) {
                  signalStrength += Math.random() * 15;
                }
                break;
            }
          }
          
          // Apply signal rolloff with animation
          const rolloff = Math.max(0, 1 - (freqDiff * 1000 * 2 / peak.width));
          const adjustedStrength = signalStrength * animationFactor;
          const finalAmplitude = adjustedStrength * rolloff + (Math.random() * 4 - 2);
          
          amplitude = Math.max(amplitude, finalAmplitude);
          
          // Update current signal strength if this is our tuned frequency
          if (Math.abs(freq - centerFreq) < 0.0001) {
            setCurrentSignalStrength(finalAmplitude);
            if (peak.active && isRunning && animationFactor > 0.5) {
              setAudioLevel(Math.min(100, Math.max(0, (animationFactor - 0.5) * 120)));
            }
          }
        }
      });
      
      // Add occasional propagation spikes
      if (Math.random() > 0.998) {
        amplitude += Math.random() * 20;
      }
      
      // Add band activity simulation
      if (demoMode || isRunning) {
        // Simulate band conditions
        const bandActivity = Math.sin(time * 0.05 + freq * 50) * 3;
        amplitude += bandActivity;
        
        // Add sporadic E skip simulation
        if (freq > 28 && freq < 52 && Math.random() > 0.999) {
          amplitude += 30 + Math.random() * 20;
        }
      }
    }
    
    return data;
  };

  // Draw spectrum analyzer
  const drawSpectrum = (canvas: HTMLCanvasElement, data: number[]) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (dB levels)
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines (frequency)
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw spectrum with enhanced visuals
    // Main spectrum line
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    data.forEach((amplitude, i) => {
      const x = (i / data.length) * width;
      const y = height - ((amplitude + 100) / 100 * height); // Convert dBm to pixel
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Add spectrum fill gradient
    ctx.fillStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    data.forEach((amplitude, i) => {
      const x = (i / data.length) * width;
      const y = height - ((amplitude + 100) / 100 * height);
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    
    // Draw peak markers for strong signals
    data.forEach((amplitude, i) => {
      if (amplitude > -50) { // Strong signal threshold
        const x = (i / data.length) * width;
        const y = height - ((amplitude + 100) / 100 * height);
        
        // Peak marker
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Peak line
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, height - 20);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Peak value label
        ctx.fillStyle = '#ff4444';
        ctx.font = '10px monospace';
        ctx.fillText(`${amplitude.toFixed(0)}`, x - 10, height - 25);
      }
    });
    
    // Draw frequency bands
    frequencyBands.forEach(band => {
      const startFreq = band.start;
      const endFreq = band.end;
      const centerFreqMHz = centerFreq;
      const spanMHz = sampleRate;
      
      if (startFreq >= (centerFreqMHz - spanMHz/2) && startFreq <= (centerFreqMHz + spanMHz/2)) {
        const startX = ((startFreq - (centerFreqMHz - spanMHz/2)) / spanMHz) * width;
        const endX = Math.min(width, ((endFreq - (centerFreqMHz - spanMHz/2)) / spanMHz) * width);
        
        ctx.fillStyle = band.color + '20';
        ctx.fillRect(startX, 0, Math.max(2, endX - startX), height);
        
        // Band label
        ctx.fillStyle = band.color;
        ctx.font = '12px monospace';
        ctx.fillText(band.name, startX + 5, 20);
      }
    });
    
    // Draw tuning indicator
    const tuneX = width / 2;
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tuneX, 0);
    ctx.lineTo(tuneX, height);
    ctx.stroke();
  };

  // Enhanced waterfall display with better color mapping
  const drawWaterfall = (canvas: HTMLCanvasElement, data: number[][]) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Scroll existing data up at variable speed
    const scrollSpeed = Math.max(1, Math.floor(waterfallSpeed / 2));
    const imageData = ctx.getImageData(0, 0, width, height - scrollSpeed);
    ctx.putImageData(imageData, 0, scrollSpeed);
    
    // Clear the new lines
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, scrollSpeed);
    
    // Draw new lines at top
    if (data.length > 0) {
      const latestLine = data[data.length - 1];
      
      for (let y = 0; y < scrollSpeed; y++) {
        for (let x = 0; x < width; x++) {
          const dataIndex = Math.floor((x / width) * latestLine.length);
          const amplitude = latestLine[dataIndex] || -100;
          
          // Enhanced color mapping with better dynamic range
          let normalized = Math.max(0, Math.min(1, (amplitude + 100) / 50));
          
          // Apply gamma correction for better visibility
          normalized = Math.pow(normalized, 0.8);
          
          let r, g, b;
          
          if (normalized < 0.2) {
            // Very weak signals - dark blue to blue
            r = 0;
            g = 0;
            b = Math.floor(normalized * 5 * 128);
          } else if (normalized < 0.4) {
            // Weak signals - blue to cyan
            r = 0;
            g = Math.floor((normalized - 0.2) * 5 * 255);
            b = 128 + Math.floor((normalized - 0.2) * 5 * 127);
          } else if (normalized < 0.6) {
            // Medium signals - cyan to green
            r = 0;
            g = 255;
            b = 255 - Math.floor((normalized - 0.4) * 5 * 255);
          } else if (normalized < 0.8) {
            // Strong signals - green to yellow
            r = Math.floor((normalized - 0.6) * 5 * 255);
            g = 255;
            b = 0;
          } else {
            // Very strong signals - yellow to red
            r = 255;
            g = 255 - Math.floor((normalized - 0.8) * 5 * 255);
            b = 0;
          }
          
          // Add some sparkle to strong signals
          if (amplitude > -40 && Math.random() > 0.9) {
            r = Math.min(255, r + 50);
            g = Math.min(255, g + 50);
            b = Math.min(255, b + 50);
          }
          
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  };

  // Enhanced animation loop with time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      // Update animation time
      setAnimationTime(prev => prev + 0.1);
      
      if (isRunning || demoMode) {
        const newData = generateSpectrumData();
        setSpectrumData(newData);
        
        // Update waterfall
        setWaterfallData(prev => {
          const newWaterfall = [...prev, newData];
          return newWaterfall.slice(-200); // Keep more history for smoother animation
        });
        
        // Enhanced audio activity simulation
        if (!isMuted) {
          let maxActivity = 0;
          signalPeaks.forEach(peak => {
            if (peak.animation && Math.abs(peak.frequency - centerFreq) < 0.1) {
              const phase = animationTime * peak.animation.speed;
              let activity = 0;
              
              switch (peak.type) {
                case 'carrier':
                  if (peak.animation.pattern === 'voice') {
                    activity = Math.sin(phase * 0.3) > 0.6 ? 60 + Math.random() * 30 : 0;
                  } else if (peak.animation.pattern === 'dispatch') {
                    activity = Math.sin(phase * 0.2) > 0.3 ? 80 + Math.random() * 20 : 0;
                  }
                  break;
                case 'burst':
                  activity = Math.sin(phase * 0.4) > 0.5 ? 90 + Math.random() * 10 : 0;
                  break;
                case 'digital':
                  const digitalPattern = Math.floor(phase * 4) % 4;
                  activity = digitalPattern < 3 ? 50 + Math.random() * 30 : 0;
                  break;
              }
              
              if (peak.active && activity > 0) {
                maxActivity = Math.max(maxActivity, activity);
              }
            }
          });
          
          setAudioLevel(maxActivity);
        } else {
          setAudioLevel(0);
        }
      }
    }, 80); // Slightly faster for smoother animation
    
    return () => clearInterval(interval);
  }, [isRunning, demoMode, centerFreq, isMuted, animationTime]);

  // Canvas drawing updates
  useEffect(() => {
    if (spectrumCanvasRef.current && spectrumData.length > 0) {
      drawSpectrum(spectrumCanvasRef.current, spectrumData);
    }
  }, [spectrumData, centerFreq, sampleRate]);

  useEffect(() => {
    if (waterfallCanvasRef.current && waterfallData.length > 0) {
      drawWaterfall(waterfallCanvasRef.current, waterfallData);
    }
  }, [waterfallData]);

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const freq = parseFloat(event.target.value);
    if (!isNaN(freq)) {
      setCenterFreq(freq);
    }
  };

  const quickTune = (freq: number) => {
    setCenterFreq(freq);
    // Find and activate the signal at this frequency
    const matchingPeak = signalPeaks.find(peak => Math.abs(peak.frequency - freq) < 0.001);
    if (matchingPeak) {
      signalPeaks.forEach(peak => peak.active = false);
      matchingPeak.active = true;
    }
  };

  return (
    <Paper sx={{ p: 2, backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TuneIcon sx={{ color: '#00ff41' }} />
          <Typography variant="h6" sx={{ color: '#00ff41', fontFamily: 'monospace' }}>
            SDR-Control v3.2.1
          </Typography>
          <Chip 
            label={isRunning ? 'ACTIVE' : 'STANDBY'} 
            color={isRunning ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Box>
          <IconButton sx={{ color: '#ffffff' }}>
            <SaveIcon />
          </IconButton>
          <IconButton sx={{ color: '#ffffff' }}>
            <LoadIcon />
          </IconButton>
          <IconButton sx={{ color: '#ffffff' }}>
            <SettingsIcon />
          </IconButton>
          <IconButton sx={{ color: '#ffffff' }}>
            <FullscreenIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Left Panel - Controls */}
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ backgroundColor: '#2a2a2a', color: '#ffffff', mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#00ff41' }}>
                Radio Control
              </Typography>
              
              {/* Start/Stop Controls */}
              <Box sx={{ mb: 2 }}>
                <ButtonGroup fullWidth>
                  <Button
                    variant={isRunning ? 'outlined' : 'contained'}
                    startIcon={<PlayIcon />}
                    onClick={() => setIsRunning(true)}
                    color="success"
                  >
                    Start
                  </Button>
                  <Button
                    variant={isRunning ? 'contained' : 'outlined'}
                    startIcon={<StopIcon />}
                    onClick={() => setIsRunning(false)}
                    color="error"
                  >
                    Stop
                  </Button>
                </ButtonGroup>
              </Box>

              {/* Frequency Control */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Center Frequency (MHz)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={centerFreq.toFixed(4)}
                  onChange={handleFrequencyChange}
                  InputProps={{
                    style: { 
                      color: '#00ff41', 
                      fontFamily: 'monospace',
                      fontSize: '1.1rem'
                    }
                  }}
                />
              </Box>

              {/* Quick Tune Buttons */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Quick Tune
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      onClick={() => quickTune(462.5625)}
                      sx={{ color: '#4CAF50', borderColor: '#4CAF50' }}
                    >
                      CERT
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      onClick={() => quickTune(154.280)}
                      sx={{ color: '#FF5722', borderColor: '#FF5722' }}
                    >
                      Fire
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      onClick={() => quickTune(155.340)}
                      sx={{ color: '#2196F3', borderColor: '#2196F3' }}
                    >
                      Medical
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      onClick={() => quickTune(453.450)}
                      sx={{ color: '#9C27B0', borderColor: '#9C27B0' }}
                    >
                      Police
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Demodulator */}
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: '#ffffff' }}>Demodulator</InputLabel>
                  <Select
                    value={demodMode}
                    onChange={(e) => setDemodMode(e.target.value)}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="NFM">NFM (Narrow FM)</MenuItem>
                    <MenuItem value="WFM">WFM (Wide FM)</MenuItem>
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="USB">USB</MenuItem>
                    <MenuItem value="LSB">LSB</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Gain Control */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  RF Gain: {gain} dB
                </Typography>
                <Slider
                  value={gain}
                  onChange={(_, value) => setGain(value as number)}
                  min={0}
                  max={50}
                  sx={{ color: '#00ff41' }}
                />
              </Box>

              {/* Volume Control */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Volume: {isMuted ? 'MUTED' : volume}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => setIsMuted(!isMuted)}
                    sx={{ color: isMuted ? '#ff4444' : '#ffffff' }}
                  >
                    {isMuted ? <MuteIcon /> : <VolumeIcon />}
                  </IconButton>
                  <Slider
                    value={volume}
                    onChange={(_, value) => setVolume(value as number)}
                    min={0}
                    max={100}
                    disabled={isMuted}
                    sx={{ color: '#00ff41', flexGrow: 1 }}
                  />
                </Box>
              </Box>

              {/* Squelch Control */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Squelch: {squelchLevel} dBm
                </Typography>
                <Slider
                  value={squelchLevel}
                  onChange={(_, value) => setSquelchLevel(value as number)}
                  min={-100}
                  max={-20}
                  sx={{ color: '#00ff41' }}
                />
              </Box>

              {/* AGC Toggle */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={agcEnabled}
                      onChange={(e) => setAgcEnabled(e.target.checked)}
                      sx={{ color: '#00ff41' }}
                    />
                  }
                  label="AGC (Auto Gain Control)"
                />
              </Box>

              {/* Demo Mode Toggle */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={demoMode}
                      onChange={(e) => setDemoMode(e.target.checked)}
                      sx={{ color: '#ff9800' }}
                    />
                  }
                  label="Demo Mode (Enhanced Animations)"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      fontSize: '0.9rem',
                      color: demoMode ? '#ff9800' : '#ffffff'
                    }
                  }}
                />
                {demoMode && (
                  <Typography variant="caption" sx={{ display: 'block', color: '#ff9800', mt: 0.5 }}>
                    Simulating enhanced radio activity
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Signal Status */}
          <Card sx={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#00ff41' }}>
                Signal Status
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Signal Strength: {currentSignalStrength} dBm
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, (currentSignalStrength + 100) * 2))}
                  sx={{
                    backgroundColor: '#444',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: currentSignalStrength > -70 ? '#4CAF50' : 
                                     currentSignalStrength > -85 ? '#FF9800' : '#f44336'
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Audio Level: {audioLevel.toFixed(0)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={audioLevel}
                  sx={{
                    backgroundColor: '#444',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#00ff41'
                    }
                  }}
                />
              </Box>

              <Divider sx={{ my: 2, borderColor: '#444' }} />

              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Sample Rate: {sampleRate} MHz<br/>
                Filter Width: {filterWidth} kHz<br/>
                Mode: {demodMode}<br/>
                Status: {(isRunning || demoMode) ? 
                  <span style={{ color: '#4CAF50' }}>
                    RECEIVING {audioLevel > 10 ? '📡' : ''}
                  </span> : 
                  <span style={{ color: '#666' }}>STANDBY</span>
                }<br/>
                Demo: {demoMode ? 
                  <span style={{ color: '#ff9800' }}>ACTIVE</span> : 
                  <span style={{ color: '#666' }}>OFF</span>
                }
              </Typography>

              {/* Live Activity Indicators */}
              {(demoMode || isRunning) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: '#00ff41', mb: 1, display: 'block' }}>
                    Live Signal Activity
                  </Typography>
                  {signalPeaks.map((peak, index) => {
                    const phase = animationTime * (peak.animation?.speed || 0.1);
                    let isActive = false;
                    
                    if (peak.type === 'carrier') {
                      isActive = Math.sin(phase * 0.3) > 0.6;
                    } else if (peak.type === 'burst') {
                      isActive = Math.sin(phase * 0.4) > 0.5;
                    } else if (peak.type === 'digital') {
                      const digitalPattern = Math.floor(phase * 4) % 4;
                      isActive = digitalPattern < 3;
                    } else if (peak.type === 'sweep') {
                      isActive = Math.sin(phase * 0.8) > 0;
                    }

                    return (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Box 
                          sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: isActive ? '#4CAF50' : '#333',
                            mr: 1,
                            animation: isActive ? 'pulse 0.5s infinite' : 'none',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.3 }
                            }
                          }} 
                        />
                        <Typography variant="caption" sx={{ 
                          color: isActive ? '#4CAF50' : '#666', 
                          fontFamily: 'monospace',
                          fontSize: '0.7rem'
                        }}>
                          {peak.frequency.toFixed(4)} MHz ({peak.animation?.pattern || peak.type})
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Displays */}
        <Grid item xs={12} md={8} lg={9}>
          {/* Spectrum Analyzer */}
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#2a2a2a' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ color: '#00ff41' }}>
                <SpectrumIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Spectrum Analyzer
              </Typography>
              <Typography variant="body2" sx={{ color: '#ffffff', fontFamily: 'monospace' }}>
                {(centerFreq - sampleRate/2).toFixed(3)} - {(centerFreq + sampleRate/2).toFixed(3)} MHz
              </Typography>
            </Box>
            <canvas
              ref={spectrumCanvasRef}
              width={800}
              height={200}
              style={{ 
                width: '100%', 
                height: '200px', 
                backgroundColor: '#0a0a0a',
                border: '1px solid #333'
              }}
            />
          </Paper>

          {/* Waterfall Display */}
          <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ color: '#00ff41' }}>
                <WaterfallIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Waterfall Display
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Speed:
                </Typography>
                <Slider
                  value={waterfallSpeed}
                  onChange={(_, value) => setWaterfallSpeed(value as number)}
                  min={1}
                  max={10}
                  sx={{ color: '#00ff41', width: 100 }}
                />
              </Box>
            </Box>
            <canvas
              ref={waterfallCanvasRef}
              width={800}
              height={300}
              style={{ 
                width: '100%', 
                height: '300px', 
                backgroundColor: '#0a0a0a',
                border: '1px solid #333'
              }}
            />
            
            {/* Frequency scale */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 1,
              px: 1,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#888'
            }}>
              <span>{(centerFreq - sampleRate/2).toFixed(3)}</span>
              <span>{centerFreq.toFixed(3)}</span>
              <span>{(centerFreq + sampleRate/2).toFixed(3)}</span>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SDRInterface;