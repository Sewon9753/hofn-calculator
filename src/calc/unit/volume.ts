const FACTORS: Record<string, number> = {
  mL: 0.001, L: 1, 'cc(mL)': 0.001,
  cup: 0.2, 갤런: 3.78541, 파인트: 0.473176,
  'fl.oz': 0.0295735, 'm³': 1000,
}

export const VOLUME_UNITS = Object.keys(FACTORS)

export function convertVolume(value: number, from: string, to: string): number {
  return (value * FACTORS[from]) / FACTORS[to]
}
