import { useUiStore } from '@/store/index'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { DdayPage } from '@/components/dday/DdayPage'
import { HistoryPage } from '@/components/history/HistoryPage'
import { SettingsPage } from '@/components/settings/SettingsPage'
import { SavingsCalc } from '@/components/calculators/finance/SavingsCalc'
import { LoanCalc } from '@/components/calculators/finance/LoanCalc'
import { InvestmentCalc } from '@/components/calculators/finance/InvestmentCalc'
import { SalaryCalc } from '@/components/calculators/tax/SalaryCalc'
import { VatCalc } from '@/components/calculators/tax/VatCalc'
import { AcquisitionCalc } from '@/components/calculators/tax/AcquisitionCalc'
import { UnitConvertCalc } from '@/components/calculators/unit/UnitConvertCalc'
import { ArithmeticCalc } from '@/components/calculators/basic/ArithmeticCalc'
import { ExchangeCalc } from '@/components/calculators/finance/ExchangeCalc'
import { CalculatorListPage } from './CalculatorListPage'

const CALC_MAP: Record<string, React.ComponentType> = {
  savings: SavingsCalc,
  loan: LoanCalc,
  investment: InvestmentCalc,
  exchange: ExchangeCalc,
  salary: SalaryCalc,
  vat: VatCalc,
  acquisition: AcquisitionCalc,
  unit: UnitConvertCalc,
  arithmetic: ArithmeticCalc,
}

export function Router() {
  const { currentPage, activeCalculator } = useUiStore()

  if (currentPage === 'calculator') {
    if (activeCalculator && CALC_MAP[activeCalculator]) {
      const Calc = CALC_MAP[activeCalculator]
      return <Calc />
    }
    return <CalculatorListPage />
  }

  const PAGE_MAP: Record<string, React.ComponentType> = {
    dashboard: DashboardPage,
    dday: DdayPage,
    history: HistoryPage,
    settings: SettingsPage,
  }

  const Page = PAGE_MAP[currentPage] ?? DashboardPage
  return <Page />
}
