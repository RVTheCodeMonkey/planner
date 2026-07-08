import { useLiveQuery } from './useLiveQuery'
import { db } from '../db/db'
import type { Task } from '../types'

export function useTasks() {
  const tasks = useLiveQuery(() => db.tasks.orderBy('startDate').toArray()) ?? []

  async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const task: Task = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
    }
    await db.tasks.add(task)
    return id
  }

  async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'createdAt' | 'syncStatus'>>) {
    await db.tasks.update(id, { ...data, updatedAt: new Date().toISOString(), syncStatus: 'pending' })
  }

  async function deleteTask(id: string) {
    await db.tasks.delete(id)
  }

  return { tasks, createTask, updateTask, deleteTask }
}
