import { useEffect, useRef } from 'react'
import { db } from '../db/db'
import { setApiBase, processSyncQueue } from '../db/sync'
import { useOnlineStatus } from './useOnlineStatus'

function wsUrl() {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/ws`
}

function apiUrl() {
  return `${window.location.protocol}//${window.location.host}`
}

export function useRealtimeSync() {
  const isOnline = useOnlineStatus()
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    setApiBase(apiUrl())
  }, [])

  useEffect(() => {
    if (!isOnline) return

    const ws = new WebSocket(wsUrl())
    wsRef.current = ws

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data)
      switch (msg.type) {
        case 'task-created':
          if (!(await db.tasks.get(msg.data.id))) {
            await db.tasks.add({ ...msg.data, syncStatus: 'synced' })
          }
          break
        case 'task-updated':
          await db.tasks.put({ ...msg.data, syncStatus: 'synced' })
          break
        case 'task-deleted':
          await db.tasks.delete(msg.data.id)
          break
        case 'note-created':
          if (!(await db.notes.get(msg.data.id))) {
            await db.notes.add({ ...msg.data, syncStatus: 'synced' })
          }
          break
      }
    }

    ws.onopen = () => processSyncQueue()

    return () => ws.close()
  }, [isOnline])

  return wsRef
}
