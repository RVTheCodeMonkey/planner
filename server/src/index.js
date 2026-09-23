import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { pool, initDb } from './db.js'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server, path: '/ws' })

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

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
  const { rows } = await pool.query(
    `SELECT id, title, zone, subcontractor, parent_id, 
            to_char(start_date, 'YYYY-MM-DD') as start_date, 
            to_char(end_date, 'YYYY-MM-DD') as end_date, 
            status, created_at, updated_at 
     FROM tasks ORDER BY start_date`
  )
  res.json(rows)
})

app.post('/api/tasks', async (req, res) => {
  const { id, title, zone, subcontractor, parentId, startDate, endDate, status, createdAt, updatedAt } = req.body
  await pool.query(
    `INSERT INTO tasks (id, title, zone, subcontractor, parent_id, start_date, end_date, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6::date, $7::date, $8, $9, $10)`,
    [id, title, zone, subcontractor || null, parentId || null, startDate, endDate, status, createdAt, updatedAt],
  )
  const data = { ...req.body, syncStatus: 'synced' }
  broadcast({ type: 'task-created', data })
  res.status(201).json(data)
})

app.put('/api/tasks/:id', async (req, res) => {
  const { title, zone, subcontractor, startDate, endDate, status, updatedAt } = req.body
  await pool.query(
    `UPDATE tasks SET title=$1, zone=$2, subcontractor=$3, start_date=$4::date, end_date=$5::date, status=$6, updated_at=$7 WHERE id=$8`,
    [title, zone, subcontractor || null, startDate, endDate, status, updatedAt, req.params.id],
  )
  const { rows } = await pool.query(
    `SELECT id, title, zone, subcontractor, parent_id, 
            to_char(start_date, 'YYYY-MM-DD') as start_date, 
            to_char(end_date, 'YYYY-MM-DD') as end_date, 
            status, created_at, updated_at 
     FROM tasks WHERE id=$1`,
    [req.params.id]
  )
  const data = { ...rows[0], syncStatus: 'synced' }
  broadcast({ type: 'task-updated', data })
  res.json(data)
})

app.delete('/api/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id])
  broadcast({ type: 'task-deleted', data: { id: req.params.id } })
  res.status(204).end()
})

app.get('/api/notes', async (req, res) => {
  const { taskIds } = req.query
  if (taskIds && taskIds.length > 0) {
    const ids = taskIds.split(',')
    const { rows } = await pool.query(
      'SELECT * FROM notes WHERE task_id = ANY($1) ORDER BY timestamp',
      [ids],
    )
    return res.json(rows)
  }
  const { rows } = await pool.query('SELECT * FROM notes ORDER BY timestamp')
  res.json(rows)
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

app.put('/api/notes/:id', async (req, res) => {
  const { text } = req.body
  await pool.query(`UPDATE notes SET text=$1 WHERE id=$2`, [text, req.params.id])
  const { rows } = await pool.query('SELECT * FROM notes WHERE id=$1', [req.params.id])
  const data = { ...rows[0], syncStatus: 'synced' }
  broadcast({ type: 'note-updated', data })
  res.json(data)
})

app.delete('/api/notes/:id', async (req, res) => {
  await pool.query('DELETE FROM notes WHERE id=$1', [req.params.id])
  broadcast({ type: 'note-deleted', data: { id: req.params.id } })
  res.status(204).end()
})

const PORT = parseInt(process.env.PORT || '3001')
await initDb()
server.listen(PORT, () => console.log(`API server on :${PORT}`))
