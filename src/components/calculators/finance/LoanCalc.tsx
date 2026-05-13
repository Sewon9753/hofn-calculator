import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CalculatorShell } from '../CalculatorShell'
import { ResultBox } from '../ResultBox'
import { calcEqualPayment, calcEqualPrincipal, calcBulletPayment } from '@/calc/finance/loan'
import type { LoanResult } from '@/calc/finance/loan'
import { useCalculator } from '@/hooks/useCalculator'
import { useNumericInput } from '@/hooks/useNumericInput'
import { formatKRW } from '@/lib/formatters'

type LoanType = 'equal_payment' | 'equal_principal' | 'bullet'

const LOAN_LABELS: Record<LoanType, string> = {
  equal_payment: '원리금균등상환',
  equal_principal: '원금균등상환',
  bullet: '만기일시상환',
}

export function LoanCalc() {
  const [loanType, setLoanType] = useState<LoanType>('equal_payment')
  const principal = useNumericInput(100000000)
  const [rate, setRate] = useState('4')
  const months = useNumericInput(360)

  const { result, calculate } = useCalculator(
    (input: { type: LoanType; principal: number; rate: number; months: number }) => {
      const params = { principal: input.principal, annualRate: input.rate / 100, months: input.months }
      if (input.type === 'equal_payment') return calcEqualPayment(params)
      if (input.type === 'equal_principal') return calcEqualPrincipal(params)
      return calcBulletPayment(params)
    },
    `loan_${loanType}`,
    (_, res: LoanResult) => `월 ${formatKRW(res.firstMonthPayment)} / 총이자 ${formatKRW(res.totalInterest)}`,
  )

  const handleCalc = () => {
    calculate({
      type: loanType,
      principal: principal.numericValue,
      rate: Number(rate),
      months: months.numericValue,
    })
  }

  const rows = result
    ? [
        { label: '첫 달 납입액', value: formatKRW(result.firstMonthPayment), highlight: true },
        { label: '총 납입액', value: formatKRW(result.totalPayment) },
        { label: '총 이자', value: formatKRW(result.totalInterest) },
      ]
    : []

  return (
    <CalculatorShell
      title="대출 이자 계산기"
      input={
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>상환 방식</Label>
              <Select value={loanType} onValueChange={(v: string | null) => { if (v) setLoanType(v as LoanType) }}>
                <SelectTrigger className="mt-1">
                  <SelectValue>{LOAN_LABELS[loanType]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal_payment">원리금균등상환</SelectItem>
                  <SelectItem value="equal_principal">원금균등상환</SelectItem>
                  <SelectItem value="bullet">만기일시상환</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>대출 원금 (원)</Label>
              <Input className="mt-1" value={principal.value} onChange={principal.onChange} placeholder="100,000,000" />
            </div>
            <div>
              <Label>연이율 (%)</Label>
              <Input className="mt-1" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="4.0" />
            </div>
            <div>
              <Label>대출 기간 (개월)</Label>
              <Input className="mt-1" value={months.value} onChange={months.onChange} placeholder="360" />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCalc}>
              계산하기
            </Button>
          </CardContent>
        </Card>
      }
      result={
        result ? (
          <div className="space-y-4">
            <ResultBox rows={rows} />
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">상환 스케줄 (최초 12개월)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>회차</TableHead>
                      <TableHead>납입액</TableHead>
                      <TableHead>원금</TableHead>
                      <TableHead>이자</TableHead>
                      <TableHead>잔여 원금</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.monthlyPayments.slice(0, 12).map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell className="font-mono">{formatKRW(row.payment)}</TableCell>
                        <TableCell className="font-mono">{formatKRW(row.principal)}</TableCell>
                        <TableCell className="font-mono">{formatKRW(row.interest)}</TableCell>
                        <TableCell className="font-mono">{formatKRW(row.remaining)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            값을 입력하고 계산하기를 누르세요
          </div>
        )
      }
    />
  )
}
