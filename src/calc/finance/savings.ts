const INTEREST_TAX_RATE = 0.154

export interface DepositResult {
  principal: number
  grossInterest: number
  taxAmount: number
  netInterest: number
  maturityAmount: number
  effectiveRate: number
}

export interface SavingResult extends DepositResult {
  totalPaid: number
}

export function calcSimpleDeposit(params: {
  principal: number
  annualRate: number
  months: number
}): DepositResult {
  const { principal, annualRate, months } = params
  const years = months / 12
  const grossInterest = principal * annualRate * years
  const taxAmount = grossInterest * INTEREST_TAX_RATE
  const netInterest = grossInterest - taxAmount
  const maturityAmount = principal + netInterest
  const effectiveRate = annualRate * (1 - INTEREST_TAX_RATE)
  return { principal, grossInterest, taxAmount, netInterest, maturityAmount, effectiveRate }
}

export function calcCompoundDeposit(params: {
  principal: number
  annualRate: number
  months: number
  compoundFreq: 1 | 12 | 365
}): DepositResult {
  const { principal, annualRate, months, compoundFreq } = params
  const t = months / 12
  const n = compoundFreq
  const r = annualRate
  const maturityGross = principal * Math.pow(1 + r / n, n * t)
  const grossInterest = maturityGross - principal
  const taxAmount = grossInterest * INTEREST_TAX_RATE
  const netInterest = grossInterest - taxAmount
  const maturityAmount = principal + netInterest
  const effectiveRate = Math.pow(maturityAmount / principal, 1 / t) - 1
  return { principal, grossInterest, taxAmount, netInterest, maturityAmount, effectiveRate }
}

export function calcInstallmentSaving(params: {
  monthlyPayment: number
  annualRate: number
  months: number
  isCompound: boolean
}): SavingResult {
  const { monthlyPayment, annualRate, months, isCompound } = params
  const r = annualRate / 12
  let maturityGross = 0

  if (isCompound) {
    for (let i = 1; i <= months; i++) {
      maturityGross += monthlyPayment * Math.pow(1 + r, months - i + 1)
    }
  } else {
    for (let i = 1; i <= months; i++) {
      maturityGross += monthlyPayment * (1 + r * (months - i + 1) / 12)
    }
  }

  const totalPaid = monthlyPayment * months
  const grossInterest = maturityGross - totalPaid
  const taxAmount = grossInterest * INTEREST_TAX_RATE
  const netInterest = grossInterest - taxAmount
  const maturityAmount = totalPaid + netInterest

  return { principal: totalPaid, grossInterest, taxAmount, netInterest, maturityAmount, effectiveRate: annualRate * (1 - INTEREST_TAX_RATE), totalPaid }
}
