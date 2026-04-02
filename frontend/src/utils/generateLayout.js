// import { DEVICES } from '../constants';

// const generateLayout = (selectedBatteries) => {
//   const layout = [];
//   let currentX = 0;
//   let currentY = 0;
//   const MAX_WIDTH = 100;
  
//   const allItems = [];
//   for (let i = 0; i < selectedBatteries.length; i += 2) {
//     allItems.push(selectedBatteries[i]);
//     if (selectedBatteries[i + 1]) {
//         allItems.push(selectedBatteries[i + 1]);
//     }
    
//     allItems.push({ ...DEVICES.TRANSFORMER, type: 'TRANSFORMER' });
//   }

//   let maxHeightInRow = 0;

//   allItems.forEach((device) => {
//     if (currentX + device.width > MAX_WIDTH) {
//       currentX = 0;
//       currentY += maxHeightInRow;
//       maxHeightInRow = 0;
//     }

//     layout.push({ 
//       ...device, 
//       x: currentX, 
//       y: currentY 
//     });

//     currentX += device.width;

//     maxHeightInRow = Math.max(maxHeightInRow, device.length);
//   });

//   return layout;
// };

// export default generateLayout;


/**
 * Tesla Energy Site Builder - Layout Logic
 * Logic to handle battery placement and mandatory transformer ratios.
 */

const UNIT_DIMENSIONS = {
    MEGAPACK_XL: { width: 40, height: 10, energy: 3.9, cost: 120000 },
    MEGAPACK_2:  { width: 30, height: 10, energy: 2.8, cost: 80000  },
    MEGAPACK:    { width: 20, height: 10, energy: 1.9, cost: 50000  },
    POWERPACK:   { width: 10, height: 10, energy: 0.2, cost: 10000  },
    TRANSFORMER: { width: 10, height: 10, energy: 0,   cost: 10000  }
  };
  
const generateLayout = (quantities) => {
let layout = [];
let totalCost = 0;
let totalEnergy = 0;
let totalBatteries = 0;

Object.keys(quantities).forEach((type) => {
    const count = quantities[type];
    const dim = UNIT_DIMENSIONS[type];
    
    for (let i = 0; i < count; i++) {
    layout.push({
        id: `${type}-${i}`,
        type: type,
        width: dim.width,
        height: dim.height,
        color: type === 'POWERPACK' ? '#E3E3E3' : '#FFFFFF'
    });
    totalCost += dim.cost;
    totalEnergy += dim.energy;
    totalBatteries += 1;
    }
});

const transformerCount = Math.ceil(totalBatteries / 2);
const transDim = UNIT_DIMENSIONS.TRANSFORMER;

for (let i = 0; i < transformerCount; i++) {
    layout.push({
    id: `TRANSFORMER-${i}`,
    type: 'TRANSFORMER',
    width: transDim.width,
    height: transDim.height,
    color: '#3E6AE1'
    });
    totalCost += transDim.cost;
}

let currentX = 0;
let currentY = 0;
const MAX_WIDTH = 100;

const positionedLayout = layout.map((unit) => {
    if (currentX + unit.width > MAX_WIDTH) {
    currentX = 0;
    currentY += 15;
    }

    const position = {
    ...unit,
    x: currentX,
    y: currentY
    };

    currentX += unit.width + 2; 
    return position;
});

const landRequired = (currentY + 10) * MAX_WIDTH;

return {
    units: positionedLayout,
    metrics: {
    totalCost,
    totalEnergy: parseFloat(totalEnergy.toFixed(1)),
    landRequired,
    transformerCount
    }
};
};

export default generateLayout;
