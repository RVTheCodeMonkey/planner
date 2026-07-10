import type { Task } from '../../types'
import { TaskCard } from './TaskCard'

const DAY_LABEL_WIDTH = 32
const DAYS_RANGE = 150

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
  weekStarts,
  onTaskClick,
}: {
  label: string
  tasks: Task[]
  dayHeaders: Date[]
  weekStarts: Set<number>
  onTaskClick: (task: Task) => void
}) {
  // detect overlaps → assign stacking levels (2px per level)
  const taskLevel = new Map<string, number>()
  if (tasks.length > 1 && dayHeaders.length > 0) {
    function idx(iso: string) {
      const target = iso.slice(0, 10)
      for (let i = 0; i < dayHeaders.length; i++) {
        const d = dayHeaders[i]
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        if (key === target) return i
      }
      const first = `${dayHeaders[0].getFullYear()}-${String(dayHeaders[0].getMonth() + 1).padStart(2, '0')}-${String(dayHeaders[0].getDate()).padStart(2, '0')}`
      const last = `${dayHeaders[dayHeaders.length - 1].getFullYear()}-${String(dayHeaders[dayHeaders.length - 1].getMonth() + 1).padStart(2, '0')}-${String(dayHeaders[dayHeaders.length - 1].getDate()).padStart(2, '0')}`
      if (target < first) return 0
      if (target > last) return dayHeaders.length - 1
      return -1
    }
    const sorted = [...tasks].sort((a, b) => a.startDate.localeCompare(b.startDate) || a.endDate.localeCompare(b.endDate))
    const levels: number[] = []
    const endsAt: number[] = []
    for (const t of sorted) {
      const ts = idx(t.startDate)
      const te = idx(t.endDate)
      let placed = false
      for (let l = 0; l < endsAt.length; l++) {
        if (ts > endsAt[l]) {
          endsAt[l] = te
          levels.push(l)
          placed = true
          break
        }
      }
      if (!placed) {
        endsAt.push(te)
        levels.push(endsAt.length - 1)
      }
    }
    sorted.forEach((t, i) => taskLevel.set(t.id, levels[i]))
  }
  const maxLevel = taskLevel.size > 0 ? Math.max(...taskLevel.values()) : 0

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
                ? 'border-l-2 border-l-green-300 dark:border-l-green-600'
                : isWeekend(d)
                  ? 'border-l border-l-slate-100 dark:border-l-slate-800'
                  : weekStarts.has(i)
                    ? 'border-l border-l-slate-400 dark:border-l-slate-500'
                    : 'border-l border-l-slate-200 dark:border-l-slate-700'
            } ${i === dayHeaders.length - 1 ? 'border-r border-r-slate-200 dark:border-r-slate-700' : ''}`}
            style={{ left: i * DAY_LABEL_WIDTH, width: DAY_LABEL_WIDTH }}
          />
        ))}

        {/* Task cards */}
        <div className="relative px-3 py-2" style={{ minHeight: 80 + maxLevel * 26 }}>
          {[...tasks].sort((a, b) => {
            const da = a.endDate.localeCompare(a.startDate)
            const db = b.endDate.localeCompare(b.startDate)
            return db - da // longest first → rendered behind
          }).map((task) => (
            <TaskCard key={task.id} task={task} dayHeaders={dayHeaders} topOffset={taskLevel.get(task.id)! * 26} onClick={() => onTaskClick(task)} />
          ))}
          {tasks.length === 0 && (
            <span className="text-sm text-slate-400 italic">No tasks</span>
          )}
        </div>
      </div>
    </div>
  )
}