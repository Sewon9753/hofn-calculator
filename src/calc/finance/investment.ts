export interface InvestmentResult {
  buyTotal: number
  buyFee: number
  sellTotal: number
  sellFee: number
  profitLoss: number
  returnRate: number
}

export function calcInvestmentReturn(params: {
  buyPrice: number
  sellPrice: number
  quantity: number
  buyFeeRate: number
  sellFeeRate: number
}): InvestmentResult {
  const { buyPrice, sellPrice, quantity, buyFeeRate, sellFeeRate } = params
  const buyBase = buyPrice * quantity
  const sellBase = sellPrice * quantity
  const buyFee = buyBase * buyFeeRate
  const sellFee = sellBase * sellFeeRate
  const buyTotal = buyBase + buyFee
  const sellTotal = sellBase - sellFee
  const profitLoss = sellTotal - buyTotal
  const returnRate = (profitLoss / buyTotal) * 100

  return { buyTotal, buyFee, sellTotal, sellFee, profitLoss, returnRate }
}
