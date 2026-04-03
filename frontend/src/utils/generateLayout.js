import { DEVICES } from '../constants';

export const generateLayout1 = (selectedBatteries) => {
  const layout = [];
  let currentX = 0;
  let currentY = 0;
  const MAX_WIDTH = 100;
  
  const allItems = [];
  for (let i = 0; i < selectedBatteries.length; i += 2) {
    allItems.push(selectedBatteries[i]);
    if (selectedBatteries[i + 1]) {
        allItems.push(selectedBatteries[i + 1]);
    }
    
    allItems.push({ ...DEVICES.TRANSFORMER, type: 'TRANSFORMER' });
  }

  let maxHeightInRow = 0;

  allItems.forEach((device) => {
    if (currentX + device.width > MAX_WIDTH) {
      currentX = 0;
      currentY += maxHeightInRow;
      maxHeightInRow = 0;
    }

    layout.push({ 
      ...device, 
      x: currentX, 
      y: currentY 
    });

    currentX += device.width;

    maxHeightInRow = Math.max(maxHeightInRow, device.length);
  });

  return layout;
};

const UNIT_DIMENSIONS = {
    MEGAPACK_XL: { width: 40, height: 10, energy: 3.9, cost: 120000 },
    MEGAPACK_2:  { width: 30, height: 10, energy: 2.8, cost: 80000  },
    MEGAPACK:    { width: 20, height: 10, energy: 1.9, cost: 50000  },
    POWERPACK:   { width: 10, height: 10, energy: 0.2, cost: 10000  },
    TRANSFORMER: { width: 10, height: 10, energy: 0,   cost: 10000  }
  };

const UNIT_DATA = {
  MEGAPACK_XL: { width: 40, length: 10, energy: 4, cost: 120000 },
  MEGAPACK_2:  { width: 30, length: 10, energy: 3, cost: 80000  },
  MEGAPACK:    { width: 30, length: 10, energy: 2, cost: 50000  },
  POWERPACK:   { width: 10, length: 10, energy: 1, cost: 10000  },
  TRANSFORMER: { width: 10, length: 10, energy: -0.5, cost: 10000 }
};

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

/**
 * Determines if a unit is a battery or transformer
 */
const isBattery = (type) => type !== 'TRANSFORMER';

/**
 * Calculates the required spacing between two units
 * @param {string} type1 - Type of first unit
 * @param {string} type2 - Type of second unit
 * @param {string} direction - 'horizontal' or 'vertical'
 * @returns {number} Required spacing in feet
 */
const getSpacing = (type1, type2, direction = 'horizontal') => {
  const rules = direction === 'vertical' ? SPACING_RULES.VERTICAL : SPACING_RULES.HORIZONTAL;
  
  const isBat1 = isBattery(type1);
  const isBat2 = isBattery(type2);
  
  if (isBat1 && isBat2) {
    return rules.BATTERY_TO_BATTERY;
  } else if ((isBat1 && !isBat2) || (!isBat1 && isBat2)) {
    return rules.BATTERY_TO_TRANSFORMER;
  } else {
    return rules.TRANSFORMER_TO_TRANSFORMER;
  }
};

const validateSpacing = (newUnit, placedUnits) => {
  const violations = [];
  
  placedUnits.forEach((existingUnit) => {
    const horizontalSpacing = getSpacing(newUnit.type, existingUnit.type, 'horizontal');
    const minHorizontalDistance = newUnit.width + existingUnit.width + horizontalSpacing;
    
    const horizontalDistance = Math.min(
      Math.abs(newUnit.x - (existingUnit.x + existingUnit.width)),
      Math.abs(existingUnit.x - (newUnit.x + newUnit.width))
    );
    
    const verticalSpacing = getSpacing(newUnit.type, existingUnit.type, 'vertical');
    const minVerticalDistance = newUnit.height + existingUnit.height + verticalSpacing;
    
    const verticalDistance = Math.min(
      Math.abs(newUnit.y - (existingUnit.y + existingUnit.height)),
      Math.abs(existingUnit.y - (newUnit.y + newUnit.height))
    );
    
    const sameRowRange = 2;
    const sameColumnRange = 2;
    
    const sameRow = Math.abs(newUnit.y - existingUnit.y) < sameRowRange;
    const sameColumn = Math.abs(newUnit.x - existingUnit.x) < sameColumnRange;
    
    if (sameRow && horizontalDistance < horizontalSpacing) {
      violations.push({
        type: 'HORIZONTAL_SPACING',
        unit: existingUnit.id,
        required: horizontalSpacing,
        actual: horizontalDistance
      });
    }
    
    if (sameColumn && verticalDistance < verticalSpacing) {
      violations.push({
        type: 'VERTICAL_SPACING',
        unit: existingUnit.id,
        required: verticalSpacing,
        actual: verticalDistance
      });
    }
  });
  
  return {
    isValid: violations.length === 0,
    violations
  };
};

const generateLayout = (quantities) => {
  const allItems = [];
  let totalCost = 0;
  let totalEnergy = 0;
  let batteryCount = 0;

  // 1. Flatten all battery quantities
  Object.keys(quantities).forEach((type) => {
    for (let i = 0; i < quantities[type]; i++) {
      const data = UNIT_DATA[type];
      const normalized = {
        ...data,
        type,
        width: data.width,
        height: data.height ?? data.length,
      };
      allItems.push(normalized);
      totalCost += data.cost;
      totalEnergy += data.energy;
      batteryCount++;
    }
  });

  // 2. Add required transformers (1 per 2 batteries)
  const transformerCount = Math.ceil(batteryCount / 2);
  for (let i = 0; i < transformerCount; i++) {
    const data = UNIT_DATA.TRANSFORMER;
    const normalized = {
      ...data,
      type: 'TRANSFORMER',
      width: data.width,
      height: data.height ?? data.length,
    };
    allItems.push(normalized);
    totalCost += data.cost;
    totalEnergy += data.energy;
  }

  // 3. Position units with spacing rules
  const MAX_WIDTH = 100;
  const positionedUnits = [];
  let currentX = 0;
  let currentY = 0;
  let maxHeightInRow = 0;
  let usedHeight = 0;

  allItems.forEach((device, index) => {
    // Create candidate unit
    const candidateUnit = {
      ...device,
      id: `${device.type}-${index}`,
      x: currentX,
      y: currentY,
    };

    // Check if unit fits within width constraint
    if (currentX + device.width > MAX_WIDTH) {
      // Move to next row
      currentX = 0;
      currentY += maxHeightInRow + SPACING_RULES.VERTICAL.DEFAULT;
      maxHeightInRow = 0;

      // Update candidate position
      candidateUnit.x = currentX;
      candidateUnit.y = currentY;
    }

    // Validate spacing against already-placed units
    const validation = validateSpacing(candidateUnit, positionedUnits);
    
    if (!validation.isValid) {
      // If validation fails, log violations but still place unit
      // (prioritize width constraint over spacing to avoid infinite loops)
      console.warn(`Spacing violations for ${candidateUnit.id}:`, validation.violations);
    }

    positionedUnits.push(candidateUnit);
    
    // Update horizontal position and row height
    currentX += device.width + SPACING_RULES.HORIZONTAL.DEFAULT;
    maxHeightInRow = Math.max(maxHeightInRow, device.height);
    usedHeight = Math.max(usedHeight, currentY + device.height);
  });

  return {
    units: positionedUnits,
    metrics: {
      totalCost,
      totalEnergy: Math.max(0, totalEnergy),
      landRequired: usedHeight * MAX_WIDTH,
      transformerCount,
      spacingRules: SPACING_RULES,
    },
  };
};

export default generateLayout;