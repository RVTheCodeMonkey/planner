import type { Task } from '../../types'
import { TaskCard } from './TaskCard'

const DAY_LABEL_WIDTH = 32
const DAYS_RANGE = 42

function isToday(d: Date) {
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

function isWeekend(d: Date) {
  return d.getDay() === 0 || d.getDay() === 6
}

export function TimelineRow({
  label,
  tasks,
  dayHeaders,
  onTaskClick,
}: {
  label: string
  tasks: Task[]
  dayHeaders: Date[]
  onTaskClick: (task: Task) => void
}) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700">
      <div className="sticky left-0 z-10 flex w-36 shrink-0 items-center bg-slate-100 px-3 py-2 dark:bg-slate-900">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <div className="relative" style={{ width: DAYS_RANGE * DAY_LABEL_WIDTH }}>
        {/* Grid lines */}
        {dayHeaders.map((d, i) => (
          <div
            key={d.toISOString()}
            className={`absolute top-0 h-full ${
              isToday(d)
                ? 'border-l-2 border-l-blue-300 dark:border-l-blue-600'
                : isWeekend(d)
                  ? 'border-l border-l-slate-100 dark:border-l-slate-800'
                  : 'border-l border-l-slate-200 dark:border-l-slate-700'
            } ${i === dayHeaders.length - 1 ? 'border-r border-r-slate-200 dark:border-r-slate-700' : ''}`}
            style={{ left: i * DAY_LABEL_WIDTH, width: DAY_LABEL_WIDTH }}
          />
        ))}

        {/* Task cards */}
        <div className="relative min-h-[84px] px-3 py-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} dayHeaders={dayHeaders} onClick={() => onTaskClick(task)} />
          ))}
          {tasks.length === 0 && (
            <span className="text-sm text-slate-400 italic">No tasks</span>
          )}
        </div>
      </div>
    </div>
  )
}