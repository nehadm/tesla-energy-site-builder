import React from 'react';
import { Box, Typography, Paper, Tooltip, Zoom } from '@mui/material';

const BatteryIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="5" y="5" width="90" height="90" rx="2" fill="#FFFFFF" stroke="#D1D1D1" strokeWidth="1" />
    <line x1="15" y1="20" x2="85" y2="20" stroke="#EAEAEA" strokeWidth="2" />
    <line x1="15" y1="35" x2="85" y2="35" stroke="#EAEAEA" strokeWidth="2" />
    <line x1="15" y1="50" x2="85" y2="50" stroke="#EAEAEA" strokeWidth="2" />
    <rect x="40" y="75" width="20" height="5" rx="1" fill="#CC0000" /> {/* Tesla Red Accent */}
  </svg>
);

const TransformerIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="5" y="5" width="90" height="90" rx="2" fill="#4A4A4A" stroke="#333333" strokeWidth="1" />
    <path d="M50 20 L65 45 L35 45 L50 75" fill="none" stroke="#FFD700" strokeWidth="4" /> {/* Lightning Bolt */}
  </svg>
);

export default function SiteLayout({ layout = [] }) {
  const Y_SCALE = 5; // 1ft = 5px

  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: '#F9F9F9', borderRadius: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">100ft Visual Site Plan</Typography>
        <Typography variant="body2" color="text.secondary">
          {layout.length} units total (incl. transformers)
        </Typography>
      </Box>

      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '600px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E0E0E0',
        borderRadius: 1,
        overflow: 'auto',
        background: 'radial-gradient(#f0f0f0 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}>

      {(layout.units || []).map((unit) => (
        <div 
          key={unit.id} 
          style={{ 
            position: 'absolute',
            left: `${unit.x * 10}px`, // Scaling for visibility
            top: `${unit.y * 10}px`,
            width: `${unit.width * 10}px`,
            height: `${unit.height * 10}px`,
            backgroundColor: unit.color,
            border: '1px solid #171717',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          {unit.type}
        </div>
      ))}
      </Box>
    </Paper>
  );
}