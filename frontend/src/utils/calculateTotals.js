import { DEVICES } from '../constants';

const calculateTotals = (quantities) => {
  let cost = 0;
  let energy = 0;
  let sqft = 0;
  let totalBatteries = 0;

  // 1. Calculate totals for selected batteries
  Object.entries(quantities).forEach(([type, count]) => {
    const spec = DEVICES[type];
    if (spec && count > 0) {
      cost += spec.cost * count;
      energy += spec.energy * count;
      sqft += (spec.width * spec.length) * count;
      totalBatteries += count;
    }
  });

  // 2. Requirement: 1 transformer per 2 industrial batteries
  const transformersNeeded = Math.ceil(totalBatteries / 2);
  
// 3. Add Transformer impact
const transformerSpec = DEVICES.TRANSFORMER;
if (transformerSpec) {
  cost += transformerSpec.cost * transformersNeeded;
  energy += (transformerSpec.energy || 0) * transformersNeeded; 
  sqft += (transformerSpec.width * transformerSpec.length) * transformersNeeded;
}
  return {
    cost,
    energy: Math.max(0, energy), // Ensure energy doesn't go negative
    sqft,
    totalBatteries,
    transformersNeeded
  };
};

export default calculateTotals;