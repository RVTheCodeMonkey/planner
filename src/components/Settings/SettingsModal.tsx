import { useState } from 'react'
import type { useSettings } from '../../hooks/useSettings'

export function SettingsModal({
  zones,
  addZone,
  renameZone,
  deleteZone,
  onClose,
}: {
  zones: string[]
  addZone: ReturnType<typeof useSettings>['addZone']
  renameZone: ReturnType<typeof useSettings>['renameZone']
  deleteZone: ReturnType<typeof useSettings>['deleteZone']
  onClose: () => void
}) {
  const [newZone, setNewZone] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  async function handleAdd() {
    const name = newZone.trim()
    if (!name) return
    await addZone(name)
    setNewZone('')
  }

  async function handleRename(index: number) {
    const name = editValue.trim()
    if (!name || name === zones[index]) {
      setEditingIndex(null)
      return
    }
    await renameZone(zones[index], name)
    setEditingIndex(null)
  }

  async function handleDelete(index: number) {
    await deleteZone(zones[index])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Zones</h2>
          <button onClick={onClose} className="p-2 text-slate-500 min-touch-target">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            value={newZone}
            onChange={(e) => setNewZone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="New zone name"
          />
          <button
            onClick={handleAdd}
            disabled={!newZone.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 min-touch-target"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {zones.map((zone, i) => (
            <div
              key={zone}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700"
            >
              {editingIndex === i ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleRename(i)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(i)}
                  className="flex-1 rounded border border-blue-500 px-2 py-1 text-sm dark:bg-slate-600 dark:text-white"
                  autoFocus
                />
              ) : (
                <span className="flex-1 text-sm text-slate-800 dark:text-slate-200">{zone}</span>
              )}
              <button
                onClick={() => { setEditingIndex(i); setEditValue(zone) }}
                className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 min-touch-target"
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 min-touch-target"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
