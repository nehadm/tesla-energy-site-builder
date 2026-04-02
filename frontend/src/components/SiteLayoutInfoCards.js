import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';

export default function SiteLayoutInfoCards({totals}) {

  return (
    <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
      <Grid item xs={12} sm={4}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e5e8', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#5c5e62', textTransform: 'uppercase' }}>
            Total Cost
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, mt: 1 }}>
            ${totals.cost.toLocaleString()}
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e5e8', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#5c5e62', textTransform: 'uppercase' }}>
            Energy Capacity
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, mt: 1 }}>
            {totals.energy.toFixed(1)} <small style={{ fontSize: '16px' }}>MWh</small>
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e5e8', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#5c5e62', textTransform: 'uppercase' }}>
            Land Required
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, mt: 1 }}>
            {totals.sqft.toLocaleString()} <small style={{ fontSize: '16px' }}>sqft</small>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}