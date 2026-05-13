import { useState } from 'react'
import { addDays, differenceInDays, format, parseISO } from 'date-fns'
import { Plus, Trash2, CalendarDays, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDdays } from '@/hooks/useDday'
import { formatDate } from '@/lib/formatters'

type InputMode = 'date' | 'days'


export function DdayPage() {
  const { ddays, add, remove } = useDdays()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<InputMode>('date')
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [daysInput, setDaysInput] = useState('')
  const [memo, setMemo] = useState('')

  const computedDate = (() => {
    const n = parseInt(daysInput, 10)
    if (isNaN(n)) return null
    return format(addDays(new Date(), n), 'yyyy-MM-dd')
  })()

  const handleOpen = () => {
    setMode('date')
    setTitle('')
    setTargetDate('')
    setDaysInput('')
    setMemo('')
    setOpen(true)
  }

  const handleAdd = async () => {
    const date = mode === 'date' ? targetDate : computedDate
    if (!title || !date) return
    await add({ title, targetDate: date, memo })
    setOpen(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">D-Day 관리</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleOpen}>
            <Plus className="h-4 w-4 mr-1" />추가
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>D-Day 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>제목</Label>
                <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="KB 적금 만기" />
              </div>

              {/* Mode toggle */}
              <div>
                <Label>입력 방식</Label>
                <div className="flex mt-1 rounded-lg border border-input overflow-hidden">
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm transition-colors ${mode === 'date' ? 'bg-emerald-600 text-white' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
                    onClick={() => setMode('date')}
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    날짜 선택
                  </button>
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm transition-colors ${mode === 'days' ? 'bg-emerald-600 text-white' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
                    onClick={() => setMode('days')}
                  >
                    <Hash className="h-3.5 w-3.5" />
                    일수 입력
                  </button>
                </div>
              </div>

              {mode === 'date' ? (
                <div>
                  <Label>목표 날짜</Label>
                  <Input className="mt-1" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                </div>
              ) : (
                <div>
                  <Label>오늘로부터 며칠 후</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      min="0"
                      className="font-mono"
                      value={daysInput}
                      onChange={(e) => setDaysInput(e.target.value)}
                      placeholder="30"
                    />
                    <span className="text-sm text-muted-foreground shrink-0">일 후</span>
                  </div>
                  {computedDate && (
                    <p className="mt-1.5 text-sm text-emerald-600 font-medium">
                      → {formatDate(computedDate)}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label>메모 (선택)</Label>
                <Input className="mt-1" value={memo} onChange={(e) => setMemo(e.target.value)} />
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleAdd}
                disabled={!title || (mode === 'date' ? !targetDate : !computedDate)}
              >
                저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {ddays.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-16">등록된 D-Day가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {ddays.map((d) => {
            const days = differenceInDays(parseISO(d.targetDate), new Date())
            return (
              <Card key={d.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium mb-0.5">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(d.targetDate)}</p>
                    {d.memo && <p className="text-xs text-muted-foreground mt-0.5">{d.memo}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold text-lg ${days >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {days >= 0 ? `D-${days}` : `D+${Math.abs(days)}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-rose-600"
                      onClick={() => d.id !== undefined && remove(d.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
