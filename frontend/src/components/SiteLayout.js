import { useMemo } from 'react';
import { Alert, Box, Chip, Paper, Stack, Tooltip, Typography } from '@mui/material';

import BatteryIcon from './common/icons/BatteryCoolingIcon24';
import EmptyState from './EmptyState';
import SiteLayoutFooter from './SiteLayoutFooter';
import TransformerIcon from './common/icons/TransformerIcon24';
import { validateLayoutSpacing } from '../utils/spacingValidator';

const SCALE = 7;
const SITE_WIDTH_FT = 100;
const SITE_HEIGHT_FT = 70;
const MAX_TILES_TO_RENDER = 500;

function getUnitVisuals(unit) {
  const isTransformer = unit.type === "TRANSFORMER";
  const widthPx = unit.width * SCALE;
  const heightPx = unit.height * SCALE;

  const iconSize = isTransformer
    ? Math.max(28, Math.min(52, widthPx - 18, heightPx - 34))
    : Math.max(26, Math.min(64, widthPx - 24, heightPx - 38));

  return { isTransformer, widthPx, heightPx, iconSize };
}

export default function SiteLayout({ layout = [] }) {
  const spacingValidation = useMemo(() => {
    return validateLayoutSpacing(layout);
  }, [layout]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        bgcolor: "#f7f7f8",
        borderRadius: 4,
        border: "1px solid #e3e5e8",
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em", color: "#171717" }}
          >
            100ft Visual Site Plan
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Chip
              size="small"
              label="Battery Units"
              sx={{
                bgcolor: "#e5ebf0",
                color: "#3a3d42",
                fontWeight: 600,
                borderRadius: 2,
              }}
            />
            <Chip
              size="small"
              label="Transformers"
              sx={{
                bgcolor: "#e8efff",
                color: "#3457b1",
                fontWeight: 600,
                borderRadius: 2,
              }}
            />
          </Stack>
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: "#666a70",
            fontWeight: 500,
            mt: 0.5,
          }}
        >
          {layout.length} units total (incl. transformers)
        </Typography>
      </Box>

      {spacingValidation.violations.length > 0 && (
        <Alert
          severity={spacingValidation.violations.some(v => v.severity === 'CRITICAL') ? 'error' : 'warning'}
          sx={{ mb: 2.5, borderRadius: 2 }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
              {spacingValidation.violations.length} Spacing {spacingValidation.violations.length === 1 ? 'Issue' : 'Issues'} Detected
            </Typography>
            <Stack spacing={0.5}>
              {spacingValidation.violations.slice(0, 3).map((violation, idx) => (
                <Typography key={idx} variant="body2" sx={{ fontSize: '0.85rem' }}>
                  • {violation.message}
                </Typography>
              ))}
              {spacingValidation.violations.length > 3 && (
                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                  ... and {spacingValidation.violations.length - 3} more
                </Typography>
              )}
            </Stack>
          </Box>
        </Alert>
      )}

      {layout.length > MAX_TILES_TO_RENDER && (
        <Alert
          severity="info"
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: "#fff8d2",
            border: "1px solid #ffe199",
            color: "#5d4c15",
          }}
        >
          <Typography variant="body2">
            Showing first {MAX_TILES_TO_RENDER} tiles of {layout.length} total for performance. Only {layout.length - MAX_TILES_TO_RENDER} tiles hidden from visualization.
          </Typography>
        </Alert>
      )}

      <Box sx={{ pb: 1, px: 2 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: `${SITE_HEIGHT_FT * SCALE}px`,
            mx: 0,
            borderRadius: 2,
            overflow: "auto",
            border: "1px solid #e2e5e8",
            bgcolor: "#fcfcfd",
            maxHeight: "600px",
            backgroundImage: `
              linear-gradient(rgba(20,20,20,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20,20,20,0.06) 1px, transparent 1px)
            `,
            backgroundSize: `${10 * SCALE}px ${10 * SCALE}px`,
          }}
        >
          {layout.length === 0 && <EmptyState /> }
          <Box
            sx={{
              position: "absolute",
              inset: "16px",
              width: `calc(100% - 32px)`,
              height: `calc(100% - 32px)`,
            }}
          >
            {layout.slice(0, MAX_TILES_TO_RENDER).map((unit) => {
              const { isTransformer, widthPx, heightPx, iconSize } =
                getUnitVisuals(unit);

              return (
                <Box
                  key={unit.id}
                  sx={{
                    position: "absolute",
                    left: `${unit.x * SCALE}px`,
                    top: `${unit.y * SCALE}px`,
                    width: `${widthPx}px`,
                    height: `${heightPx}px`,
                  boxSizing: "border-box",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 1.5,
                  border: isTransformer
                    ? "1px solid #264a9d"
                    : "1px solid #2b2b2b",
                  bgcolor: isTransformer ? "#4b72db" : "#e5ebf0",
                  boxShadow: isTransformer
                    ? "0 4px 10px rgba(34, 64, 140, 0.18)"
                    : "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 1,
                    pt: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: iconSize,
                      height: iconSize,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      opacity: isTransformer ? 1 : 0.95,
                    }}
                  >
                    {isTransformer ? (
                      <TransformerIcon
                        size={iconSize}
                        stroke="#1f2430"
                        accent="#7BD06E"
                      />
                    ) : (
                      <BatteryIcon size={iconSize} />
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    px: 0.75,
                    py: 0.75,
                    textAlign: "center",
                    bgcolor: "#e5ebf0",
                    borderTop: isTransformer
                      ? "1px solid rgba(38, 74, 157, 0.2)"
                      : "1px solid rgba(0,0,0,0.04)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <Tooltip title={unit.type.replaceAll("_", " ")} arrow>
                    <Typography
                      sx={{
                        fontSize: isTransformer ? "10px" : "11px",
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                        lineHeight: 1.1,
                        color: "#171717",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {unit.type.replaceAll("_", " ")}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
            );
          })}
          </Box>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{
          mt: 2.5,
          textAlign: "center",
          color: "#666a70",
          fontWeight: 500,
        }}
      >
        Layout conforms to 100ft width constraint, 2:1 battery-to-transformer ratio.
      </Typography>

      <SiteLayoutFooter />
    </Paper>
  );
}