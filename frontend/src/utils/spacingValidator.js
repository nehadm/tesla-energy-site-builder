const SPACING_RULES = {
  HORIZONTAL: {
    'BATTERY_TO_BATTERY': 2,
    'BATTERY_TO_TRANSFORMER': 1.5,
    'TRANSFORMER_TO_TRANSFORMER': 1.5,
    'DEFAULT': 2
  },
  VERTICAL: {
    'BATTERY_TO_BATTERY': 2,
    'BATTERY_TO_TRANSFORMER': 1.5,
    'TRANSFORMER_TO_TRANSFORMER': 1.5,
    'DEFAULT': 2
  }
};

export const getUnitBounds = (unit) => ({
  left: unit.x,
  right: unit.x + unit.width,
  top: unit.y,
  bottom: unit.y + unit.height,
});

export const unitsOverlap = (unit1, unit2) => {
  const b1 = getUnitBounds(unit1);
  const b2 = getUnitBounds(unit2);
  
  return !(b1.right <= b2.left || b2.right <= b1.left ||
           b1.bottom <= b2.top || b2.bottom <= b1.top);
};

const getSpacingType = (type1, type2) => {
  const isBat1 = type1 !== 'TRANSFORMER';
  const isBat2 = type2 !== 'TRANSFORMER';
  
  if (isBat1 && isBat2) {
    return 'BATTERY_TO_BATTERY';
  }
  if (!isBat1 && !isBat2) {
    return 'TRANSFORMER_TO_TRANSFORMER';
  }
  return 'BATTERY_TO_TRANSFORMER';
};

export const getRequiredSpacing = (type1, type2, direction = 'horizontal') => {
  const rules = direction === 'vertical' ? SPACING_RULES.VERTICAL : SPACING_RULES.HORIZONTAL;
  const spacingType = getSpacingType(type1, type2);
  return rules[spacingType] || rules.DEFAULT;
};

export const getActualSpacing = (unit1, unit2) => {
  const b1 = getUnitBounds(unit1);
  const b2 = getUnitBounds(unit2);
  
  let horizontalGap;
  if (b1.right <= b2.left) {
    horizontalGap = b2.left - b1.right;
  } else if (b2.right <= b1.left) {
    horizontalGap = b1.left - b2.right;
  } else {
    horizontalGap = -(Math.max(b1.right, b2.right) - Math.min(b1.left, b2.left) - 
                      Math.max(unit1.width, unit2.width));
  }
  
  let verticalGap;
  if (b1.bottom <= b2.top) {
    verticalGap = b2.top - b1.bottom;
  } else if (b2.bottom <= b1.top) {
    verticalGap = b1.top - b2.bottom;
  } else {
    verticalGap = -(Math.max(b1.bottom, b2.bottom) - Math.min(b1.top, b2.top) - 
                    Math.max(unit1.height, unit2.height));
  }
  
  return { horizontalGap, verticalGap };
};

export const validateLayoutSpacing = (units) => {
  const violations = [];
  
  for (let i = 0; i < units.length; i++) {
    for (let j = i + 1; j < units.length; j++) {
      const unit1 = units[i];
      const unit2 = units[j];
      
      // Check for overlaps
      if (unitsOverlap(unit1, unit2)) {
        violations.push({
          severity: 'CRITICAL',
          type: 'OVERLAP',
          unit1: unit1.id,
          unit2: unit2.id,
          message: `Units ${unit1.id} and ${unit2.id} are overlapping`
        });
        continue;
      }
      
      const spacing = getActualSpacing(unit1, unit2);
      const horizontalRequired = getRequiredSpacing(unit1.type, unit2.type, 'horizontal');
      const verticalRequired = getRequiredSpacing(unit1.type, unit2.type, 'vertical');
      
      const sameRowRange = 3;
      const sameColumnRange = 3;
      
      const inSameRow = Math.abs(unit1.y - unit2.y) < sameRowRange;
      const inSameColumn = Math.abs(unit1.x - unit2.x) < sameColumnRange;
      
      if (inSameRow && spacing.horizontalGap < horizontalRequired) {
        violations.push({
          severity: 'WARNING',
          type: 'HORIZONTAL_SPACING',
          unit1: unit1.id,
          unit2: unit2.id,
          required: horizontalRequired,
          actual: spacing.horizontalGap,
          deficit: horizontalRequired - spacing.horizontalGap,
          message: `Horizontal spacing between ${unit1.id} and ${unit2.id} is ${spacing.horizontalGap.toFixed(1)}ft (required: ${horizontalRequired}ft)`
        });
      }
      
      if (inSameColumn && spacing.verticalGap < verticalRequired) {
        violations.push({
          severity: 'WARNING',
          type: 'VERTICAL_SPACING',
          unit1: unit1.id,
          unit2: unit2.id,
          required: verticalRequired,
          actual: spacing.verticalGap,
          deficit: verticalRequired - spacing.verticalGap,
          message: `Vertical spacing between ${unit1.id} and ${unit2.id} is ${spacing.verticalGap.toFixed(1)}ft (required: ${verticalRequired}ft)`
        });
      }
    }
  }
  
  return {
    isValid: violations.filter(v => v.severity === 'CRITICAL').length === 0,
    violations,
    summary: {
      total: violations.length,
      critical: violations.filter(v => v.severity === 'CRITICAL').length,
      warnings: violations.filter(v => v.severity === 'WARNING').length
    }
  };
};

export const generateSpacingReport = (units) => {
  const validation = validateLayoutSpacing(units);
  
  return {
    ...validation,
    report: {
      timestamp: new Date().toISOString(),
      unitCount: units.length,
      criticalViolations: validation.violations.filter(v => v.severity === 'CRITICAL'),
      warningViolations: validation.violations.filter(v => v.severity === 'WARNING'),
      details: validation.violations.map(v => v.message)
    }
  };
};

export default {
  getUnitBounds,
  unitsOverlap,
  getActualSpacing,
  getRequiredSpacing,
  validateLayoutSpacing,
  generateSpacingReport,
  SPACING_RULES
};
