import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { calcInvestmentReturn } from '@/calc/finance/investment'
import { useCalculator } from '@/hooks/useCalculator'
import { useNumericInput } from '@/hooks/useNumericInput'
import { formatKRW, formatPercent } from '@/lib/formatters'

export function InvestmentCalc() {
  const buyPrice = useNumericInput(50000)
  const sellPrice = useNumericInput(60000)
  const quantity = useNumericInput(100)
  const [buyFee, setBuyFee] = useState('0.015')
  const [sellFee, setSellFee] = useState('0.015')

  const { result, calculate } = useCalculator(
    calcInvestmentReturn,
    'investment_return',
    (_, res) => `수익률 ${formatPercent(res.returnRate)} / ${res.profitLoss >= 0 ? '+' : ''}${formatKRW(res.profitLoss)}`,
  )

  const handleCalc = () => {
    calculate({
      buyPrice: buyPrice.numericValue,
      sellPrice: sellPrice.numericValue,
      quantity: quantity.numericValue,
      buyFeeRate: Number(buyFee) / 100,
      sellFeeRate: Number(sellFee) / 100,
    })
  }

  const rows = result
    ? [
        { label: '매수 총액(수수료 포함)', value: formatKRW(result.buyTotal) },
        { label: '매수 수수료', value: formatKRW(result.buyFee) },
        { label: '매도 총액(수수료 차감)', value: formatKRW(result.sellTotal) },
        { label: '매도 수수료', value: formatKRW(result.sellFee) },
        { label: '손익', value: `${result.profitLoss >= 0 ? '+' : ''}${formatKRW(result.profitLoss)}`, highlight: true },
        { label: '수익률', value: formatPercent(result.returnRate), highlight: false },
      ]
    : []

  return (
    <CalculatorShell
      title="투자 수익률 계산기"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>매수가 (원/주)</Label>
              <Input className="mt-1" value={buyPrice.value} onChange={buyPrice.onChange} />
            </div>
            <div>
              <Label>매도가 (원/주)</Label>
              <Input className="mt-1" value={sellPrice.value} onChange={sellPrice.onChange} />
            </div>
            <div>
              <Label>수량</Label>
              <Input className="mt-1" value={quantity.value} onChange={quantity.onChange} />
            </div>
            <div>
              <Label>매수 수수료율 (%)</Label>
              <Input className="mt-1" value={buyFee} onChange={(e) => setBuyFee(e.target.value)} placeholder="0.015" />
            </div>
            <div>
              <Label>매도 수수료율 (%)</Label>
              <Input className="mt-1" value={sellFee} onChange={(e) => setSellFee(e.target.value)} placeholder="0.015" />
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
            값을 입력하고 계산하기를 누르세요
          </div>
        )
      }
    />
  )
}
