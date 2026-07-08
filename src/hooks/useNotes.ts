import { useCallback, useEffect, useState } from 'react'
import type { Note } from '../types'

function apiUrl() {
  return `${window.location.protocol}//${window.location.host}`
}

function mapNote(item: any): Note {
  return {
    id: item.id,
    taskId: item.taskId ?? item.task_id,
    timestamp: item.timestamp,
    user: item.user,
    text: item.text,
    imageUrls: item.imageUrls ?? item.image_urls ?? [],
    createdAt: item.createdAt ?? item.created_at,
  }
}

export function useNotes(taskId: string | null) {
  const [notes, setNotes] = useState<Note[]>([])

  const fetchNotes = useCallback(async () => {
    if (!taskId) { setNotes([]); return }
    try {
      const r = await fetch(`${apiUrl()}/api/tasks/${taskId}/notes`, { cache: 'no-store' })
      if (r.ok) {
        setNotes((await r.json()).map(mapNote))
      }
    } catch (e) {
      console.error('fetch notes failed', e)
    }
  }, [taskId])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  async function addNote(data: Omit<Note, 'id' | 'createdAt'>) {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    try {
      const r = await fetch(`${apiUrl()}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data, createdAt: now }),
      })
      if (r.ok) {
        const created = mapNote(await r.json())
        setNotes(prev => [...prev, created])
        return id
      }
    } catch (e) {
      console.error('add note failed', e)
    }
    return id
  }

  return { notes, addNote }
}
