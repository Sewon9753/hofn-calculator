const FACTORS: Record<string, number> = {
  'm²': 1, 'km²': 1_000_000, 'cm²': 0.0001,
  '평': 3.30579, '坪': 3.30579,
  acre: 4046.86, hectare: 10000,
  'ft²': 0.092903, 'inch²': 0.00064516,
}

export const AREA_UNITS = Object.keys(FACTORS)

export function convertArea(value: number, from: string, to: string): number {
  return (value * FACTORS[from]) / FACTORS[to]
}
