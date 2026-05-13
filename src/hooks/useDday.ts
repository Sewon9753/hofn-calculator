import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import type { DdayEntry } from '@/types/dday'

export function useDdays() {
  const ddays = useLiveQuery(() => db.ddays.orderBy('targetDate').toArray(), [])

  const add = (entry: Omit<DdayEntry, 'id' | 'createdAt' | 'category'>) =>
    db.ddays.add({ ...entry, createdAt: new Date().toISOString() })

  const remove = (id: number) => db.ddays.delete(id)

  const update = (id: number, changes: Partial<DdayEntry>) => db.ddays.update(id, changes)

  return { ddays: ddays ?? [], add, remove, update }
}
