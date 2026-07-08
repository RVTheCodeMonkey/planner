import type { Task } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  todo: 'border-l-green-500',
  'in-progress': 'border-l-amber-500',
  blocked: 'border-l-red-500',
  done: 'border-l-green-500',
}

const DAY_LABEL_WIDTH = 32

function dayIndex(date: Date, dayHeaders: Date[]) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  for (let i = 0; i < dayHeaders.length; i++) {
    if (dayHeaders[i].getTime() === d.getTime()) return i
  }
  return -1
}

export function TaskCard({ task, dayHeaders, onClick }: { task: Task; dayHeaders: Date[]; onClick: () => void }) {
  const startIdx = dayIndex(new Date(task.startDate), dayHeaders)
  const endIdx = dayIndex(new Date(task.endDate), dayHeaders)

  const start = Math.max(0, startIdx)
  const end = endIdx >= start ? endIdx : start
  const span = end - start + 1

  const left = start * DAY_LABEL_WIDTH + 4
  const width = span * DAY_LABEL_WIDTH - 8

  return (
    <button
      onClick={onClick}
      className={`absolute flex flex-col gap-0.5 rounded-lg border-l-4 bg-white px-2 py-1.5 text-left shadow-sm transition-shadow hover:shadow-md active:shadow-md dark:bg-slate-800 ${STATUS_COLORS[task.status]}`}
      style={{ left, width: Math.max(width, 100), top: 4, minHeight: 50 }}
    >
      <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
        {task.title}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {task.zone}
        {task.subcontractor ? ` · ${task.subcontractor}` : ''}
      </span>
      <span className="text-[11px] text-slate-400 dark:text-slate-500">
        {new Date(task.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        {' – '}
        {new Date(task.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    </button>
  )
}