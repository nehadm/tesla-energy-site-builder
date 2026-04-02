import React from "react";
import {
  Typography,
  Box,
} from "@mui/material";

export default function SiteLayoutHeader() {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="h6" fontWeight="600" sx={{ letterSpacing: '-1px', color: '#171a20' }}>
        Site Layout
      </Typography>
      <Typography variant="body1" color="text.secondary">
        100ft Industrial Site Mockup
      </Typography>
    </Box>
  );
}