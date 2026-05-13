import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { calcSalary } from '@/calc/tax/salary'
import { useCalculator } from '@/hooks/useCalculator'
import { useSettingsStore } from '@/store/index'
import { useNumericInput } from '@/hooks/useNumericInput'
import { formatKRW, formatPercent } from '@/lib/formatters'

export function SalaryCalc() {
  const { taxRates } = useSettingsStore()
  const salary = useNumericInput(50000000)

  const { result, calculate } = useCalculator(
    calcSalary,
    'salary',
    (_, res) => `연봉 ${formatKRW(res.annualGross)} → 월 실수령 ${formatKRW(res.monthlyNet)}`,
  )

  const handleCalc = () => {
    calculate({ annualSalary: salary.numericValue, rates: taxRates })
  }

  const rows = result
    ? [
        { label: '월 급여(세전)', value: formatKRW(result.monthlyGross) },
        { label: '국민연금', value: formatKRW(result.nationalPension) },
        { label: '건강보험', value: formatKRW(result.healthInsurance) },
        { label: '장기요양보험', value: formatKRW(result.longTermCare) },
        { label: '고용보험', value: formatKRW(result.employmentInsurance) },
        { label: '4대보험 합계', value: formatKRW(result.totalInsurance) },
        { label: '소득세', value: formatKRW(result.incomeTax) },
        { label: '지방소득세', value: formatKRW(result.localTax) },
        { label: '총 세금', value: formatKRW(result.totalTax) },
        { label: '월 실수령액', value: formatKRW(result.monthlyNet), highlight: true },
        { label: '연 실수령액', value: formatKRW(result.annualNet) },
        { label: '공제율', value: formatPercent(result.deductionRate, 1) },
      ]
    : []

  return (
    <CalculatorShell
      title="연봉 실수령액 계산기 (2026)"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>세전 연봉 (원)</Label>
              <Input className="mt-1" value={salary.value} onChange={salary.onChange} placeholder="50,000,000" />
            </div>
            <p className="text-xs text-muted-foreground">
              세율은 설정 → 세율 커스텀에서 변경할 수 있습니다.
            </p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCalc}>
              계산하기
            </Button>
          </CardContent>
        </Card>
      }
      result={
        result ? (
          <ResultBox rows={rows} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            연봉을 입력하고 계산하기를 누르세요
          </div>
        )
      }
    />
  )
}
