export interface VatResult {
  supplyAmount: number
  vatAmount: number
  totalAmount: number
}

export function calcVat(params: { amount: number; mode: 'add' | 'extract' }): VatResult {
  const { amount, mode } = params
  if (mode === 'add') {
    const vatAmount = amount * 0.1
    return { supplyAmount: amount, vatAmount, totalAmount: amount + vatAmount }
  } else {
    const supplyAmount = amount / 1.1
    const vatAmount = amount - supplyAmount
    return { supplyAmount, vatAmount, totalAmount: amount }
  }
}
