import React from 'react';
import { Box, Typography } from '@mui/material';

export default function EmptyState({ message = 'No units placed yet. Use the sidebar to add batteries and transformers.' }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.85)',
        zIndex: 1,
        pointerEvents: 'none',
        textAlign: 'center',
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: '#777', fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );
}
