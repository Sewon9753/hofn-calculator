import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { convertLength, LENGTH_UNITS } from '@/calc/unit/length'
import { convertArea, AREA_UNITS } from '@/calc/unit/area'
import { convertWeight, WEIGHT_UNITS } from '@/calc/unit/weight'
import { convertVolume, VOLUME_UNITS } from '@/calc/unit/volume'
import { formatNumber } from '@/lib/formatters'

type Category = 'length' | 'area' | 'weight' | 'volume'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'length', label: '길이' },
  { value: 'area', label: '넓이' },
  { value: 'weight', label: '무게' },
  { value: 'volume', label: '부피' },
]

const UNITS: Record<Category, string[]> = {
  length: LENGTH_UNITS,
  area: AREA_UNITS,
  weight: WEIGHT_UNITS,
  volume: VOLUME_UNITS,
}

const CONVERTERS: Record<Category, (v: number, f: string, t: string) => number> = {
  length: convertLength,
  area: convertArea,
  weight: convertWeight,
  volume: convertVolume,
}

export function UnitConvertCalc() {
  const [category, setCategory] = useState<Category>('length')
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState(UNITS.length[0])
  const [toUnit, setToUnit] = useState(UNITS.length[2])

  const units = UNITS[category]
  const converter = CONVERTERS[category]

  const handleCategory = (cat: Category) => {
    setCategory(cat)
    setFromUnit(UNITS[cat][0])
    setToUnit(UNITS[cat][1])
  }

  const numVal = Number(value) || 0
  const converted = fromUnit && toUnit ? converter(numVal, fromUnit, toUnit) : 0

  const rows = [
    { label: `${numVal} ${fromUnit}`, value: `${formatNumber(converted, 6)} ${toUnit}`, highlight: true },
  ]

  const currentCategoryLabel = CATEGORIES.find(c => c.value === category)?.label ?? category

  return (
    <CalculatorShell
      title="단위 변환기"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>카테고리</Label>
              <Select value={category} onValueChange={(v: string | null) => { if (v) handleCategory(v as Category) }}>
                <SelectTrigger className="mt-1"><SelectValue>{currentCategoryLabel}</SelectValue></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>값</Label>
              <Input className="mt-1" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div>
              <Label>변환 전</Label>
              <Select value={fromUnit} onValueChange={(v: string | null) => { if (v) setFromUnit(v) }}>
                <SelectTrigger className="mt-1"><SelectValue>{fromUnit}</SelectValue></SelectTrigger>
                <SelectContent>
                  {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>변환 후</Label>
              <Select value={toUnit} onValueChange={(v: string | null) => { if (v) setToUnit(v) }}>
                <SelectTrigger className="mt-1"><SelectValue>{toUnit}</SelectValue></SelectTrigger>
                <SelectContent>
                  {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      }
      result={<ResultBox title="변환 결과" rows={rows} />}
    />
  )
}
