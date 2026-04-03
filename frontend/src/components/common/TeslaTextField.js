import React from 'react';
import { TextField } from '@mui/material';

export default function TeslaTextField({
  label,
  value,
  onChange,
  type = "text",
  helperText,
  min,
  fullWidth = true,
  ...props
}) {
    
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        ...(min !== undefined ? { min } : {}),
      }}
      sx={{
        mt: 1.5,
        "& .MuiInputLabel-root": {
          fontSize: "10px",
          lineHeight: 1.2,
          color: "#5c5e62",
          fontWeight: 500,
          transform: "translate(0, -10px) scale(1)",
          transformOrigin: "top left",
          letterSpacing: "0.1px",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#5c5e62",
        },
        "& .MuiFormHelperText-root": {
          marginLeft: "4px",
          marginTop: "6px",
          color: "#5c5e62",
          fontSize: "12px",
        },
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#f4f4f4",
          borderRadius: "10px",
          minHeight: "56px",
          fontSize: "18px",
          fontWeight: 500,
          color: "#171a20",
          transition: "background-color 160ms ease, box-shadow 160ms ease",

          "& fieldset": {
            border: "none",
          },
          "&:hover": {
            backgroundColor: "#ececec",
          },
          "&.Mui-focused": {
            backgroundColor: "#e8e8e8",
            boxShadow: "0 0 0 2px rgba(62, 106, 225, 0.12)",
          },
        },
        "& .MuiOutlinedInput-input": {
          padding: "18px 16px 12px 16px",
        },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
      }}
      {...props}
    />
  );
}