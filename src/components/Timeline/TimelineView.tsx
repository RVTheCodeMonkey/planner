import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Task } from '../../types'
import { TimelineRow } from './TimelineRow'

function generateDayHeaders(count: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today)
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

function getWeekNumber(d: Date) {
  const copy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = copy.getUTCDay() || 7
  copy.setUTCDate(copy.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1))
  return Math.ceil((((copy.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

const DAYS_RANGE = 42
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
  const dayHeaders = generateDayHeaders(DAYS_RANGE)

  const columnVirtualizer = useVirtualizer({
    count: dayHeaders.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => DAY_LABEL_WIDTH,
    horizontal: true,
  })

  const rows = zones.map((zone) => ({
    label: zone,
    tasks: tasks.filter((t) => t.zone === zone),
  }))

  const totalWidth = DAYS_RANGE * DAY_LABEL_WIDTH

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Group by:</span>
        <span className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white">Zones</span>
      </div>

      <div className="overflow-x-auto" ref={scrollRef}>
        <div style={{ width: totalWidth, minWidth: '100%' }}>

          {/* Month headers */}
          <div className="sticky top-0 z-20 flex bg-white dark:bg-slate-950">
            <div className="sticky left-0 z-10 w-36 shrink-0 bg-slate-100 dark:bg-slate-900" />
            {(() => {
              let lastMonth = -1
              return columnVirtualizer.getVirtualItems().map((vc) => {
                const d = dayHeaders[vc.index]
                const showMonth = d.getMonth() !== lastMonth
                if (showMonth) lastMonth = d.getMonth()
                const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                return (
                  <div
                    key={`m-${vc.key}`}
                    className="flex shrink-0 items-center justify-center border-b border-slate-300 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-600 dark:text-slate-400"
                    style={{ width: vc.size, height: 18, transform: `translateX(${vc.start}px)` }}
                  >
                    {showMonth ? monthLabels[d.getMonth()] : ''}
                  </div>
                )
              })
            })()}
            <div style={{ width: columnVirtualizer.getTotalSize() - totalWidth }} />
          </div>

          {/* Week number */}
          <div className="sticky top-[18px] z-20 flex bg-white dark:bg-slate-950">
            <div className="sticky left-0 z-10 w-36 shrink-0 bg-slate-100 dark:bg-slate-900" />
            {(() => {
              let lastWeek = -1
              return columnVirtualizer.getVirtualItems().map((vc) => {
                const d = dayHeaders[vc.index]
                const wn = getWeekNumber(d)
                const showWeek = wn !== lastWeek
                if (showWeek) lastWeek = wn
                return (
                  <div
                    key={`w-${vc.key}`}
                    className="flex shrink-0 items-center justify-center border-b border-slate-300 text-[10px] font-semibold text-slate-500 dark:border-slate-600 dark:text-slate-400"
                    style={{ width: vc.size, height: 16, transform: `translateX(${vc.start}px)` }}
                  >
                    {showWeek ? `W${wn}` : ''}
                  </div>
                )
              })
            })()}
            <div style={{ width: columnVirtualizer.getTotalSize() - totalWidth }} />
          </div>

          {/* Day-of-week + day number */}
          <div className="sticky top-[34px] z-20 flex bg-white dark:bg-slate-950">
            <div className="sticky left-0 z-10 w-36 shrink-0 bg-slate-100 dark:bg-slate-900" />
            {columnVirtualizer.getVirtualItems().map((vc) => {
              const d = dayHeaders[vc.index]
              const today = isToday(d)
              const weekend = isWeekend(d)
              return (
                <div
                  key={`d-${vc.key}`}
                  className={`flex shrink-0 flex-col items-center justify-center border-b text-[10px] leading-tight ${
                    today
                      ? 'border-b-2 border-b-blue-500 bg-blue-50 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : weekend
                        ? 'border-b border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500'
                        : 'border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                  }`}
                  style={{ width: vc.size, height: 28, transform: `translateX(${vc.start}px)` }}
                >
                  <span>{['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()]}</span>
                  <span>{d.getDate()}</span>
                </div>
              )
            })}
            <div style={{ width: columnVirtualizer.getTotalSize() - totalWidth }} />
          </div>

          {rows.map((row) => (
            <TimelineRow key={row.label} label={row.label} tasks={row.tasks} dayHeaders={dayHeaders} onTaskClick={onTaskClick} />
          ))}
        </div>
      </div>
    </div>
  )
}