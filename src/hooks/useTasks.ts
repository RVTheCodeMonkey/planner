import { useLiveQuery } from './useLiveQuery'
import { db } from '../db/db'
import { enqueueSync } from '../db/sync'
import type { Task } from '../types'

export function useTasks() {
  const tasks = useLiveQuery(() => db.tasks.orderBy('startDate').toArray()) ?? []

  async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) {
    const now = new Date().toISOString()
    const id = await db.tasks.add({
      ...data,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
    } as Task)
    if (id) await enqueueSync('create', 'tasks', id as number, data)
    return id
  }

  async function updateTask(id: number, data: Partial<Omit<Task, 'id' | 'createdAt' | 'syncStatus'>>) {
    await db.tasks.update(id, { ...data, updatedAt: new Date().toISOString(), syncStatus: 'pending' })
    await enqueueSync('update', 'tasks', id, data)
  }

  async function deleteTask(id: number) {
    await db.tasks.delete(id)
    await enqueueSync('delete', 'tasks', id, {})
  }

  return { tasks, createTask, updateTask, deleteTask }
}
