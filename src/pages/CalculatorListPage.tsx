import { ArrowLeftRight, Calculator, Home, Percent, Receipt, Scale, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUiStore } from '@/store/index'

const CALCULATORS = [
  { id: 'savings', label: '예·적금 계산기', icon: TrendingUp, desc: '단리·복리·적금 이자 계산', category: 'finance' },
  { id: 'loan', label: '대출 이자 계산기', icon: Calculator, desc: '원리금균등·원금균등·만기일시', category: 'finance' },
  { id: 'investment', label: '투자 수익률', icon: Percent, desc: '매수·매도가, 수수료 포함', category: 'finance' },
  { id: 'exchange', label: '환율 계산기', icon: ArrowLeftRight, desc: 'KRW·USD·JPY·EUR·CNY·GBP', category: 'finance' },
  { id: 'salary', label: '연봉 실수령액', icon: Receipt, desc: '2026 4대보험 + 소득세 적용', category: 'tax' },
  { id: 'vat', label: '부가세 계산기', icon: Receipt, desc: '별도·포함 양방향 계산', category: 'tax' },
  { id: 'acquisition', label: '취득세 계산기', icon: Home, desc: '주택 수·지역별 세율 적용', category: 'tax' },
  { id: 'unit', label: '단위 변환기', icon: Scale, desc: '길이·넓이·무게·부피', category: 'unit' },
  { id: 'arithmetic', label: '단가 비교', icon: Calculator, desc: '두 상품 단가 비교', category: 'basic' },
]

export function CalculatorListPage() {
  const { setCalculator } = useUiStore()

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">계산기 선택</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CALCULATORS.map(({ id, label, icon: Icon, desc, category }) => (
          <Card
            key={id}
            className="cursor-pointer hover:border-emerald-500 transition-colors hover:shadow-sm"
            onClick={() => setCalculator(id)}
          >
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950">
                  <Icon className="h-4 w-4 text-emerald-600" />
                </div>
                <Badge variant="secondary" className="text-xs">{category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <CardTitle className="text-sm mb-1">{label}</CardTitle>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
