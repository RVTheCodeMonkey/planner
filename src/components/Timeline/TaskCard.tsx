import { useState } from 'react'
import type { Task } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  todo: 'border-l-green-500',
  'in-progress': 'border-l-amber-500',
  blocked: 'border-l-red-500',
  done: 'border-l-green-500',
}

const SUBTASK_COLORS: Record<string, string> = {
  todo: 'bg-green-400',
  'in-progress': 'bg-amber-400',
  blocked: 'bg-red-400',
  done: 'bg-green-400',
}

const DAY_LABEL_WIDTH = 32
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function dateKey(iso: string) {
  return iso.slice(0, 10)
}

function dayIndex(isoDate: string, dayHeaders: Date[]) {
  const target = dateKey(isoDate)
  for (let i = 0; i < dayHeaders.length; i++) {
    const d = dayHeaders[i]
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (key === target) return i
  }
  return -1
}

function formatLabel(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

export function TaskCard({ task, dayHeaders, topOffset = 0, onClick }: { task: Task; dayHeaders: Date[]; topOffset?: number; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  const startIdx = dayIndex(task.startDate, dayHeaders)
  const endIdx = dayIndex(task.endDate, dayHeaders)

  function headerKey(i: number) {
    const d = dayHeaders[i]
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const targetStart = task.startDate.slice(0, 10)
  const targetEnd = task.endDate.slice(0, 10)
  const firstKey = dayHeaders.length > 0 ? headerKey(0) : ''
  const lastKey = dayHeaders.length > 0 ? headerKey(dayHeaders.length - 1) : ''

  const beforeGrid = targetStart < firstKey
  const afterGrid = targetEnd > lastKey

  // Completely outside grid → don't render
  if (targetEnd < firstKey || targetStart > lastKey) return null

  const start = beforeGrid ? 0 : startIdx
  const end = afterGrid ? dayHeaders.length - 1 : (endIdx >= startIdx ? endIdx : startIdx)
  const span = end - start + 1

  const left = start * DAY_LABEL_WIDTH + 4
  const width = span * DAY_LABEL_WIDTH - 8

  const isSubtask = !!task.parentId

  if (isSubtask) {
    return (
      <button
        onClick={onClick}
        className="absolute flex items-center justify-center"
        style={{ left: start * DAY_LABEL_WIDTH, width: DAY_LABEL_WIDTH, top: 30 + topOffset, height: 28 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={`h-8 w-1.5 rounded-full ${SUBTASK_COLORS[task.status]}`} />
        {hover && (
          <div className="absolute left-full ml-1.5 z-30 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-slate-200 dark:text-slate-900">
            {task.title} — {formatLabel(task.startDate)}
          </div>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`absolute flex flex-col gap-0.5 rounded-lg border border-green-500 border-l-4 bg-white px-2 py-1.5 text-left shadow-sm transition-shadow hover:shadow-md active:shadow-md dark:border-green-600 dark:bg-slate-800 ${STATUS_COLORS[task.status]}`}
      style={{ left, width: Math.max(width, 100), top: 4 + topOffset, minHeight: 50 }}
    >
      <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
        {task.title}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {task.zone}
        {task.subcontractor ? ` · ${task.subcontractor}` : ''}
      </span>
      <span className="text-[11px] text-slate-400 dark:text-slate-500">
        {formatLabel(task.startDate)}
        {' – '}
        {formatLabel(task.endDate)}
      </span>
    </button>
  )
}