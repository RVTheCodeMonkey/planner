import { db } from './db'

let API_BASE = ''

export function setApiBase(url: string) {
  API_BASE = url
}

export async function processSyncQueue() {
  const items = await db.syncQueue.orderBy('createdAt').toArray()
  for (const item of items) {
    try {
      const payload = item.payload as Record<string, unknown>
      let res: Response

      switch (item.action) {
        case 'create':
          res = await fetch(`${API_BASE}/api/${item.table}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.recordId, ...payload }),
          })
          break
        case 'update':
          res = await fetch(`${API_BASE}/api/${item.table}/${item.recordId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          break
        case 'delete':
          res = await fetch(`${API_BASE}/api/${item.table}/${item.recordId}`, {
            method: 'DELETE',
          })
          break
        default:
          throw new Error(`Unknown action: ${item.action}`)
      }

      if (!res.ok) throw new Error(`Sync failed: ${res.status}`)
      await db.syncQueue.delete(item.id!)
    } catch {
      break
    }
  }
}
