import type { Task } from '../../types'
import { TaskCard } from './TaskCard'

const DAY_LABEL_WIDTH = 28
const DAYS_RANGE = 42

export function TimelineRow({
  label,
  tasks,
  onTaskClick,
}: {
  label: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
}) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700">
      <div className="sticky left-0 z-10 flex w-36 shrink-0 items-center bg-slate-100 px-3 py-2 dark:bg-slate-900">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <div className="relative flex min-h-[84px] flex-wrap gap-2 px-3 py-2" style={{ width: DAYS_RANGE * DAY_LABEL_WIDTH }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
        {tasks.length === 0 && (
          <span className="text-sm text-slate-400 italic">No tasks</span>
        )}
      </div>
    </div>
  )
}
