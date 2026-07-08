import { useLiveQuery } from './useLiveQuery'
import { db } from '../db/db'
import { DEFAULT_ZONES, DEFAULT_SUBCONTRACTORS } from '../types'

async function ensureDefaults() {
  const zones = await db.settings.get('zones')
  if (!zones) await db.settings.put({ key: 'zones', value: [...DEFAULT_ZONES] })
  const subs = await db.settings.get('subcontractors')
  if (!subs) await db.settings.put({ key: 'subcontractors', value: [...DEFAULT_SUBCONTRACTORS] })
}

export function useSettings() {
  const zonesSetting = useLiveQuery(() => db.settings.get('zones'), [])
  const subsSetting = useLiveQuery(() => db.settings.get('subcontractors'), [])

  const zones = zonesSetting?.value ?? [...DEFAULT_ZONES]
  const subcontractors = subsSetting?.value ?? [...DEFAULT_SUBCONTRACTORS]

  async function addZone(name: string) {
    const current = await db.settings.get('zones')
    const list = current?.value ?? [...DEFAULT_ZONES]
    if (!list.includes(name)) {
      await db.settings.put({ key: 'zones', value: [...list, name] })
    }
  }

  async function renameZone(oldName: string, newName: string) {
    const current = await db.settings.get('zones')
    const list = current?.value ?? [...DEFAULT_ZONES]
    const updated = await db.settings.put({
      key: 'zones',
      value: list.map((z) => (z === oldName ? newName : z)),
    })
    await db.tasks.where('zone').equals(oldName).modify({ zone: newName })
    return updated
  }

  async function deleteZone(name: string) {
    const current = await db.settings.get('zones')
    const list = current?.value ?? [...DEFAULT_ZONES]
    await db.settings.put({ key: 'zones', value: list.filter((z) => z !== name) })
  }

  async function addSubcontractor(name: string) {
    const current = await db.settings.get('subcontractors')
    const list = current?.value ?? [...DEFAULT_SUBCONTRACTORS]
    if (!list.includes(name)) {
      await db.settings.put({ key: 'subcontractors', value: [...list, name] })
    }
  }

  return { zones, subcontractors, addZone, renameZone, deleteZone, addSubcontractor, ensureDefaults }
}
