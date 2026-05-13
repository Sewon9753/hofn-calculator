import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { calcCompoundDeposit, calcSimpleDeposit, calcInstallmentSaving } from '@/calc/finance/savings'
import { useCalculator } from '@/hooks/useCalculator'
import { useNumericInput } from '@/hooks/useNumericInput'
import { formatKRW, formatPercent } from '@/lib/formatters'

type Mode = 'simple' | 'compound' | 'installment'
type Freq = '1' | '12' | '365'

const MODE_LABELS: Record<Mode, string> = {
  simple: '예금 (단리)',
  compound: '예금 (복리)',
  installment: '적금 (복리)',
}

const FREQ_LABELS: Record<Freq, string> = {
  '12': '월복리',
  '1': '연복리',
  '365': '일복리',
}

export function SavingsCalc() {
  const [mode, setMode] = useState<Mode>('compound')
  const principal = useNumericInput(10000000)
  const [rate, setRate] = useState('3.5')
  const months = useNumericInput(12)
  const [freq, setFreq] = useState<Freq>('12')

  const { result, calculate } = useCalculator(
    (input: { mode: Mode; principal: number; rate: number; months: number; freq: 1 | 12 | 365 }) => {
      if (input.mode === 'simple') return calcSimpleDeposit({ principal: input.principal, annualRate: input.rate / 100, months: input.months })
      if (input.mode === 'compound') return calcCompoundDeposit({ principal: input.principal, annualRate: input.rate / 100, months: input.months, compoundFreq: input.freq })
      return calcInstallmentSaving({ monthlyPayment: input.principal, annualRate: input.rate / 100, months: input.months, isCompound: true })
    },
    `savings_${mode}`,
    (_, res) => `${formatKRW(res.maturityAmount)} 수령`,
  )

  const handleCalc = () => {
    calculate({
      mode,
      principal: principal.numericValue,
      rate: Number(rate),
      months: months.numericValue,
      freq: Number(freq) as 1 | 12 | 365,
    })
  }

  const rows = result
    ? [
        { label: mode === 'installment' ? '총 납입액' : '원금', value: formatKRW(result.principal) },
        { label: '총 이자(세전)', value: formatKRW(result.grossInterest) },
        { label: '이자소득세(15.4%)', value: formatKRW(result.taxAmount) },
        { label: '세후 이자', value: formatKRW(result.netInterest) },
        { label: '세후 만기 수령액', value: formatKRW(result.maturityAmount), rawValue: String(Math.round(result.maturityAmount)), highlight: true },
        { label: '세후 실효 연이율', value: formatPercent(result.effectiveRate * 100) },
      ]
    : []

  return (
    <CalculatorShell
      title="예·적금 계산기"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>유형</Label>
              <Select value={mode} onValueChange={(v: string | null) => { if (v) setMode(v as Mode) }}>
                <SelectTrigger className="mt-1">
                  <SelectValue>{MODE_LABELS[mode]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">예금 (단리)</SelectItem>
                  <SelectItem value="compound">예금 (복리)</SelectItem>
                  <SelectItem value="installment">적금 (복리)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{mode === 'installment' ? '월 납입액 (원)' : '원금 (원)'}</Label>
              <Input className="mt-1" value={principal.value} onChange={principal.onChange} placeholder="10,000,000" />
            </div>
            <div>
              <Label>연이율 (%)</Label>
              <Input className="mt-1" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="3.5" />
            </div>
            <div>
              <Label>기간 (개월)</Label>
              <Input className="mt-1" value={months.value} onChange={months.onChange} placeholder="12" />
            </div>
            {mode === 'compound' && (
              <div>
                <Label>복리 주기</Label>
                <Select value={freq} onValueChange={(v: string | null) => { if (v) setFreq(v as Freq) }}>
                  <SelectTrigger className="mt-1">
                    <SelectValue>{FREQ_LABELS[freq]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">월복리</SelectItem>
                    <SelectItem value="1">연복리</SelectItem>
                    <SelectItem value="365">일복리</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
            값을 입력하고 계산하기를 누르세요
          </div>
        )
      }
    />
  )
}
