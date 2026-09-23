import { useEffect, useState } from 'react'
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

export function useWeekNotes(taskIds: string[]) {
  const [notesByTask, setNotesByTask] = useState<Record<string, Note[]>>({})

  useEffect(() => {
    if (taskIds.length === 0) {
      setNotesByTask({})
      return
    }
    fetch(`${apiUrl()}/api/notes?taskIds=${taskIds.join(',')}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : []))
      .then((items) => {
        const notes: Note[] = items.map(mapNote)
        const map: Record<string, Note[]> = {}
        for (const n of notes) {
          if (!map[n.taskId]) map[n.taskId] = []
          map[n.taskId].push(n)
        }
        setNotesByTask(map)
      })
      .catch((e) => console.error('fetch week notes failed', e))
  }, [taskIds.join(',')])

  return notesByTask
}
