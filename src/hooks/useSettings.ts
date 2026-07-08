import { useState, useCallback } from 'react'
import { DEFAULT_ZONES, DEFAULT_SUBCONTRACTORS } from '../types'

function apiUrl() {
  return `${window.location.protocol}//${window.location.host}`
}

function loadList(key: string, fallback: readonly string[]): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return [...fallback]
}

function saveList(key: string, list: string[]) {
  try { localStorage.setItem(key, JSON.stringify(list)) } catch {}
}

export function useSettings() {
  const [zones, setZones] = useState<string[]>(() => loadList('zones', DEFAULT_ZONES))
  const [subcontractors, setSubs] = useState<string[]>(() => loadList('subcontractors', DEFAULT_SUBCONTRACTORS))

  const addZone = useCallback(async (name: string) => {
    setZones(prev => {
      if (prev.includes(name)) return prev
      const next = [...prev, name]
      saveList('zones', next)
      return next
    })
  }, [])

  const renameZone = useCallback(async (oldName: string, newName: string) => {
    try {
      const r = await fetch(`${apiUrl()}/api/tasks`, { cache: 'no-store' })
      if (r.ok) {
        const tasks = await r.json()
        for (const t of tasks) {
          if (t.zone === oldName) {
            await fetch(`${apiUrl()}/api/tasks/${t.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ zone: newName, updatedAt: new Date().toISOString() }),
            })
          }
        }
      }
    } catch (e) {
      console.error('rename zone task update failed', e)
    }
    setZones(prev => {
      if (!prev.includes(oldName)) return prev
      const next = prev.map(z => z === oldName ? newName : z)
      saveList('zones', next)
      return next
    })
  }, [])

  const deleteZone = useCallback(async (name: string) => {
    setZones(prev => {
      const next = prev.filter(z => z !== name)
      saveList('zones', next)
      return next
    })
  }, [])

  const addSubcontractor = useCallback(async (name: string) => {
    setSubs(prev => {
      if (prev.includes(name)) return prev
      const next = [...prev, name]
      saveList('subcontractors', next)
      return next
    })
  }, [])

  const renameSubcontractor = useCallback(async (oldName: string, newName: string) => {
    try {
      const r = await fetch(`${apiUrl()}/api/tasks`, { cache: 'no-store' })
      if (r.ok) {
        const tasks = await r.json()
        for (const t of tasks) {
          if (t.subcontractor === oldName) {
            await fetch(`${apiUrl()}/api/tasks/${t.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subcontractor: newName, updatedAt: new Date().toISOString() }),
            })
          }
        }
      }
    } catch (e) {
      console.error('rename subcontractor task update failed', e)
    }
    setSubs(prev => {
      if (!prev.includes(oldName)) return prev
      const next = prev.map(s => s === oldName ? newName : s)
      saveList('subcontractors', next)
      return next
    })
  }, [])

  const deleteSubcontractor = useCallback(async (name: string) => {
    setSubs(prev => {
      const next = prev.filter(s => s !== name)
      saveList('subcontractors', next)
      return next
    })
  }, [])

  return { zones, subcontractors, addZone, renameZone, deleteZone, addSubcontractor, renameSubcontractor, deleteSubcontractor }
}
