import { useState, useEffect } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { calcExchange } from '@/calc/finance/exchange'
import { useCalculator } from '@/hooks/useCalculator'
import { useSettingsStore } from '@/store/index'
import { useNumericInput } from '@/hooks/useNumericInput'
import { formatNumber } from '@/lib/formatters'
import type { FxRates } from '@/store/slices/settingsSlice'

type Currency = 'KRW' | keyof FxRates

const CURRENCY_LABELS: Record<Currency, string> = {
  KRW: '한국 원화 (KRW)',
  USD: '미국 달러 (USD)',
  JPY: '일본 엔화 (JPY)',
  EUR: '유로 (EUR)',
  CNY: '중국 위안 (CNY)',
  GBP: '영국 파운드 (GBP)',
  VND: '베트남 동 (VND)',
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  KRW: '₩', USD: '$', JPY: '¥', EUR: '€', CNY: '¥', GBP: '£', VND: '₫',
}

const CURRENCIES: Currency[] = ['KRW', 'USD', 'JPY', 'EUR', 'CNY', 'GBP', 'VND']

// Returns "how many to per 1 from" using stored KRW-based rates
function deriveRate(from: Currency, to: Currency, fxRates: FxRates): number {
  if (from === to) return 1
  const krwPerFrom = from === 'KRW' ? 1 : fxRates[from]
  const krwPerTo = to === 'KRW' ? 1 : fxRates[to]
  return krwPerFrom / krwPerTo
}

function formatAmount(amount: number, currency: Currency): string {
  if (currency === 'KRW') return formatNumber(amount, 0)
  if (currency === 'VND') return formatNumber(amount, 0)
  if (currency === 'JPY') return formatNumber(amount, 2)
  return formatNumber(amount, 4)
}

export function ExchangeCalc() {
  const { fxRates } = useSettingsStore()
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD')
  const [toCurrency, setToCurrency] = useState<Currency>('KRW')
  const [rate, setRate] = useState('')
  const amount = useNumericInput(100)

  // Recalculate rate when currencies or stored fxRates change
  useEffect(() => {
    const r = deriveRate(fromCurrency, toCurrency, fxRates)
    setRate(r >= 1 ? formatNumber(r, 2) : formatNumber(r, 6))
  }, [fromCurrency, toCurrency, fxRates])

  const { result, calculate } = useCalculator(
    calcExchange,
    'exchange',
    (_, res) => `${formatAmount(res.convertedAmount, toCurrency)} ${toCurrency}`,
  )

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleCalc = () => {
    calculate({ amount: amount.numericValue, rate: Number(rate.replace(/,/g, '')) })
  }

  const fromSym = CURRENCY_SYMBOLS[fromCurrency]
  const toSym = CURRENCY_SYMBOLS[toCurrency]

  const rows = result
    ? [
        {
          label: `${fromSym} ${amount.value} ${fromCurrency}`,
          value: `${toSym} ${formatAmount(result.convertedAmount, toCurrency)} ${toCurrency}`,
          highlight: true,
        },
        { label: `1 ${fromCurrency} =`, value: `${formatNumber(result.rate, 4)} ${toCurrency}` },
        { label: `1 ${toCurrency} =`, value: `${formatNumber(result.reverseRate, 4)} ${fromCurrency}` },
      ]
    : []

  return (
    <CalculatorShell
      title="환율 계산기"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>변환 전 통화</Label>
              <Select value={fromCurrency} onValueChange={(v: string | null) => { if (v) setFromCurrency(v as Currency) }}>
                <SelectTrigger className="mt-1">
                  <SelectValue>{CURRENCY_LABELS[fromCurrency]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>{CURRENCY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>금액</Label>
              <Input className="mt-1" value={amount.value} onChange={amount.onChange} placeholder="100" />
            </div>
            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={handleSwap} className="rounded-full">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label>변환 후 통화</Label>
              <Select value={toCurrency} onValueChange={(v: string | null) => { if (v) setToCurrency(v as Currency) }}>
                <SelectTrigger className="mt-1">
                  <SelectValue>{CURRENCY_LABELS[toCurrency]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>{CURRENCY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>환율 (1 {fromCurrency} = ? {toCurrency})</Label>
              <Input
                className="mt-1 font-mono"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                환율은 설정에서 통화별로 직접 수정할 수 있습니다.
              </p>
            </div>
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
            금액과 환율을 입력하고 계산하기를 누르세요
          </div>
        )
      }
    />
  )
}
