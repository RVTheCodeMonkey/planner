import { useState } from 'react'

export function NoteForm({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const [text, setText] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    await onSubmit(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        placeholder="Add a quick note..."
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 min-touch-target"
      >
        Add
      </button>
    </form>
  )
}
