import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const STATE_ID = 'shared-anonymous-league'

let cachedPool: Pool | null = null

function getPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not configured')
  cachedPool ??= new Pool({ connectionString })
  return cachedPool
}

async function ensureTable() {
  await getPool().query(`CREATE TABLE IF NOT EXISTS league_state (id text PRIMARY KEY, payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`)
}

export async function GET() {
  try {
    await ensureTable()
    const result = await getPool().query('SELECT payload FROM league_state WHERE id = $1', [STATE_ID])
    return NextResponse.json({ state: result.rows[0]?.payload ?? null })
  } catch (error) {
    console.error('Error leyendo estado de Neon:', error)
    return NextResponse.json({ error: 'No se pudo leer el estado' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const state = await request.json()
  if (!state || typeof state !== 'object' || Array.isArray(state)) return NextResponse.json({ error: 'Invalid state' }, { status: 400 })
  try {
    await ensureTable()
    await getPool().query('INSERT INTO league_state (id, payload) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()', [STATE_ID, JSON.stringify(state)])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error guardando estado en Neon:', error)
    return NextResponse.json({ error: 'No se pudo guardar el estado' }, { status: 500 })
  }
}
