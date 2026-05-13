export interface AcquisitionResult {
  acquisitionTax: number
  ruralSpecialTax: number
  localEducationTax: number
  totalTax: number
  taxRate: number
}

function getHouseAcquisitionRate(price: number, houseCount: number, region: 'regulated' | 'non-regulated'): number {
  if (houseCount === 1) {
    if (price <= 600_000_000) return 0.01
    if (price <= 900_000_000) return 0.01 + ((price - 600_000_000) / 300_000_000) * 0.02
    return 0.03
  }
  if (houseCount === 2) {
    return region === 'regulated' ? 0.08 : 0.03
  }
  return region === 'regulated' ? 0.12 : 0.08
}

export function calcAcquisitionTax(params: {
  price: number
  houseCount: number
  area: number
  region: 'regulated' | 'non-regulated'
}): AcquisitionResult {
  const { price, houseCount, area, region } = params
  const taxRate = getHouseAcquisitionRate(price, houseCount, region)
  const acquisitionTax = price * taxRate
  const ruralSpecialTax = area > 85 ? acquisitionTax * 0.1 : 0
  const localEducationTax = acquisitionTax * 0.2
  const totalTax = acquisitionTax + ruralSpecialTax + localEducationTax

  return {
    acquisitionTax: Math.round(acquisitionTax),
    ruralSpecialTax: Math.round(ruralSpecialTax),
    localEducationTax: Math.round(localEducationTax),
    totalTax: Math.round(totalTax),
    taxRate,
  }
}
