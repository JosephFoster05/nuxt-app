import { readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body || {}

  if (!username || !email) {
    throw createError({ statusCode: 400, statusMessage: 'username and email are required' })
  }

  try {
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    const result = await new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)')
      stmt.run([username, email, password], function (err) {
        db.close()
        if (err) return reject(err)
        resolve({ id: this.lastID, username, email })
      })
    })

    return result
  } catch (err: any) {
    // handle unique constraint errors from sqlite
    const msg = String(err?.message || err)
    if (msg.includes('UNIQUE') || msg.includes('constraint')) {
      throw createError({ statusCode: 409, statusMessage: msg })
    }
    throw createError({ statusCode: 500, statusMessage: msg })
  }
})
