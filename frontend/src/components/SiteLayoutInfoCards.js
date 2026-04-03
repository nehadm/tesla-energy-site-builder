import React from 'react';
import { Divider, Grid, Paper, Typography } from '@mui/material';

export default function SiteLayoutInfoCards({ totals }) {
  const cards = [
    {
      label: "Total Cost",
      value: `$${totals.cost.toLocaleString()}`,
    },
    {
      label: "Energy Capacity",
      value: (
        <>
          {totals.energy.toFixed(1)}{" "}
          <small style={{ fontSize: "16px" }}>MWh</small>
        </>
      ),
    },
    {
      label: "Land Required",
      value: (
        <>
          {totals.sqft.toLocaleString()}{" "}
          <small style={{ fontSize: "16px" }}>sqft</small>
        </>
      ),
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid #e2e5e8",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#5c5e62",
                textTransform: "uppercase",
              }}
            >
              {card.label}
            </Typography>

            <Divider
                sx={{
                  mt: 0,
                  mb: 1,
                  borderColor: "#e2e5e8",
                  borderBottomWidth: 1.5,
                }}
            />

            <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}