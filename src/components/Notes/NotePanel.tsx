import { useState } from 'react'
import type { Task, Note } from '../../types'
import { useNotes } from '../../hooks/useNotes'
import { NoteForm } from './NoteForm'
import { DatePicker } from '../Tasks/DatePicker'

export function NotePanel({
  task,
  subtasks,
  onAddSubtask,
  onEdit,
  onDelete,
  onClose,
}: {
  task: Task
  subtasks: Task[]
  onAddSubtask: (parentId: string, title: string, date: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const { notes, addNote, updateNote, deleteNote } = useNotes(task.id)
  const [newSubtask, setNewSubtask] = useState('')
  const [newSubtaskDate, setNewSubtaskDate] = useState(new Date().toISOString().slice(0, 10))
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editNoteText, setEditNoteText] = useState('')

  async function handleAddNote(text: string) {
    await addNote({
      taskId: task.id,
      timestamp: new Date().toISOString(),
      user: 'Field Worker',
      text,
      imageUrls: [],
    })
  }

  async function handleAddSubtask() {
    const title = newSubtask.trim()
    if (!title) return
    onAddSubtask(task.id, title, newSubtaskDate)
    setNewSubtask('')
    setNewSubtaskDate(new Date().toISOString().slice(0, 10))
  }

  async function handleSaveNoteEdit(id: string) {
    const text = editNoteText.trim()
    if (!text) return
    await updateNote(id, text)
    setEditingNoteId(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="flex h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white sm:h-auto sm:max-h-[90vh] sm:rounded-2xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{task.title}</h3>
            <p className="text-xs text-slate-500">{task.zone} · {task.status}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(task)} className="rounded px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 dark:text-green-400">Edit</button>
            <button onClick={() => onDelete(task.id)} className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400">Delete</button>
            <button onClick={onClose} className="p-2 text-slate-500 min-touch-target">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Subtasks</h4>
              <div className="flex flex-col gap-1.5">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700">
                    <span className="text-sm text-slate-800 dark:text-slate-200">{st.title}</span>
                    <span className="ml-auto text-xs text-slate-400">
                      {new Date(st.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add subtask */}
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Subtask title..."
              />
              <DatePicker value={newSubtaskDate} onChange={setNewSubtaskDate} />
              <button
                onClick={handleAddSubtask}
                disabled={!newSubtask.trim()}
                className="rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50 min-touch-target"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          {notes.length === 0 ? (
            <p className="text-center text-sm text-slate-400">No notes yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {(notes as Note[]).map((note) => (
                <div key={note.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{note.user}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingNoteId(note.id); setEditNoteText(note.text) }}
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium text-green-600 hover:bg-green-50 dark:text-green-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium text-red-600 hover:bg-red-50 dark:text-red-400"
                      >
                        Delete
                      </button>
                      <span className="text-[11px] text-slate-400">
                        {new Date(note.timestamp).toLocaleString('en-GB')}
                      </span>
                    </div>
                  </div>
                  {editingNoteId === note.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        onBlur={() => handleSaveNoteEdit(note.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNoteEdit(note.id)}
                        className="flex-1 rounded border border-green-500 px-2 py-1 text-sm dark:bg-slate-600 dark:text-white"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-800 dark:text-slate-200">{note.text}</p>
                  )}
                  {note.imageUrls.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {note.imageUrls.map((url: string, i: number) => (
                        <img key={i} src={url} alt="" className="h-16 w-16 rounded object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <NoteForm onSubmit={handleAddNote} />
        </div>
      </div>
    </div>
  )
}