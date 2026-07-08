import { useCallback, useEffect, useState } from 'react'
import type { Task } from '../types'

function apiUrl() {
  return `${window.location.protocol}//${window.location.host}`
}

function mapTask(item: any): Task {
  return {
    id: item.id,
    title: item.title,
    zone: item.zone,
    subcontractor: item.subcontractor,
    startDate: item.startDate ?? item.start_date,
    endDate: item.endDate ?? item.end_date,
    status: item.status,
    createdAt: item.createdAt ?? item.created_at,
    updatedAt: item.updatedAt ?? item.updated_at,
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = useCallback(async () => {
    try {
      const r = await fetch(`${apiUrl()}/api/tasks`, { cache: 'no-store' })
      if (r.ok) {
        setTasks((await r.json()).map(mapTask))
      }
    } catch (e) {
      console.error('fetch tasks failed', e)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    try {
      const r = await fetch(`${apiUrl()}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data, createdAt: now, updatedAt: now }),
      })
      if (r.ok) {
        const created = mapTask(await r.json())
        setTasks(prev => [...prev, created])
        return id
      }
    } catch (e) {
      console.error('create task failed', e)
    }
    return id
  }

  async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    try {
      const r = await fetch(`${apiUrl()}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() }),
      })
      if (r.ok) {
        const updated = mapTask(await r.json())
        setTasks(prev => prev.map(t => t.id === id ? updated : t))
      }
    } catch (e) {
      console.error('update task failed', e)
    }
  }

  async function deleteTask(id: string) {
    try {
      await fetch(`${apiUrl()}/api/tasks/${id}`, { method: 'DELETE' })
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      console.error('delete task failed', e)
    }
  }

  return { tasks, createTask, updateTask, deleteTask, refresh: fetchTasks }
}
