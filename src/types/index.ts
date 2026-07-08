export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'done'

export interface Task {
  id?: number
  title: string
  zone: string
  subcontractor?: string
  startDate: string
  endDate: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
  syncStatus: 'synced' | 'pending' | 'conflict'
}

export interface Note {
  id?: number
  taskId: number
  timestamp: string
  user: string
  text: string
  imageUrls: string[]
  createdAt: string
  syncStatus: 'synced' | 'pending' | 'conflict'
}

export interface Setting {
  key: string
  value: string[]
}

export const DEFAULT_ZONES = [
  'Foundation',
  'Structure',
  'MEP',
  'Interior',
  'Exterior',
  'Roof',
] as const

export const DEFAULT_SUBCONTRACTORS = [
  'Concrete',
  'Steel',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Finishing',
] as const
