import { drizzle } from 'drizzle-orm/libsql'

// Minimal Turso HTTP client that avoids bundled _fetch capture issues.
// Uses fetch() directly at call time, which works reliably in Vercel Lambda.
function makeTursoClient() {
  const databaseUrl = process.env.TURSO_DATABASE_URL!.replace(/^libsql:\/\//, 'https://')
  const authToken = process.env.TURSO_AUTH_TOKEN!

  async function execute(sql: string, args: unknown[] = []) {
    const res = await fetch(`${databaseUrl}/v2/pipeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        requests: [
          { type: 'execute', stmt: { sql, args: args.map(toValue) } },
          { type: 'close' },
        ],
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Turso HTTP ${res.status}: ${text}`)
    }
    const data: any = await res.json()
    const result = data.results[0]
    if (result.type === 'error') throw new Error(result.error.message)
    return toResult(result.response.result)
  }

  function toValue(v: unknown): unknown {
    if (v === null || v === undefined) return { type: 'null' }
    if (typeof v === 'number') return { type: 'float', value: String(v) }
    if (typeof v === 'bigint') return { type: 'integer', value: String(v) }
    if (typeof v === 'boolean') return { type: 'integer', value: v ? '1' : '0' }
    return { type: 'text', value: String(v) }
  }

  function toResult(raw: any) {
    const cols = raw.cols.map((c: any) => ({ name: c.name, decltype: c.decltype ?? null }))
    const rows = raw.rows.map((row: any[]) => {
      const obj: any = row.map((cell: any) => {
        if (!cell || cell.type === 'null') return null
        if (cell.type === 'integer') return BigInt(cell.value)
        return cell.value
      })
      cols.forEach((c: any, i: number) => { obj[c.name] = obj[i] })
      return obj
    })
    return {
      columns: cols.map((c: any) => c.name),
      columnTypes: cols.map((c: any) => c.decltype ?? ''),
      rows,
      rowsAffected: raw.affected_row_count ?? 0,
      lastInsertRowid: raw.last_insert_rowid != null ? BigInt(raw.last_insert_rowid) : undefined,
      toJSON() { return { columns: this.columns, columnTypes: this.columnTypes, rows: this.rows, rowsAffected: this.rowsAffected, lastInsertRowid: this.lastInsertRowid?.toString() } },
    }
  }

  return {
    execute,
    async batch(stmts: { sql: string; args?: unknown[] }[]) {
      const requests = [
        ...stmts.map(s => ({ type: 'execute', stmt: { sql: s.sql, args: (s.args ?? []).map(toValue) } })),
        { type: 'close' },
      ]
      const res = await fetch(`${databaseUrl}/v2/pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ requests }),
      })
      if (!res.ok) throw new Error(`Turso HTTP ${res.status}`)
      const data: any = await res.json()
      return data.results.slice(0, -1).map((r: any) => {
        if (r.type === 'error') throw new Error(r.error.message)
        return toResult(r.response.result)
      })
    },
    async executeMultiple(sql: string) {
      return execute(sql, [])
    },
    close() {},
    closed: false,
  }
}

let _db: ReturnType<typeof drizzle> | undefined

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    if (!_db) _db = drizzle(makeTursoClient() as any)
    return (_db as any)[prop]
  },
})
