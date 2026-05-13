import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { compareUnitPrice } from '@/calc/basic/arithmetic'
import { useNumericInput } from '@/hooks/useNumericInput'
import { formatNumber } from '@/lib/formatters'

export function ArithmeticCalc() {
  const priceA = useNumericInput(1000)
  const quantityA = useNumericInput(100)
  const priceB = useNumericInput(1500)
  const quantityB = useNumericInput(200)
  const [result, setResult] = useState<ReturnType<typeof compareUnitPrice> | null>(null)

  const handleCalc = () => {
    setResult(compareUnitPrice({
      priceA: priceA.numericValue,
      quantityA: quantityA.numericValue,
      priceB: priceB.numericValue,
      quantityB: quantityB.numericValue,
    }))
  }

  const rows = result
    ? [
        { label: '상품 A 단가', value: `${formatNumber(result.pricePerUnitA, 2)}원/단위` },
        { label: '상품 B 단가', value: `${formatNumber(result.pricePerUnitB, 2)}원/단위` },
        {
          label: '더 저렴한 상품',
          value: result.cheaper === 'equal' ? '동일' : result.cheaper === 'a' ? '상품 A' : '상품 B',
          highlight: true,
        },
        { label: '가격 비율 (A/B)', value: `${formatNumber(result.ratio, 4)}배` },
      ]
    : []

  return (
    <CalculatorShell
      title="단가 비교 계산기"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <p className="text-sm font-medium">상품 A</p>
            <div>
              <Label>가격 (원)</Label>
              <Input className="mt-1" value={priceA.value} onChange={priceA.onChange} />
            </div>
            <div>
              <Label>용량/수량</Label>
              <Input className="mt-1" value={quantityA.value} onChange={quantityA.onChange} />
            </div>
            <p className="text-sm font-medium pt-2">상품 B</p>
            <div>
              <Label>가격 (원)</Label>
              <Input className="mt-1" value={priceB.value} onChange={priceB.onChange} />
            </div>
            <div>
              <Label>용량/수량</Label>
              <Input className="mt-1" value={quantityB.value} onChange={quantityB.onChange} />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCalc}>
              비교하기
            </Button>
          </CardContent>
        </Card>
      }
      result={result ? <ResultBox rows={rows} /> : <div className="flex items-center justify-center h-full text-muted-foreground text-sm">값을 입력하고 비교하기를 누르세요</div>}
    />
  )
}
