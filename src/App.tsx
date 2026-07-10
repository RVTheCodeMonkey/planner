import { useState, useCallback } from 'react'
import { useTasks } from './hooks/useTasks'
import { useSettings } from './hooks/useSettings'
import { useRealtimeSync } from './hooks/useRealtimeSync'
import { Header } from './components/Layout/Header'
import { TimelineView } from './components/Timeline/TimelineView'
import { TaskModal } from './components/Tasks/TaskModal'
import type { TaskFormData } from './components/Tasks/TaskModal'
import { NotePanel } from './components/Notes/NotePanel'
import { SettingsModal } from './components/Settings/SettingsModal'
import type { Task } from './types'

function App() {
  const { tasks, createTask, updateTask, deleteTask, refresh } = useTasks()
  const { zones, subcontractors, addZone, renameZone, deleteZone, addSubcontractor, renameSubcontractor, deleteSubcontractor } = useSettings()
  useRealtimeSync(useCallback(() => { refresh() }, [refresh]))

  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showNotes, setShowNotes] = useState(false)

  async function handleSaveTask(data: TaskFormData) {
    if (editingTask) {
      await updateTask(editingTask.id, {
        title: data.title,
        zone: data.zone,
        subcontractor: data.subcontractor || undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      })
      if (data.zone) addZone(data.zone)
      setEditingTask(null)
    } else {
      await createTask({
        title: data.title,
        zone: data.zone,
        subcontractor: data.subcontractor || undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      })
      if (data.zone) addZone(data.zone)
    }
    setShowTaskModal(false)
  }

  function handleTaskClick(task: Task) {
    setSelectedTask(task)
    setShowNotes(true)
  }

  function handleEditTask(task: Task) {
    setEditingTask(task)
    setSelectedTask(null)
    setShowNotes(false)
    setShowTaskModal(true)
  }

  async function handleDeleteTask(id: string) {
    await deleteTask(id)
    setSelectedTask(null)
    setShowNotes(false)
  }

  async function handleAddSubtask(parentId: string, title: string, date: string) {
    await createTask({
      title,
      zone: selectedTask?.zone || '',
      parentId,
      startDate: date,
      endDate: date,
      status: 'todo',
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-slate-950">
      <Header
        onAddTask={() => setShowTaskModal(true)}
        onSettings={() => setShowSettings(true)}
      />
      <main className="flex-1">
        <TimelineView tasks={tasks} zones={zones} onTaskClick={handleTaskClick} />
      </main>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          zones={zones}
          subcontractors={subcontractors}
          onSave={handleSaveTask}
          onClose={() => { setShowTaskModal(false); setEditingTask(null) }}
        />
      )}

      {showNotes && selectedTask && (
        <NotePanel
          task={selectedTask}
          subtasks={tasks.filter(t => t.parentId === selectedTask.id)}
          onAddSubtask={handleAddSubtask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onClose={() => { setShowNotes(false); setSelectedTask(null) }}
        />
      )}

      {showSettings && (
        <SettingsModal
          zones={zones}
          subcontractors={subcontractors}
          addZone={addZone}
          renameZone={renameZone}
          deleteZone={deleteZone}
          addSubcontractor={addSubcontractor}
          renameSubcontractor={renameSubcontractor}
          deleteSubcontractor={deleteSubcontractor}
          onClose={() => setShowSettings(false)}
          onRefresh={refresh}
        />
      )}
    </div>
  )
}

export default App
