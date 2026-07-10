import { useState } from 'react'
import type { Task, TaskStatus } from '../../types'
import { DatePicker } from './DatePicker'

interface TaskFormData {
  title: string
  zone: string
  subcontractor: string
  startDate: string
  endDate: string
  status: TaskStatus
}

export function TaskModal({
  task,
  zones,
  subcontractors,
  onSave,
  onClose,
}: {
  task?: Task | null
  zones: string[]
  subcontractors: string[]
  onSave: (data: TaskFormData) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<TaskFormData>(
    task
      ? {
          title: task.title,
          zone: task.zone,
          subcontractor: task.subcontractor || '',
          startDate: task.startDate.slice(0, 10),
          endDate: task.endDate.slice(0, 10),
          status: task.status,
        }
      : {
          title: '',
          zone: zones[0] ?? '',
          subcontractor: '',
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          status: 'todo',
        },
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-500 min-touch-target">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Pour foundation slab"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Zone</label>
              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                {zones.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Subcontractor</label>
              <select
                value={form.subcontractor}
                onChange={(e) => setForm({ ...form, subcontractor: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">None</option>
                {subcontractors.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Start</label>
              <DatePicker value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">End</label>
              <DatePicker value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <div className="flex gap-2">
              {(['todo', 'in-progress', 'blocked', 'done'] as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium ${
                    form.status === s
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-green-600 py-3 text-sm font-semibold text-white active:bg-green-700 min-touch-target"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  )
}

export type { TaskFormData }
