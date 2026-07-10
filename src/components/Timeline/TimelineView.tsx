import { useRef } from 'react'
import type { Task } from '../../types'
import { TimelineRow } from './TimelineRow'

function generateDayHeaders(count: number, pastDays: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() - pastDays)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}

function isToday(d: Date) {
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

function isWeekend(d: Date) {
  return d.getDay() === 0 || d.getDay() === 6
}

function getDayLabel(d: Date) {
  return ['Mo','Tu','We','Th','Fr','Sa','Su'][d.getDay() === 0 ? 6 : d.getDay() - 1]
}

function getWeekNumber(d: Date) {
  const copy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = copy.getUTCDay() || 7
  copy.setUTCDate(copy.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1))
  return Math.ceil((((copy.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

const DAYS_RANGE = 150
const PAST_DAYS = 14
const DAY_LABEL_WIDTH = 32

export function TimelineView({
  tasks,
  zones,
  onTaskClick,
}: {
  tasks: Task[]
  zones: string[]
  onTaskClick: (task: Task) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dayHeaders = generateDayHeaders(DAYS_RANGE, PAST_DAYS)

  const weekStarts = new Set<number>()
  let lastW = -1
  dayHeaders.forEach((d, i) => {
    const wn = getWeekNumber(d)
    if (wn !== lastW) { weekStarts.add(i); lastW = wn }
  })

  const rows = zones.map((zone) => ({
    label: zone,
    tasks: tasks.filter((t) => t.zone === zone),
  }))

  const totalWidth = DAYS_RANGE * DAY_LABEL_WIDTH

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto" ref={scrollRef}>
        <div style={{ width: totalWidth, minWidth: '100%' }}>

          {/* Spacer */}
          <div className="flex bg-slate-100 dark:bg-slate-900" style={{ height: 8 }}>
            <div className="sticky left-0 z-10 w-36 shrink-0 bg-slate-100 dark:bg-slate-900" />
          </div>

          {/* Month headers */}
          <div className="sticky top-0 z-20 flex bg-white dark:bg-slate-950">
            <div className="sticky left-0 z-10 w-36 shrink-0 bg-slate-100 dark:bg-slate-900" />
            <div className="relative flex" style={{ width: totalWidth }}>
              {(() => {
                let lastMonth = -1
                const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                return dayHeaders.map((d, i) => {
                  const showMonth = d.getMonth() !== lastMonth
                  if (showMonth) lastMonth = d.getMonth()
                  return (
                    <div
                      key={`m-${i}`}
                      className={`flex shrink-0 items-center justify-center border-b text-[10px] font-semibold uppercase tracking-wider ${
                        weekStarts.has(i) ? 'border-l border-slate-400 dark:border-slate-500' : ''
                      } border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400`}
                      style={{ width: DAY_LABEL_WIDTH, height: 18 }}
                    >
                      {showMonth ? monthLabels[d.getMonth()] : ''}
                    </div>
                  )
                })
              })()}
            </div>
          </div>

          {/* Week number */}
          <div className="sticky top-[18px] z-20 flex bg-white dark:bg-slate-950">
            <div className="sticky left-0 z-10 w-36 shrink-0 bg-slate-100 dark:bg-slate-900" />
            <div className="flex" style={{ width: totalWidth }}>
              {(() => {
                let lastWeek = -1
                return dayHeaders.map((d, i) => {
                  const wn = getWeekNumber(d)
                  const showWeek = wn !== lastWeek
                  if (showWeek) lastWeek = wn
                  return (
                    <div
                      key={`w-${i}`}
                      className={`flex shrink-0 items-center justify-center border-b text-xs font-bold ${
                        showWeek ? 'border-l border-slate-400 dark:border-slate-500 text-[#ffff00] dark:text-[#ffff00]' : 'border-slate-300 text-amber-400 dark:border-slate-600 dark:text-amber-400'
                      }`}
                      style={{ width: DAY_LABEL_WIDTH, height: 16 }}
                    >
                      {showWeek ? `W${wn}` : ''}
                    </div>
                  )
                })
              })()}
            </div>
          </div>

          {/* Day-of-week + day number */}
          <div className="sticky top-[34px] z-20 flex bg-white dark:bg-slate-950">
            <div className="sticky left-0 z-10 w-36 shrink-0 bg-slate-100 dark:bg-slate-900" />
            <div className="flex" style={{ width: totalWidth }}>
              {dayHeaders.map((d, i) => {
                const today = isToday(d)
                const weekend = isWeekend(d)
                return (
                  <div
                    key={`d-${i}`}
                    className={`flex shrink-0 flex-col items-center justify-center border-b text-[10px] leading-tight ${
                      weekStarts.has(i) ? 'border-l border-slate-400 dark:border-slate-500' : ''
                    } ${
                      today
                        ? 'border-b-2 border-b-green-500 bg-green-50 font-bold text-green-700 dark:bg-green-950 dark:text-green-300'
                        : weekend
                          ? 'border-b border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500'
                          : 'border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                    }`}
                    style={{ width: DAY_LABEL_WIDTH, height: 28 }}
                  >
                    <span>{getDayLabel(d)}</span>
                    <span>{d.getDate()}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {rows.map((row) => (
            <TimelineRow key={row.label} label={row.label} tasks={row.tasks} dayHeaders={dayHeaders} weekStarts={weekStarts} onTaskClick={onTaskClick} />
          ))}
        </div>
      </div>
    </div>
  )
}