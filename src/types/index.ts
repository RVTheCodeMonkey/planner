export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'done'

export interface Task {
  id: string
  title: string
  zone: string
  subcontractor?: string
  startDate: string
  endDate: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  taskId: string
  timestamp: string
  user: string
  text: string
  imageUrls: string[]
  createdAt: string
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
