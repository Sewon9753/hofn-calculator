export interface UnitPriceResult {
  pricePerUnit: number
  cheaper: 'a' | 'b' | 'equal'
  ratio: number
}

export function compareUnitPrice(params: {
  priceA: number
  quantityA: number
  priceB: number
  quantityB: number
}): UnitPriceResult & { pricePerUnitA: number; pricePerUnitB: number } {
  const { priceA, quantityA, priceB, quantityB } = params
  const pricePerUnitA = priceA / quantityA
  const pricePerUnitB = priceB / quantityB
  const cheaper = pricePerUnitA < pricePerUnitB ? 'a' : pricePerUnitA > pricePerUnitB ? 'b' : 'equal'
  const ratio = pricePerUnitA / pricePerUnitB
  return { pricePerUnit: Math.min(pricePerUnitA, pricePerUnitB), pricePerUnitA, pricePerUnitB, cheaper, ratio }
}
