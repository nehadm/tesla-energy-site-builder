export const GRID_WIDTH_FEET = 100;
export const GRID_COLUMNS = 20;
export const GRID_ROWS = 10;

export const DEVICE_SPECS = [
  {
    type: 'Powerwall',
    widthFt: 4,
    heightFt: 2,
    cost: 11500,
    energyKwh: 13.5
  },
  {
    type: 'Megapack',
    widthFt: 8,
    heightFt: 3,
    cost: 250000,
    energyKwh: 3900
  },
  {
    type: 'Inverter',
    widthFt: 2,
    heightFt: 2,
    cost: 3200,
    energyKwh: 0
  }
];


export const DEVICES = {
  MEGAPACK_XL: { name: 'Megapack XL', width: 40, length: 10, energy: 4, cost: 120000 },
  MEGAPACK_2:  { name: 'Megapack 2',  width: 30, length: 10, energy: 3, cost: 80000 },
  MEGAPACK:    { name: 'Megapack',    width: 30, length: 10, energy: 2, cost: 50000 },
  POWERPACK:   { name: 'PowerPack',   width: 10, length: 10, energy: 1, cost: 10000 },
  TRANSFORMER: { name: 'Transformer', width: 10, length: 10, energy: -0.5, cost: 10000 }
};
