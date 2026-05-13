const FACTORS: Record<string, number> = {
  mg: 0.001, g: 1, kg: 1000, ton: 1_000_000,
  lb: 453.592, oz: 28.3495, '근(한국)': 600, '근(중국)': 500,
}

export const WEIGHT_UNITS = Object.keys(FACTORS)

export function convertWeight(value: number, from: string, to: string): number {
  return (value * FACTORS[from]) / FACTORS[to]
}
