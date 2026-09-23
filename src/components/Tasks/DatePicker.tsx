import { useState, useRef, useEffect } from 'react'

function isoParts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return { year: y, month: m - 1, day: d }
}

function formatDisplay(year: number, month: number, day: number) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${day} ${months[month]} ${year}`
}

function isoString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const sel = value ? isoParts(value) : (() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() } })()
  const [viewMonth, setViewMonth] = useState(sel.year * 12 + sel.month)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const year = Math.floor(viewMonth / 12)
  const month = viewMonth % 12
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function isSelected(day: number) {
    return sel.year === year && sel.month === month && sel.day === day
  }

  function isToday(day: number) {
    const now = new Date()
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day
  }

  function pick(day: number) {
    onChange(isoString(year, month, day))
    setOpen(false)
  }

  function handleOpen() {
    if (open) { setOpen(false); return }
    const r = btnRef.current?.getBoundingClientRect()
    if (r) {
      let left = r.left
      if (left + 256 > window.innerWidth) left = r.right - 256
      setPos({ top: r.bottom + 4, left })
    }
    setOpen(true)
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-left dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      >
        {value ? formatDisplay(sel.year, sel.month, sel.day) : 'Select date'}
      </button>
      {open && (
        <div
          className="fixed z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => setViewMonth(viewMonth - 1)} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">‹</button>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">{FULL_MONTHS[month]} {year}</span>
            <button type="button" onClick={() => setViewMonth(viewMonth + 1)} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">›</button>
          </div>
          <div className="grid grid-cols-7 gap-0 text-center text-xs">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map((l) => (
              <div key={l} className="py-1 font-medium text-slate-400">{l}</div>
            ))}
            {cells.map((d, i) => (
              <div key={i}>
                {d !== null ? (
                  <button
                    type="button"
                    onClick={() => pick(d)}
                    className={`h-7 w-full rounded text-sm ${
                      isSelected(d)
                        ? 'bg-green-600 font-semibold text-white'
                        : isToday(d)
                          ? 'font-semibold text-green-600'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ) : (
                  <div className="h-7" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}