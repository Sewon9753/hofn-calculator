const FACTORS: Record<string, number> = {
  mm: 0.001, cm: 0.01, m: 1, km: 1000,
  inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.344,
  pyeong: 3.305785,
}

export const LENGTH_UNITS = Object.keys(FACTORS)

export function convertLength(value: number, from: string, to: string): number {
  return (value * FACTORS[from]) / FACTORS[to]
}
