export interface DdayEntry {
  id?: number
  title: string
  targetDate: string
  category?: 'savings' | 'loan' | 'subscription' | 'custom'
  memo?: string
  createdAt: string
}
