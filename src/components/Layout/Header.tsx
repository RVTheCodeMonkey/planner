export function Header({ onAddTask, onSettings, onPrint }: { onAddTask: () => void; onSettings: () => void; onPrint?: () => void }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 border-slate-600 bg-slate-900 px-4 py-3 text-white">
      <h1 className="flex items-baseline gap-0 text-lg tracking-tight">
        <span className="font-extrabold text-white">Core</span>
        <span className="font-extrabold" style={{ color: '#39FF14' }}>.</span>
        <span className="font-light text-slate-300">base</span>
        <span className="ml-2 text-sm font-normal text-slate-400">Site Planner</span>
      </h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onSettings}
          className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-white active:bg-slate-700 min-touch-target"
        >
          Settings
        </button>
        <button
          onClick={onPrint}
          className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-white active:bg-slate-700 min-touch-target"
        >
          Print week
        </button>
        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium active:bg-green-700 min-touch-target"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>
    </header>
  )
}
