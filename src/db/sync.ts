import { db } from './db'

export async function enqueueSync(action: string, table: string, recordId: number, payload: unknown) {
  await db.syncQueue.add({
    action,
    table,
    recordId,
    payload,
    createdAt: new Date().toISOString(),
  })
}

export async function processSyncQueue() {
  const items = await db.syncQueue.orderBy('createdAt').toArray()
  for (const item of items) {
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: item.action, table: item.table, recordId: item.recordId, payload: item.payload }),
      })
      if (!res.ok) throw new Error('Sync failed')
      await db.syncQueue.delete(item.id!)
    } catch {
      break
    }
  }
}
