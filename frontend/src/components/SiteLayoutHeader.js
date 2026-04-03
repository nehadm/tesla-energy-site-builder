import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SiteLayoutHeader() {
  return (
    <Box>
      <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: '-1px', color: '#171a20' }}>
        Site Layout
      </Typography>
      <Typography variant="body1" color="text.secondary">
        100ft Industrial Site Mockup
      </Typography>
    </Box>
  );
}