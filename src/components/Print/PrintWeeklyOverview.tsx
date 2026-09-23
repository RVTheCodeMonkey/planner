import type { Task } from '../../types'
import { useWeekNotes } from '../../hooks/useWeekNotes'

const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseIso(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getWeekStart(isoToday: string) {
  const date = parseIso(isoToday)
  const day = date.getDay() || 7 // 1=Mon ... 7=Sun
  date.setDate(date.getDate() - day + 1)
  return formatIso(date)
}

function addDays(iso: string, days: number) {
  const date = parseIso(iso)
  date.setDate(date.getDate() + days)
  return formatIso(date)
}

function formatDayLabel(iso: string) {
  const [, m, d] = iso.slice(0, 10).split('-').map(Number)
  return `${d} ${MONTHS[m - 1]}`
}

function formatRange(start: string, end: string) {
  return `${formatDayLabel(start)} – ${formatDayLabel(end)}`
}

function overlaps(dateStr: string, start: string, end: string) {
  return dateStr >= start.slice(0, 10) && dateStr <= end.slice(0, 10)
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    todo: 'To do',
    'in-progress': 'In progress',
    blocked: 'Blocked',
    done: 'Done',
  }
  return map[status] || status
}

export function PrintWeeklyOverview({ tasks }: { tasks: Task[] }) {
  const monday = getWeekStart(todayIso())
  const weekDays: string[] = []
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(monday, i))
  }

  const tasksByDay: Record<number, Task[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  const weekTaskIds = new Set<string>()

  for (const task of tasks) {
    for (let i = 0; i < 7; i++) {
      if (overlaps(weekDays[i], task.startDate, task.endDate)) {
        tasksByDay[i].push(task)
        weekTaskIds.add(task.id)
      }
    }
  }

  const notesByTask = useWeekNotes(Array.from(weekTaskIds))

  const [year, monthNum, dayNum] = monday.split('-').map(Number)
  const longDate = `${dayNum} ${MONTHS[monthNum - 1]} ${year}`

  return (
    <div className="print-weekly hidden print:block">
      <div className="print-header mb-4">
        <h1 className="text-2xl font-bold">Weekly Planning Overview</h1>
        <p className="text-sm text-slate-600">Week of {longDate}</p>
      </div>

      <div className="print-grid grid grid-cols-7 gap-2">
        {weekDays.map((d, i) => (
          <div key={i} className="print-day flex flex-col border border-slate-300">
            <div className="print-day-header bg-slate-100 p-2 text-center">
              <div className="text-sm font-bold">{SHORT_DAYS[i]}</div>
              <div className="text-xs text-slate-600">{formatDayLabel(d)}</div>
            </div>
            <div className="print-day-tasks flex-1 p-1.5">
              {tasksByDay[i].length === 0 ? (
                <span className="text-xs italic text-slate-400">No tasks</span>
              ) : (
                tasksByDay[i].map((task) => (
                  <div key={task.id} className="print-task mb-2 rounded border border-slate-200 p-1.5 text-xs">
                    <div className="font-semibold leading-tight">{task.title}</div>
                    <div className="mt-0.5 text-[10px] text-slate-600">{formatRange(task.startDate, task.endDate)}</div>
                    <div className="mt-0.5 text-[10px]">
                      <span className={`inline-block rounded px-1 py-0.5 font-medium ${
                        task.status === 'done' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                        task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>{statusLabel(task.status)}</span>
                    </div>
                    {notesByTask[task.id]?.length > 0 && (
                      <ul className="mt-1 list-disc pl-3 text-[10px] text-slate-700">
                        {notesByTask[task.id].map((note) => (
                          <li key={note.id}>{note.text}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
