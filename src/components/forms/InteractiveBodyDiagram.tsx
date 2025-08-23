import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import { Control } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface InteractiveBodyDiagramProps {
  control: Control<EPCRData>;
}

export function InteractiveBodyDiagram({ control }: InteractiveBodyDiagramProps) {
  return (
    <Box className="body-diagram-section" sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
        BODY DIAGRAM
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #000' }}>
        <Grid container spacing={2}>
          {/* Anterior (Front) */}
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center', display: 'block', mb: 1 }}>
              ANTERIOR
            </Typography>
            <Box sx={{ position: 'relative', width: '100%', height: '300px', border: '1px solid #000' }}>
              {/* Simple anterior body outline */}
              <svg width="100%" height="100%" viewBox="0 0 200 300">
                <defs>
                  <style>
                    {`
                      .body-part { fill: none; stroke: #333; stroke-width: 1.2; stroke-linejoin: round; }
                      .body-text { font-size: 8px; fill: #333; text-anchor: middle; font-weight: bold; }
                      .body-outline { fill: rgba(240, 248, 255, 0.3); stroke: #1976d2; stroke-width: 0.8; }
                    `}
                  </style>
                </defs>
                
                {/* Head - more natural oval shape */}
                <ellipse cx="100" cy="25" rx="12" ry="14" className="body-part"/>
                <text x="100" y="30" className="body-text">9</text>
                
                {/* Neck */}
                <path d="M88,39 Q100,35 112,39" className="body-part"/>
                
                {/* Torso - anatomically shaped with shoulders and waist */}
                <path d="M75,42 Q100,40 125,42 L122,85 Q115,95 100,95 Q85,95 78,85 Z" className="body-part"/>
                <text x="100" y="72" className="body-text">18</text>
                
                {/* Pelvis - more natural hip shape */}
                <path d="M82,95 Q100,98 118,95 L115,125 Q100,128 85,125 Z" className="body-part"/>
                <text x="100" y="115" className="body-text">9</text>
                
                {/* Left Arm - Upper arm */}
                <ellipse cx="60" cy="65" rx="8" ry="18" transform="rotate(-15 60 65)" className="body-part"/>
                {/* Left Forearm */}
                <ellipse cx="45" cy="95" rx="7" ry="16" transform="rotate(-25 45 95)" className="body-part"/>
                {/* Left Hand */}
                <ellipse cx="38" cy="115" rx="5" ry="8" transform="rotate(-30 38 115)" className="body-part"/>
                <text x="52" y="85" className="body-text">9</text>
                
                {/* Right Arm - Upper arm */}
                <ellipse cx="140" cy="65" rx="8" ry="18" transform="rotate(15 140 65)" className="body-part"/>
                {/* Right Forearm */}
                <ellipse cx="155" cy="95" rx="7" ry="16" transform="rotate(25 155 95)" className="body-part"/>
                {/* Right Hand */}
                <ellipse cx="162" cy="115" rx="5" ry="8" transform="rotate(30 162 115)" className="body-part"/>
                <text x="148" y="85" className="body-text">9</text>
                
                {/* Left Leg - Thigh */}
                <ellipse cx="90" cy="165" rx="10" ry="25" className="body-part"/>
                {/* Left Calf */}
                <ellipse cx="88" cy="210" rx="8" ry="22" className="body-part"/>
                {/* Left Foot */}
                <ellipse cx="85" cy="245" rx="12" ry="6" className="body-part"/>
                
                {/* Right Leg - Thigh */}
                <ellipse cx="110" cy="165" rx="10" ry="25" className="body-part"/>
                {/* Right Calf */}
                <ellipse cx="112" cy="210" rx="8" ry="22" className="body-part"/>
                {/* Right Foot */}
                <ellipse cx="115" cy="245" rx="12" ry="6" className="body-part"/>
                
                <text x="100" y="190" className="body-text">18</text>
              </svg>
            </Box>
          </Grid>
          
          {/* Posterior (Back) */}
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center', display: 'block', mb: 1 }}>
              POSTERIOR
            </Typography>
            <Box sx={{ position: 'relative', width: '100%', height: '300px', border: '1px solid #000' }}>
              {/* Simple posterior body outline */}
              <svg width="100%" height="100%" viewBox="0 0 200 300">
                <defs>
                  <style>
                    {`
                      .body-part { fill: none; stroke: #333; stroke-width: 1.2; stroke-linejoin: round; }
                      .body-text { font-size: 8px; fill: #333; text-anchor: middle; font-weight: bold; }
                      .body-outline { fill: rgba(255, 248, 240, 0.3); stroke: #d84315; stroke-width: 0.8; }
                    `}
                  </style>
                </defs>
                
                {/* Head - back of head */}
                <ellipse cx="100" cy="25" rx="12" ry="14" className="body-part"/>
                <text x="100" y="30" className="body-text">18</text>
                
                {/* Neck */}
                <path d="M88,39 Q100,35 112,39" className="body-part"/>
                
                {/* Upper Back - broader at shoulders */}
                <path d="M75,42 Q100,40 125,42 L120,80 Q100,82 80,80 Z" className="body-part"/>
                <text x="100" y="62" className="body-text">18</text>
                
                {/* Lower Back */}
                <path d="M80,80 Q100,82 120,80 L115,105 Q100,108 85,105 Z" className="body-part"/>
                <text x="100" y="92" className="body-text">9</text>
                
                {/* Buttocks */}
                <path d="M85,105 Q100,108 115,105 L112,125 Q100,128 88,125 Z" className="body-part"/>
                <text x="100" y="118" className="body-text">9</text>
                
                {/* Left Arm - Upper arm back */}
                <ellipse cx="60" cy="65" rx="8" ry="18" transform="rotate(-15 60 65)" className="body-part"/>
                {/* Left Forearm back */}
                <ellipse cx="45" cy="95" rx="7" ry="16" transform="rotate(-25 45 95)" className="body-part"/>
                {/* Left Hand back */}
                <ellipse cx="38" cy="115" rx="5" ry="8" transform="rotate(-30 38 115)" className="body-part"/>
                <text x="52" y="85" className="body-text">9</text>
                
                {/* Right Arm - Upper arm back */}
                <ellipse cx="140" cy="65" rx="8" ry="18" transform="rotate(15 140 65)" className="body-part"/>
                {/* Right Forearm back */}
                <ellipse cx="155" cy="95" rx="7" ry="16" transform="rotate(25 155 95)" className="body-part"/>
                {/* Right Hand back */}
                <ellipse cx="162" cy="115" rx="5" ry="8" transform="rotate(30 162 115)" className="body-part"/>
                <text x="148" y="85" className="body-text">9</text>
                
                {/* Left Leg back - Thigh */}
                <ellipse cx="90" cy="155" rx="10" ry="22" className="body-part"/>
                {/* Left Calf back */}
                <ellipse cx="88" cy="195" rx="8" ry="20" className="body-part"/>
                {/* Left Foot back */}
                <ellipse cx="85" cy="230" rx="12" ry="6" className="body-part"/>
                
                {/* Right Leg back - Thigh */}
                <ellipse cx="110" cy="155" rx="10" ry="22" className="body-part"/>
                {/* Right Calf back */}
                <ellipse cx="112" cy="195" rx="8" ry="20" className="body-part"/>
                {/* Right Foot back */}
                <ellipse cx="115" cy="230" rx="12" ry="6" className="body-part"/>
                
                <text x="100" y="175" className="body-text">18</text>
              </svg>
            </Box>
          </Grid>
        </Grid>
        
        <Typography variant="caption" sx={{ fontSize: '0.65rem', textAlign: 'center', display: 'block', mt: 1 }}>
          Numbers indicate percentage of body surface area
        </Typography>
      </Paper>
    </Box>
  );
}