import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { calcVat } from '@/calc/tax/vat'
import { useCalculator } from '@/hooks/useCalculator'
import { useNumericInput } from '@/hooks/useNumericInput'
import { formatKRW } from '@/lib/formatters'

type Mode = 'add' | 'extract'

const MODE_LABELS: Record<Mode, string> = {
  add: '부가세 별도 → 소비자가 계산',
  extract: '소비자가 → 공급가 역산',
}

export function VatCalc() {
  const amount = useNumericInput(1000000)
  const [mode, setMode] = useState<Mode>('add')

  const { result, calculate } = useCalculator(
    calcVat,
    'vat',
    (input, res) => `부가세 ${input.mode === 'add' ? '추가' : '역산'}: ${formatKRW(res.vatAmount)}`,
  )

  const rows = result
    ? [
        { label: '공급가액', value: formatKRW(result.supplyAmount) },
        { label: '부가세(10%)', value: formatKRW(result.vatAmount), highlight: true },
        { label: '합계(소비자가)', value: formatKRW(result.totalAmount) },
      ]
    : []

  return (
    <CalculatorShell
      title="부가세 계산기"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>계산 방식</Label>
              <Select value={mode} onValueChange={(v: string | null) => { if (v) setMode(v as Mode) }}>
                <SelectTrigger className="mt-1">
                  <SelectValue>{MODE_LABELS[mode]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">부가세 별도 → 소비자가 계산</SelectItem>
                  <SelectItem value="extract">소비자가 → 공급가 역산</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{mode === 'add' ? '공급가액 (원)' : '소비자가 (원)'}</Label>
              <Input className="mt-1" value={amount.value} onChange={amount.onChange} />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => calculate({ amount: amount.numericValue, mode })}>
              계산하기
            </Button>
          </CardContent>
        </Card>
      }
      result={result ? <ResultBox rows={rows} /> : <div className="flex items-center justify-center h-full text-muted-foreground text-sm">값을 입력하고 계산하기를 누르세요</div>}
    />
  )
}
