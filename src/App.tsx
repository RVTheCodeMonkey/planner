import { useState, useEffect } from 'react'
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
  const { tasks, createTask } = useTasks()
  const { zones, subcontractors, addZone, renameZone, deleteZone, ensureDefaults } = useSettings()
  useRealtimeSync()
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => { ensureDefaults() }, [])

  async function handleSaveTask(data: TaskFormData) {
    await createTask({
      title: data.title,
      zone: data.zone,
      subcontractor: data.subcontractor || undefined,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
    })
    setShowTaskModal(false)
  }

  function handleTaskClick(task: Task) {
    setSelectedTask(task)
    setShowNotes(true)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-slate-950">
      <Header
        onAddTask={() => setShowTaskModal(true)}
        onManageZones={() => setShowSettings(true)}
      />
      <main className="flex-1">
        <TimelineView tasks={tasks} zones={zones} onTaskClick={handleTaskClick} />
      </main>

      {showTaskModal && (
        <TaskModal
          zones={zones}
          subcontractors={subcontractors}
          onSave={handleSaveTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {showNotes && selectedTask && (
        <NotePanel task={selectedTask} onClose={() => { setShowNotes(false); setSelectedTask(null) }} />
      )}

      {showSettings && (
        <SettingsModal
          zones={zones}
          addZone={addZone}
          renameZone={renameZone}
          deleteZone={deleteZone}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
