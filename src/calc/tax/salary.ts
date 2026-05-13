import type { TaxRates } from '@/store/slices/settingsSlice'

const NATIONAL_PENSION_CAP = 6_170_000

const INCOME_TAX_BRACKETS = [
  { limit: 12_000_000, rate: 0.06, deduction: 0 },
  { limit: 46_000_000, rate: 0.15, deduction: 1_080_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_220_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 14_900_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_400_000 },
  { limit: 500_000_000, rate: 0.40, deduction: 25_400_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_400_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_400_000 },
]

function calcLaborIncomeDeduction(gross: number): number {
  if (gross <= 5_000_000) return gross * 0.7
  if (gross <= 15_000_000) return 3_500_000 + (gross - 5_000_000) * 0.4
  if (gross <= 45_000_000) return 7_500_000 + (gross - 15_000_000) * 0.15
  if (gross <= 100_000_000) return 9_750_000 + (gross - 45_000_000) * 0.05
  return Math.min(12_250_000 + (gross - 100_000_000) * 0.02, 20_000_000)
}

function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      return taxableIncome * bracket.rate - bracket.deduction
    }
  }
  return 0
}

function calcLaborTaxCredit(incomeTax: number): number {
  if (incomeTax <= 1_300_000) return Math.min(incomeTax * 0.55, 660_000)
  return Math.min(715_000 - (incomeTax - 1_300_000) * 0.3, 660_000)
}

export interface SalaryResult {
  annualGross: number
  monthlyGross: number
  nationalPension: number
  healthInsurance: number
  longTermCare: number
  employmentInsurance: number
  totalInsurance: number
  incomeTax: number
  localTax: number
  totalTax: number
  monthlyNet: number
  annualNet: number
  deductionRate: number
}

export function calcSalary(params: {
  annualSalary: number
  rates: TaxRates
}): SalaryResult {
  const { annualSalary, rates } = params
  const monthlyGross = annualSalary / 12

  const nationalPension = Math.min(monthlyGross, NATIONAL_PENSION_CAP) * rates.nationalPension
  const healthInsurance = monthlyGross * rates.healthInsurance
  const longTermCare = healthInsurance * rates.longTermCare
  const employmentInsurance = monthlyGross * rates.employmentInsurance
  const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance
  const annualInsurance = totalInsurance * 12

  const laborDeduction = calcLaborIncomeDeduction(annualSalary)
  const laborIncome = annualSalary - laborDeduction
  const personalDeduction = 1_500_000
  const taxableIncome = Math.max(0, laborIncome - annualInsurance - personalDeduction)

  const grossIncomeTax = calcIncomeTax(taxableIncome)
  const taxCredit = calcLaborTaxCredit(grossIncomeTax)
  const annualIncomeTax = Math.max(0, grossIncomeTax - taxCredit)
  const annualLocalTax = annualIncomeTax * 0.1

  const incomeTax = annualIncomeTax / 12
  const localTax = annualLocalTax / 12
  const totalTax = incomeTax + localTax
  const monthlyNet = monthlyGross - totalInsurance - totalTax
  const annualNet = monthlyNet * 12
  const deductionRate = ((annualSalary - annualNet) / annualSalary) * 100

  return {
    annualGross: annualSalary,
    monthlyGross: Math.round(monthlyGross),
    nationalPension: Math.round(nationalPension),
    healthInsurance: Math.round(healthInsurance),
    longTermCare: Math.round(longTermCare),
    employmentInsurance: Math.round(employmentInsurance),
    totalInsurance: Math.round(totalInsurance),
    incomeTax: Math.round(incomeTax),
    localTax: Math.round(localTax),
    totalTax: Math.round(totalTax),
    monthlyNet: Math.round(monthlyNet),
    annualNet: Math.round(annualNet),
    deductionRate: Math.round(deductionRate * 10) / 10,
  }
}
