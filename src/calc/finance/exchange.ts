export interface ExchangeInput {
  amount: number
  rate: number
}

export interface ExchangeResult {
  convertedAmount: number
  reverseRate: number
  rate: number
}

export function calcExchange({ amount, rate }: ExchangeInput): ExchangeResult {
  return {
    convertedAmount: amount * rate,
    reverseRate: rate !== 0 ? 1 / rate : 0,
    rate,
  }
}
