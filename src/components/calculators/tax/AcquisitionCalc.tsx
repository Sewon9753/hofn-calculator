import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { calcAcquisitionTax } from '@/calc/tax/acquisition'
import { useCalculator } from '@/hooks/useCalculator'
import { useNumericInput } from '@/hooks/useNumericInput'
import { formatKRW, formatPercent } from '@/lib/formatters'

type HouseCount = '1' | '2' | '3'
type Region = 'regulated' | 'non-regulated'

const HOUSE_LABELS: Record<HouseCount, string> = {
  '1': '1주택',
  '2': '2주택',
  '3': '3주택 이상',
}

const REGION_LABELS: Record<Region, string> = {
  regulated: '조정대상지역',
  'non-regulated': '비조정지역',
}

export function AcquisitionCalc() {
  const price = useNumericInput(500000000)
  const [houseCount, setHouseCount] = useState<HouseCount>('1')
  const area = useNumericInput(84)
  const [region, setRegion] = useState<Region>('regulated')

  const { result, calculate } = useCalculator(
    calcAcquisitionTax,
    'acquisition_tax',
    (_, res) => `취득세 ${formatKRW(res.totalTax)}`,
  )

  const rows = result
    ? [
        { label: `취득세율`, value: formatPercent(result.taxRate * 100, 1) },
        { label: '취득세', value: formatKRW(result.acquisitionTax) },
        { label: '농어촌특별세', value: formatKRW(result.ruralSpecialTax) },
        { label: '지방교육세', value: formatKRW(result.localEducationTax) },
        { label: '총 세금', value: formatKRW(result.totalTax), highlight: true },
      ]
    : []

  return (
    <CalculatorShell
      title="취득세 계산기"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>취득가액 (원)</Label>
              <Input className="mt-1" value={price.value} onChange={price.onChange} />
            </div>
            <div>
              <Label>취득 후 주택 수</Label>
              <Select value={houseCount} onValueChange={(v: string | null) => { if (v) setHouseCount(v as HouseCount) }}>
                <SelectTrigger className="mt-1"><SelectValue>{HOUSE_LABELS[houseCount]}</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1주택</SelectItem>
                  <SelectItem value="2">2주택</SelectItem>
                  <SelectItem value="3">3주택 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>전용면적 (㎡)</Label>
              <Input className="mt-1" value={area.value} onChange={area.onChange} placeholder="84" />
            </div>
            <div>
              <Label>지역</Label>
              <Select value={region} onValueChange={(v: string | null) => { if (v) setRegion(v as Region) }}>
                <SelectTrigger className="mt-1"><SelectValue>{REGION_LABELS[region]}</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="regulated">조정대상지역</SelectItem>
                  <SelectItem value="non-regulated">비조정지역</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => calculate({ price: price.numericValue, houseCount: Number(houseCount), area: area.numericValue, region })}>
              계산하기
            </Button>
          </CardContent>
        </Card>
      }
      result={result ? <ResultBox rows={rows} /> : <div className="flex items-center justify-center h-full text-muted-foreground text-sm">값을 입력하고 계산하기를 누르세요</div>}
    />
  )
}
