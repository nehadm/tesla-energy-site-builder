import {
  getActualSpacing,
  getRequiredSpacing,
  getUnitBounds,
  unitsOverlap,
  validateLayoutSpacing
} from '../utils/spacingValidator';

describe('Spacing Validator', () => {
  
  describe('getUnitBounds', () => {
    it('should return correct bounding box', () => {
      const unit = { x: 10, y: 20, width: 30, height: 40 };
      const bounds = getUnitBounds(unit);
      
      expect(bounds.left).toBe(10);
      expect(bounds.right).toBe(40);
      expect(bounds.top).toBe(20);
      expect(bounds.bottom).toBe(60);
    });
  });

  describe('unitsOverlap', () => {
    it('should detect overlapping units', () => {
      const unit1 = { x: 0, y: 0, width: 10, height: 10 };
      const unit2 = { x: 5, y: 5, width: 10, height: 10 };
      
      expect(unitsOverlap(unit1, unit2)).toBe(true);
    });

    it('should detect non-overlapping units', () => {
      const unit1 = { x: 0, y: 0, width: 10, height: 10 };
      const unit2 = { x: 12, y: 0, width: 10, height: 10 };
      
      expect(unitsOverlap(unit1, unit2)).toBe(false);
    });

    it('should handle adjacent units (touching)', () => {
      const unit1 = { x: 0, y: 0, width: 10, height: 10 };
      const unit2 = { x: 10, y: 0, width: 10, height: 10 };
      
      expect(unitsOverlap(unit1, unit2)).toBe(false);
    });
  });

  describe('getRequiredSpacing', () => {
    it('should return correct spacing for battery-to-battery (horizontal)', () => {
      const spacing = getRequiredSpacing('MEGAPACK_XL', 'MEGAPACK_2', 'horizontal');
      expect(spacing).toBe(2);
    });

    it('should return correct spacing for battery-to-transformer (horizontal)', () => {
      const spacing = getRequiredSpacing('MEGAPACK_XL', 'TRANSFORMER', 'horizontal');
      expect(spacing).toBe(1.5);
    });

    it('should return correct spacing for transformer-to-transformer (vertical)', () => {
      const spacing = getRequiredSpacing('TRANSFORMER', 'TRANSFORMER', 'vertical');
      expect(spacing).toBe(1.5);
    });
  });

  describe('getActualSpacing', () => {
    it('should calculate horizontal gap correctly', () => {
      const unit1 = { x: 0, y: 0, width: 20, height: 10 };
      const unit2 = { x: 22, y: 0, width: 15, height: 10 };
      
      const spacing = getActualSpacing(unit1, unit2);
      expect(spacing.horizontalGap).toBe(2); // 22 - (0 + 20) = 2
    });

    it('should detect negative gap (overlap)', () => {
      const unit1 = { x: 0, y: 0, width: 20, height: 10 };
      const unit2 = { x: 15, y: 0, width: 15, height: 10 };
      
      const spacing = getActualSpacing(unit1, unit2);
      expect(spacing.horizontalGap).toBeLessThan(0); // Overlapping
    });

    it('should calculate vertical spacing correctly', () => {
      const unit1 = { x: 0, y: 0, width: 10, height: 15 };
      const unit2 = { x: 0, y: 18, width: 10, height: 10 };
      
      const spacing = getActualSpacing(unit1, unit2);
      expect(spacing.verticalGap).toBe(3); // 18 - (0 + 15) = 3
    });
  });

  describe('validateLayoutSpacing', () => {
    it('should validate layout with no violations', () => {
      const layout = [
        { id: 'b1', type: 'MEGAPACK_XL', x: 0, y: 0, width: 20, height: 10 },
        { id: 'b2', type: 'MEGAPACK_XL', x: 22, y: 0, width: 20, height: 10 }
      ];
      
      const validation = validateLayoutSpacing(layout);
      expect(validation.isValid).toBe(true);
      expect(validation.violations.length).toBe(0);
    });

    it('should detect overlapping units as CRITICAL', () => {
      const layout = [
        { id: 'b1', type: 'MEGAPACK_XL', x: 0, y: 0, width: 20, height: 10 },
        { id: 'b2', type: 'MEGAPACK_XL', x: 10, y: 0, width: 20, height: 10 }
      ];
      
      const validation = validateLayoutSpacing(layout);
      expect(validation.isValid).toBe(false);
      
      const criticalViolations = validation.violations.filter(v => v.severity === 'CRITICAL');
      expect(criticalViolations.length).toBeGreaterThan(0);
    });

    it('should detect insufficient spacing as WARNING', () => {
      const layout = [
        { id: 'b1', type: 'MEGAPACK_XL', x: 0, y: 0, width: 20, height: 10 },
        { id: 'b2', type: 'MEGAPACK_XL', x: 21, y: 0, width: 20, height: 10 } // Only 1ft spacing, need 2ft
      ];
      
      const validation = validateLayoutSpacing(layout);
      expect(validation.violations.length).toBeGreaterThan(0);
      
      const warnings = validation.violations.filter(v => v.severity === 'WARNING');
      expect(warnings.length).toBeGreaterThan(0);
    });

    it('should provide summary counts', () => {
      const layout = [
        { id: 'b1', type: 'MEGAPACK_XL', x: 0, y: 0, width: 20, height: 10 },
        { id: 'b2', type: 'MEGAPACK_XL', x: 10, y: 0, width: 20, height: 10 }
      ];
      
      const validation = validateLayoutSpacing(layout);
      expect(validation.summary).toHaveProperty('total');
      expect(validation.summary).toHaveProperty('critical');
      expect(validation.summary).toHaveProperty('warnings');
    });
  });
});

describe('Tesla Energy Site Builder v1.0.0 Configuration', () => {
  it('should validate spacing for 2 XL + 2 2s + 1 PP layout', () => {
    const layout = [
      { id: 'MPX-0', type: 'MEGAPACK_XL', x: 0, y: 0, width: 40, height: 10 },
      { id: 'MPX-1', type: 'MEGAPACK_XL', x: 42, y: 0, width: 40, height: 10 },
      
      { id: 'MP2-0', type: 'MEGAPACK_2', x: 0, y: 12, width: 30, height: 10 },
      { id: 'MP2-1', type: 'MEGAPACK_2', x: 32, y: 12, width: 30, height: 10 },
      
      { id: 'PP-0', type: 'POWERPACK', x: 0, y: 24, width: 10, height: 10 },
      { id: 'T-0', type: 'TRANSFORMER', x: 12, y: 24, width: 10, height: 10 },
      { id: 'T-1', type: 'TRANSFORMER', x: 24, y: 24, width: 10, height: 10 },
    ];
    
    const validation = validateLayoutSpacing(layout);
    
    const criticals = validation.violations.filter(v => v.severity === 'CRITICAL');
    expect(criticals.length).toBe(0); // No overlaps
  });
});
