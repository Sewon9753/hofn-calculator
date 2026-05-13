export interface MonthlyPayment {
  month: number
  payment: number
  principal: number
  interest: number
  remaining: number
}

export interface LoanResult {
  monthlyPayments: MonthlyPayment[]
  totalPayment: number
  totalInterest: number
  firstMonthPayment: number
}

export interface LoanParams {
  principal: number
  annualRate: number
  months: number
}

export function calcEqualPayment(params: LoanParams): LoanResult {
  const { principal, annualRate, months } = params
  const r = annualRate / 12
  const payment = r === 0
    ? principal / months
    : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)

  const monthlyPayments: MonthlyPayment[] = []
  let remaining = principal

  for (let i = 1; i <= months; i++) {
    const interest = remaining * r
    const princ = payment - interest
    remaining -= princ
    monthlyPayments.push({
      month: i,
      payment: Math.round(payment),
      principal: Math.round(princ),
      interest: Math.round(interest),
      remaining: Math.max(0, Math.round(remaining)),
    })
  }

  const totalPayment = Math.round(payment) * months
  const totalInterest = totalPayment - principal

  return { monthlyPayments, totalPayment, totalInterest, firstMonthPayment: Math.round(payment) }
}

export function calcEqualPrincipal(params: LoanParams): LoanResult {
  const { principal, annualRate, months } = params
  const r = annualRate / 12
  const principalPerMonth = principal / months
  const monthlyPayments: MonthlyPayment[] = []
  let totalPayment = 0

  for (let i = 1; i <= months; i++) {
    const remaining_before = principal - principalPerMonth * (i - 1)
    const interest = remaining_before * r
    const payment = principalPerMonth + interest
    totalPayment += payment
    monthlyPayments.push({
      month: i,
      payment: Math.round(payment),
      principal: Math.round(principalPerMonth),
      interest: Math.round(interest),
      remaining: Math.max(0, Math.round(principal - principalPerMonth * i)),
    })
  }

  const totalInterest = totalPayment - principal
  return {
    monthlyPayments,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    firstMonthPayment: monthlyPayments[0].payment,
  }
}

export function calcBulletPayment(params: LoanParams): LoanResult {
  const { principal, annualRate, months } = params
  const r = annualRate / 12
  const monthlyInterest = Math.round(principal * r)
  const monthlyPayments: MonthlyPayment[] = []

  for (let i = 1; i <= months; i++) {
    const isLast = i === months
    monthlyPayments.push({
      month: i,
      payment: isLast ? monthlyInterest + principal : monthlyInterest,
      principal: isLast ? principal : 0,
      interest: monthlyInterest,
      remaining: isLast ? 0 : principal,
    })
  }

  const totalInterest = monthlyInterest * months
  const totalPayment = principal + totalInterest

  return { monthlyPayments, totalPayment, totalInterest, firstMonthPayment: monthlyInterest }
}
