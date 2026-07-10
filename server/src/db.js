import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.PGHOST || 'postgres',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE || 'siteplanner',
  user: process.env.PGUSER || 'planner',
  password: process.env.PGPASSWORD || 'planner',
})

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      zone TEXT NOT NULL,
      subcontractor TEXT,
      parent_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'todo',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "user" TEXT NOT NULL,
      text TEXT NOT NULL,
      image_urls TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
  // migration: add parent_id if missing
  try { await pool.query(`ALTER TABLE tasks ADD COLUMN parent_id TEXT REFERENCES tasks(id) ON DELETE CASCADE`) } catch {}
  console.log('Database tables ready')
}

export { pool, initDb }
