import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import type { HistoryEntry } from '@/types/history'
import { exportHistoryToExcel } from '@/lib/excel'

export function useHistory() {
  const history = useLiveQuery(
    () => db.history.orderBy('createdAt').reverse().limit(200).toArray(),
    [],
  )

  const add = (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) =>
    db.history.add({ ...entry, createdAt: new Date().toISOString() })

  const deleteAll = () => db.history.clear()

  const exportToExcel = async () => {
    const rows = await db.history.orderBy('createdAt').reverse().toArray()
    exportHistoryToExcel(rows)
  }

  return { history: history ?? [], add, deleteAll, exportToExcel }
}
