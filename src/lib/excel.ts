import * as XLSX from 'xlsx'
import type { HistoryEntry } from '@/types/history'

export function exportHistoryToExcel(rows: HistoryEntry[]): void {
  const wsData = rows.map((row) => ({
    날짜: row.createdAt,
    계산기: row.calculatorType,
    요약: row.label,
    입력값: JSON.stringify(row.inputs),
    결과값: JSON.stringify(row.result),
  }))
  const ws = XLSX.utils.json_to_sheet(wsData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '계산 기록')
  XLSX.writeFile(wb, `hofn_history_${Date.now()}.xlsx`)
}
