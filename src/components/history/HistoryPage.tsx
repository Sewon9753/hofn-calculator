import { useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useHistory } from '@/hooks/useHistory'
import { formatDate } from '@/lib/formatters'

export function HistoryPage() {
  const { history, deleteAll, exportToExcel } = useHistory()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDelete = async () => {
    await deleteAll()
    setConfirmOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">계산 기록</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel} disabled={history.length === 0}>
            <Download className="h-4 w-4 mr-1" />엑셀 저장
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)} disabled={history.length === 0}>
            <Trash2 className="h-4 w-4 mr-1" />전체 삭제
          </Button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-16">계산 기록이 없습니다.</p>
      ) : (
        <div className="border border-border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>계산기</TableHead>
                <TableHead>요약</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm">{row.calculatorType}</TableCell>
                  <TableCell className="text-sm">{row.label}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-amber-600 mt-4">
        ⚠ 브라우저 캐시 삭제 시 기록이 영구 소실됩니다. 주기적으로 엑셀로 백업하세요.
      </p>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>전체 기록 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            모든 계산 기록이 IndexedDB에서 영구 삭제됩니다. 되돌릴 수 없습니다.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>취소</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>삭제</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
