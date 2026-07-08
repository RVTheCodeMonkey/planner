import { useLiveQuery } from './useLiveQuery'
import { db } from '../db/db'
import type { Note } from '../types'

export function useNotes(taskId: string | null) {
  const notes = useLiveQuery(
    () => (taskId ? db.notes.where('taskId').equals(taskId).sortBy('timestamp') : Promise.resolve([] as Note[])),
    [taskId],
  ) ?? []

  async function addNote(data: Omit<Note, 'id' | 'createdAt' | 'syncStatus'>) {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const note: Note = {
      id,
      ...data,
      createdAt: now,
      syncStatus: 'pending',
    }
    await db.notes.add(note)
    return id
  }

  return { notes, addNote }
}
