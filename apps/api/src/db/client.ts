import { drizzle } from 'drizzle-orm/libsql'

type InValue = null | undefined | boolean | number | bigint | string | ArrayBuffer
type InArgs = InValue[]
type InStatement = string | { sql: string; args?: InArgs }

// Minimal Turso HTTP client that avoids bundled _fetch capture issues.
// Uses fetch() directly at call time, which works reliably in Vercel Lambda.
function makeTursoClient() {
  const databaseUrl = process.env.TURSO_DATABASE_URL!.replace(/^libsql:\/\//, 'https://')
  const authToken = process.env.TURSO_AUTH_TOKEN!

  function normalise(stmt: InStatement): { sql: string; args: InArgs } {
    if (typeof stmt === 'string') return { sql: stmt, args: [] }
    return { sql: stmt.sql, args: stmt.args ?? [] }
  }

  function toValue(v: InValue): unknown {
    if (v === null || v === undefined) return { type: 'null' }
    if (typeof v === 'bigint') return { type: 'integer', value: String(v) }
    if (typeof v === 'boolean') return { type: 'integer', value: v ? '1' : '0' }
    if (typeof v === 'number') return { type: 'float', value: String(v) }
    if (v instanceof ArrayBuffer) return { type: 'blob', base64: btoa(String.fromCharCode(...new Uint8Array(v))) }
    return { type: 'text', value: String(v) }
  }

  function toResult(raw: any) {
    const cols = raw.cols.map((c: any) => ({ name: c.name, decltype: c.decltype ?? null }))
    const rows = raw.rows.map((row: any[]) => {
      const r: any = row.map((cell: any) => {
        if (!cell || cell.type === 'null') return null
        if (cell.type === 'integer') return BigInt(cell.value)
        if (cell.type === 'blob') return Uint8Array.from(atob(cell.base64), c => c.charCodeAt(0)).buffer
        return cell.value
      })
      cols.forEach((c: any, i: number) => { r[c.name] = r[i] })
      return r
    })
    return {
      columns: cols.map((c: any) => c.name),
      columnTypes: cols.map((c: any) => c.decltype ?? ''),
      rows,
      rowsAffected: raw.affected_row_count ?? 0,
      lastInsertRowid: raw.last_insert_rowid != null ? BigInt(raw.last_insert_rowid) : undefined,
      toJSON() {
        return {
          columns: this.columns,
          columnTypes: this.columnTypes,
          rows: this.rows,
          rowsAffected: this.rowsAffected,
          lastInsertRowid: this.lastInsertRowid?.toString(),
        }
      },
    }
  }

  async function pipeline(requests: unknown[]) {
    const res = await fetch(`${databaseUrl}/v2/pipeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ requests: [...requests, { type: 'close' }] }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Turso HTTP ${res.status}: ${text}`)
    }
    return (await res.json() as any).results as any[]
  }

  return {
    async execute(stmt: InStatement) {
      const { sql, args } = normalise(stmt)
      const results = await pipeline([
        { type: 'execute', stmt: { sql, args: args.map(toValue) } },
      ])
      const r = results[0]
      if (r.type === 'error') throw new Error(r.error.message)
      return toResult(r.response.result)
    },

    async batch(stmts: InStatement[]) {
      const requests = stmts.map(s => {
        const { sql, args } = normalise(s)
        return { type: 'execute', stmt: { sql, args: args.map(toValue) } }
      })
      const results = await pipeline(requests)
      return results.slice(0, -1).map((r: any) => {
        if (r.type === 'error') throw new Error(r.error.message)
        return toResult(r.response.result)
      })
    },

    async executeMultiple(sql: string) {
      const results = await pipeline([
        { type: 'execute', stmt: { sql, args: [] } },
      ])
      const r = results[0]
      if (r.type === 'error') throw new Error(r.error.message)
      return toResult(r.response.result)
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
