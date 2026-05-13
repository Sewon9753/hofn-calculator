import Dexie, { type EntityTable } from 'dexie'
import type { DdayEntry } from '@/types/dday'
import type { HistoryEntry } from '@/types/history'

class HofnDatabase extends Dexie {
  ddays!: EntityTable<DdayEntry, 'id'>
  history!: EntityTable<HistoryEntry, 'id'>

  constructor() {
    super('HofnCalculator')
    this.version(1).stores({
      ddays: '++id, targetDate, category, createdAt',
      history: '++id, calculatorType, createdAt',
    })
  }
}

export const db = new HofnDatabase()
