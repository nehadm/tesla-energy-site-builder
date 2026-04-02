import React from "react";
import {
  Grid,
  Typography,
  Divider,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { DEVICES } from "../constants";
import TeslaTextField from "./TeslaTextField";

export default function Sidebar({
  quantities,
  onChange,
  onSave,
  onReset,
  isSaving,
  status,
}) {
  const handleQuantityChange = (type, value) => {
    const parsedValue = Math.max(0, Number(value) || 0);
    onChange(type, parsedValue);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <Grid
      item
      xs={12}
      md={3}
      lg={2.5}
      sx={{
        borderRight: "1px solid #e2e5e8",
        bgcolor: "#ffffff",
        p: 3,
        display: "flex",
        flexDirection: "column",
        // gap: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ letterSpacing: "-0.5px" }}
      >
        Configure Site
      </Typography>

      <Divider sx={{ my: 1, borderColor: "#e2e5e8", borderBottomWidth: 1.5 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Object.keys(quantities).map((type) => (
        <TeslaTextField
          key={type}
          label={DEVICES[type]?.name || type}
          type="number"
          value={quantities[type]}
          onChange={(e) => handleQuantityChange(type, e.target.value)}
          helperText={
            DEVICES[type]?.cost !== null
              ? `$${DEVICES[type].cost.toLocaleString()}`
              : ""
          }
          min={0}
        />
      ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            flex: 1,
            height: "40px",
            color: "#171a20",
            borderColor: "#171a20",
            fontFamily: '"Universal Sans Text", -apple-system, Arial, sans-serif',
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(23, 26, 32, 0.05)",
              borderColor: "#171a20",
            },
          }}
        >
          Reset
        </Button>

        <Button
          variant="contained"
          disabled={isSaving}
          onClick={handleSave}
          sx={{
            flex: 2,
            height: "40px",
            bgcolor: "#3E6AE1",
            color: "#FFFFFF",
            fontFamily: '"Universal Sans Text", -apple-system, Arial, sans-serif',
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            borderRadius: "4px",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#3457B1",
              boxShadow: "none",
            },
          }}
        >
          {isSaving ? <CircularProgress size={20} color="inherit" /> : "Save Session"}
        </Button>
      </Box>

      <Box sx={{ mt: "auto", pt: 2, borderTop: "1px solid #eee" }}>
        <Typography variant="caption" color="text.secondary">
          Status: {status || "Ready"}
        </Typography>
      </Box>
    </Grid>
  );
}