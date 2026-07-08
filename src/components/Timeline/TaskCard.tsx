import type { Task } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  todo: 'border-l-blue-500',
  'in-progress': 'border-l-amber-500',
  blocked: 'border-l-red-500',
  done: 'border-l-green-500',
}

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const start = new Date(task.startDate)
  const end = new Date(task.endDate)
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1)

  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 flex-col gap-0.5 rounded-lg border-l-4 bg-white px-3 py-2 text-left shadow-sm transition-shadow active:shadow-md dark:bg-slate-800 ${STATUS_COLORS[task.status]}`}
      style={{ minWidth: Math.max(days * 28, 120) }}
    >
      <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
        {task.title}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {task.zone}
        {task.subcontractor ? ` · ${task.subcontractor}` : ''}
      </span>
      <span className="text-[11px] text-slate-400 dark:text-slate-500">
        {new Date(task.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        {' – '}
        {new Date(task.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </span>
    </button>
  )
}
