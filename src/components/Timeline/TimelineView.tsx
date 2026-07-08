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

const DAYS_RANGE = 42
const DAY_LABEL_WIDTH = 28

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

  const rows = zones.map((zone) => ({
    label: zone,
    tasks: tasks.filter((t) => t.zone === zone),
  }))

  const columnVirtualizer = useVirtualizer({
    count: dayHeaders.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => DAY_LABEL_WIDTH,
    horizontal: true,
  })

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Group by:</span>
        <span className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white">Zones</span>
      </div>

      <div className="overflow-x-auto" ref={scrollRef}>
        <div style={{ width: DAYS_RANGE * DAY_LABEL_WIDTH, minWidth: '100%' }}>
          <div className="sticky top-0 z-20 flex bg-white dark:bg-slate-950">
            <div className="sticky left-0 z-10 w-36 shrink-0 bg-slate-100 dark:bg-slate-900" />
            {columnVirtualizer.getVirtualItems().map((vc) => {
              const d = dayHeaders[vc.index]
              return (
                <div
                  key={vc.key}
                  className="flex shrink-0 items-center justify-center border-b border-slate-200 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400"
                  style={{ width: vc.size, height: 28, transform: `translateX(${vc.start}px)` }}
                >
                  {d.getDate()}
                </div>
              )
            })}
            <div style={{ width: columnVirtualizer.getTotalSize() - DAYS_RANGE * DAY_LABEL_WIDTH }} />
          </div>

          {rows.map((row) => (
            <TimelineRow key={row.label} label={row.label} tasks={row.tasks} onTaskClick={onTaskClick} />
          ))}
        </div>
      </div>
    </div>
  )
}
