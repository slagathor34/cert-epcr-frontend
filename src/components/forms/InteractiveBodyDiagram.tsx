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
                {/* Head */}
                <circle cx="100" cy="25" r="15" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="100" y="30" textAnchor="middle" fontSize="8" fill="#000">9</text>
                
                {/* Torso */}
                <rect x="80" y="40" width="40" height="80" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="100" y="85" textAnchor="middle" fontSize="8" fill="#000">18</text>
                
                {/* Pelvis */}
                <rect x="85" y="120" width="30" height="30" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="100" y="140" textAnchor="middle" fontSize="8" fill="#000">9</text>
                
                {/* Arms */}
                <rect x="50" y="50" width="25" height="60" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="62" y="85" textAnchor="middle" fontSize="8" fill="#000">9</text>
                
                <rect x="125" y="50" width="25" height="60" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="137" y="85" textAnchor="middle" fontSize="8" fill="#000">9</text>
                
                {/* Legs */}
                <rect x="85" y="150" width="12" height="140" fill="none" stroke="#000" strokeWidth="1"/>
                <rect x="103" y="150" width="12" height="140" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="100" y="225" textAnchor="middle" fontSize="8" fill="#000">9</text>
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
                {/* Head */}
                <circle cx="100" cy="25" r="15" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="100" y="30" textAnchor="middle" fontSize="8" fill="#000">18</text>
                
                {/* Torso */}
                <rect x="80" y="40" width="40" height="80" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="100" y="85" textAnchor="middle" fontSize="8" fill="#000">9</text>
                
                {/* Arms */}
                <rect x="50" y="50" width="25" height="60" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="62" y="85" textAnchor="middle" fontSize="8" fill="#000">9</text>
                
                <rect x="125" y="50" width="25" height="60" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="137" y="85" textAnchor="middle" fontSize="8" fill="#000">9</text>
                
                {/* Pelvis and Legs */}
                <rect x="85" y="120" width="30" height="170" fill="none" stroke="#000" strokeWidth="1"/>
                <text x="100" y="210" textAnchor="middle" fontSize="8" fill="#000">9</text>
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