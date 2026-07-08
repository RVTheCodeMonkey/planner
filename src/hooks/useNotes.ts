import { useLiveQuery } from './useLiveQuery'
import { db } from '../db/db'
import { enqueueSync } from '../db/sync'
import type { Note } from '../types'

export function useNotes(taskId: number | null) {
  const notes = useLiveQuery(
    () => (taskId ? db.notes.where('taskId').equals(taskId).sortBy('timestamp') : Promise.resolve([] as Note[])),
    [taskId],
  ) ?? []

  async function addNote(data: Omit<Note, 'id' | 'createdAt' | 'syncStatus'>) {
    const now = new Date().toISOString()
    const id = await db.notes.add({
      ...data,
      createdAt: now,
      syncStatus: 'pending',
    } as Note)
    if (id) await enqueueSync('create', 'notes', id as number, data)
    return id
  }

  return { notes, addNote }
}
