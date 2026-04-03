# Spacing Rules Documentation

## Overview

The Tesla Energy Site Builder enforces strict spacing rules between battery units and transformers to ensure:
- **Maintenance access**: Technicians can safely access all equipment
- **Cooling efficiency**: Proper airflow and heat dissipation
- **Electrical clearance**: Safe operation of high-voltage connections
- **Safety compliance**: Meeting industry standards for utility-scale battery storage

## Spacing Requirements

### Horizontal Spacing (Left-Right)
| Unit Type Pair | Required Spacing |
|---|---|
| Battery-to-Battery | 2.0 ft |
| Battery-to-Transformer | 1.5 ft |
| Transformer-to-Transformer | 1.5 ft |

### Vertical Spacing (Top-Bottom)
| Unit Type Pair | Required Spacing |
|---|---|
| Battery-to-Battery | 2.0 ft |
| Battery-to-Transformer | 1.5 ft |
| Transformer-to-Transformer | 1.5 ft |

## Current Layout Configuration

### Equipment Specifications
- **Megapack XL**: 40ft × 10ft (4 MWh capacity)
- **Megapack 2**: 30ft × 10ft (3 MWh capacity)
- **Megapack**: 30ft × 10ft (2 MWh capacity)
- **Powerpack**: 10ft × 10ft (1 MWh capacity)
- **Transformer**: 10ft × 10ft (required 1 per 2 batteries)

### Site Constraints
- **Width**: 100 ft (absolute maximum)
- **Battery-to-Transformer Ratio**: 1 transformer per 2 batteries (mandatory)
- **No overlaps**: Units cannot occupy the same space

## Implementation Details

### Files Involved

1. **generateLayout.js**
   - Main layout generation function with spacing enforcement
   - `SPACING_RULES` constant defines all clearance requirements
   - `validateSpacing()` checks new units against existing ones
   - `getSpacing()` helper calculates required spacing between unit types

2. **spacingValidator.js**
   - Comprehensive spacing validation utilities
   - `validateLayoutSpacing()` - validates entire layout
   - `getActualSpacing()` - calculates current spacing between units
   - `unitsOverlap()` - detects collisions
   - `generateSpacingReport()` - creates detailed compliance report

3. **SiteLayout.js** (Component)
   - Displays spacing validation alerts
   - Shows spacing rule summary in footer
   - Highlights violations with severity levels

## Validation System

### Violation Severity Levels

**CRITICAL**: Units are overlapping or physically impossible
- Immediate action required
- Layout cannot proceed

**WARNING**: Spacing requirements not met
- May restrict maintenance access
- Affects equipment cooling efficiency
- Should be resolved but layout is still functional

### Running Validation

```javascript
import { validateLayoutSpacing } from './utils/spacingValidator';

const validation = validateLayoutSpacing(units);
console.log(validation.isValid); // true/false
console.log(validation.violations); // Array of violations
console.log(validation.summary); // { total, critical, warnings }
```

### Generating Reports

```javascript
import { generateSpacingReport } from './utils/spacingValidator';

const report = generateSpacingReport(units);
console.log(report.report.details); // Human-readable messages
```

## Future Enhancements

- [ ] Transformer assignment optimization (assign transformers to nearby batteries)
- [ ] Access corridor generation (auto-add maintenance pathways)
- [ ] 3D spacing visualization
- [ ] Custom spacing rule configuration per site type
- [ ] Land footprint optimization with spacing constraints
- [ ] Export compliance certifications

## Example: Current Configuration

```
Layout: 2 Megapack XLs, 2 Megapack 2s, 1 Powerpack
Total Batteries: 5
Required Transformers: 3 (ceil(5/2))
Total Units: 8

Row 1:
  [Megapack XL 40×10]  [2ft gap]  [Megapack XL 40×10]  [2ft gap]  [16ft remaining]

Row 2:
  [Megapack 2 30×10]  [2ft gap]  [Megapack 2 30×10]  [2ft gap]  [36ft remaining]

Row 3:
  [Powerpack 10×10]  [2ft gap]  [Transformer 10×10]  [2ft gap]  [Transformer 10×10]  [.....]
```

## Notes

- Spacing is enforced during layout generation
- If spacing violations are unavoidable (width constraint), the layout proceeds with warnings
- The 100ft width constraint takes priority over spacing for row wrapping decisions
- All spacing measurements are in feet (ft)
