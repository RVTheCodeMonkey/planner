import Dexie, { type EntityTable } from 'dexie'
import type { Task, Note } from '../types'

const db = new Dexie('SitePlanner') as Dexie & {
  tasks: EntityTable<Task, 'id'>
  notes: EntityTable<Note, 'id'>
  syncQueue: EntityTable<{ id?: number; action: string; table: string; recordId: number; payload: unknown; createdAt: string }, 'id'>
  settings: EntityTable<{ key: string; value: string[] }, 'key'>
}

db.version(1).stores({
  tasks: '++id, zone, status, startDate, endDate, syncStatus',
  notes: '++id, taskId, timestamp, syncStatus',
  syncQueue: '++id, createdAt',
})

db.version(2).stores({
  tasks: '++id, zone, status, startDate, endDate, syncStatus',
  notes: '++id, taskId, timestamp, syncStatus',
  syncQueue: '++id, createdAt',
  settings: 'key',
})

export { db }
