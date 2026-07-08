import { useState } from 'react'
import type { useSettings } from '../../hooks/useSettings'

type Tab = 'zones' | 'subcontractors'

export function SettingsModal({
  zones,
  subcontractors,
  addZone,
  renameZone,
  deleteZone,
  addSubcontractor,
  renameSubcontractor,
  deleteSubcontractor,
  onClose,
  onRefresh,
}: {
  zones: string[]
  subcontractors: string[]
  addZone: ReturnType<typeof useSettings>['addZone']
  renameZone: ReturnType<typeof useSettings>['renameZone']
  deleteZone: ReturnType<typeof useSettings>['deleteZone']
  addSubcontractor: ReturnType<typeof useSettings>['addSubcontractor']
  renameSubcontractor: ReturnType<typeof useSettings>['renameSubcontractor']
  deleteSubcontractor: ReturnType<typeof useSettings>['deleteSubcontractor']
  onClose: () => void
  onRefresh: () => void
}) {
  const [tab, setTab] = useState<Tab>('zones')
  const [newName, setNewName] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const list = tab === 'zones' ? zones : subcontractors
  const handleAdd = tab === 'zones'
    ? async (name: string) => { await addZone(name) }
    : async (name: string) => { await addSubcontractor(name) }
  const handleRename = tab === 'zones'
    ? async (old: string, name: string) => { await renameZone(old, name); onRefresh() }
    : async (old: string, name: string) => { await renameSubcontractor(old, name); onRefresh() }
  const handleDelete = tab === 'zones'
    ? async (name: string) => { await deleteZone(name); onRefresh() }
    : async (name: string) => { await deleteSubcontractor(name) }

  async function onAdd() {
    const name = newName.trim()
    if (!name) return
    await handleAdd(name)
    setNewName('')
  }

  async function onRename(index: number) {
    const name = editValue.trim()
    if (!name || name === list[index]) {
      setEditingIndex(null)
      return
    }
    await handleRename(list[index], name)
    setEditingIndex(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Lists</h2>
          <button onClick={onClose} className="p-2 text-slate-500 min-touch-target">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTab('zones')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium min-touch-target ${tab === 'zones' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
          >
            Zones
          </button>
          <button
            onClick={() => setTab('subcontractors')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium min-touch-target ${tab === 'subcontractors' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
          >
            Subcontractors
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAdd()}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder={`New ${tab === 'zones' ? 'zone' : 'subcontractor'} name`}
          />
          <button
            onClick={onAdd}
            disabled={!newName.trim()}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 min-touch-target"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {list.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700"
            >
              {editingIndex === i ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => onRename(i)}
                  onKeyDown={(e) => e.key === 'Enter' && onRename(i)}
                  className="flex-1 rounded border border-green-500 px-2 py-1 text-sm dark:bg-slate-600 dark:text-white"
                  autoFocus
                />
              ) : (
                <span className="flex-1 text-sm text-slate-800 dark:text-slate-200">{item}</span>
              )}
              <button
                onClick={() => { setEditingIndex(i); setEditValue(item) }}
                className="rounded px-2 py-1 text-xs text-green-600 hover:bg-green-50 dark:text-green-400 min-touch-target"
              >
                Rename
              </button>
              <button
                onClick={() => { handleDelete(item); if (tab !== 'zones') onRefresh() }}
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