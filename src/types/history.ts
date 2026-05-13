export interface HistoryEntry {
  id?: number
  calculatorType: string
  label: string
  inputs: Record<string, unknown>
  result: Record<string, unknown>
  createdAt: string
}
