import type { Task, Note } from '../../types'
import { useNotes } from '../../hooks/useNotes'
import { NoteForm } from './NoteForm'

export function NotePanel({ task, onClose }: { task: Task; onClose: () => void }) {
  const { notes, addNote } = useNotes(task.id ?? null)

  async function handleAddNote(text: string) {
    if (!task.id) return
    await addNote({
      taskId: task.id,
      timestamp: new Date().toISOString(),
      user: 'Field Worker',
      text,
      imageUrls: [],
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="flex h-[70vh] w-full max-w-md flex-col rounded-t-2xl bg-white sm:h-auto sm:max-h-[80vh] sm:rounded-2xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{task.title}</h3>
            <p className="text-xs text-slate-500">{task.zone} · {task.status}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 min-touch-target">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {notes.length === 0 ? (
            <p className="text-center text-sm text-slate-400">No notes yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {(notes as Note[]).map((note) => (
                <div key={note.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{note.user}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{note.text}</p>
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
