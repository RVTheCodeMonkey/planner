import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export function Header({ onAddTask, onManageZones }: { onAddTask: () => void; onManageZones: () => void }) {
  const isOnline = useOnlineStatus()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
      <h1 className="text-lg font-bold tracking-tight">Site Planner</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onManageZones}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 active:text-white min-touch-target"
        >
          Zones
        </button>
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            isOnline ? 'bg-green-400' : 'bg-yellow-400'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium active:bg-blue-700 min-touch-target"
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
