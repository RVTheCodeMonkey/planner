import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { pool, initDb } from './db.js'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server, path: '/ws' })

app.use(cors())
app.use(express.json())

const clients = new Set()
wss.on('connection', (ws) => {
  clients.add(ws)
  ws.on('close', () => clients.delete(ws))
})

function broadcast(data) {
  const msg = JSON.stringify(data)
  for (const client of clients) {
    if (client.readyState === 1) client.send(msg)
  }
}

app.get('/api/tasks', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks ORDER BY start_date')
  res.json(rows)
})

app.post('/api/tasks', async (req, res) => {
  const { id, title, zone, subcontractor, startDate, endDate, status, createdAt, updatedAt } = req.body
  await pool.query(
    `INSERT INTO tasks (id, title, zone, subcontractor, start_date, end_date, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, title, zone, subcontractor || null, startDate, endDate, status, createdAt, updatedAt],
  )
  const data = { ...req.body, syncStatus: 'synced' }
  broadcast({ type: 'task-created', data })
  res.status(201).json(data)
})

app.put('/api/tasks/:id', async (req, res) => {
  const { title, zone, subcontractor, startDate, endDate, status, updatedAt } = req.body
  await pool.query(
    `UPDATE tasks SET title=$1, zone=$2, subcontractor=$3, start_date=$4, end_date=$5, status=$6, updated_at=$7 WHERE id=$8`,
    [title, zone, subcontractor || null, startDate, endDate, status, updatedAt, req.params.id],
  )
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id=$1', [req.params.id])
  const data = { ...rows[0], syncStatus: 'synced' }
  broadcast({ type: 'task-updated', data })
  res.json(data)
})

app.delete('/api/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id])
  broadcast({ type: 'task-deleted', data: { id: req.params.id } })
  res.status(204).end()
})

app.get('/api/tasks/:taskId/notes', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM notes WHERE task_id=$1 ORDER BY timestamp', [req.params.taskId])
  res.json(rows)
})

app.post('/api/notes', async (req, res) => {
  const { id, taskId, timestamp, user, text, imageUrls, createdAt } = req.body
  await pool.query(
    `INSERT INTO notes (id, task_id, timestamp, "user", text, image_urls, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, taskId, timestamp, user, text, imageUrls || [], createdAt],
  )
  const data = { ...req.body, syncStatus: 'synced' }
  broadcast({ type: 'note-created', data })
  res.status(201).json(data)
})

const PORT = parseInt(process.env.PORT || '3001')
await initDb()
server.listen(PORT, () => console.log(`API server on :${PORT}`))
