import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

export default function SiteLayoutFooter() {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        mt: 2,
        pt: 2,
        borderTop: "1px solid #e3e5e8",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem" }}>
          Battery-to-Battery
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          2 ft
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem" }}>
          Battery-to-Transformer
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          1.5 ft
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem" }}>
          Transformer-to-Transformer
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          1.5 ft
        </Typography>
      </Box>
    </Stack>
  );
}
