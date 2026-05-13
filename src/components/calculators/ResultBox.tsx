import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClipboard } from '@/hooks/useClipboard'

interface ResultRow {
  label: string
  value: string
  rawValue?: string
  highlight?: boolean
}

interface Props {
  title?: string
  rows: ResultRow[]
}

export function ResultBox({ title = '계산 결과', rows }: Props) {
  const { copy, isCopied } = useClipboard()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between py-2 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}
          >
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono tabular-nums ${row.highlight ? 'text-xl font-bold text-emerald-600' : 'text-sm font-medium'}`}
              >
                {row.value}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => copy(row.rawValue ?? row.value, row.label)}
              >
                {isCopied(row.label) ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
