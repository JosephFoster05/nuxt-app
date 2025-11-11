import { readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { Email } = body || {}

  if (!Email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required' })
  }

  try {
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    // find user
    const row: any = await new Promise((resolve, reject) => {
      db.get('SELECT User_ID, Email FROM User WHERE Email = ?', [Email], (err, row) => {
        if (err) return reject(err)
        resolve(row)
      })
    })

    if (!row) {
      try { db.close() } catch (_) {}
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    const userId = row.User_ID

    // attempt delete
    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM User WHERE User_ID = ?', [userId], function (err) {
        try { db.close() } catch (_) {}
        if (err) return reject(err)
        resolve({ changes: this.changes })
      })
    })

    const changes = (result as any).changes || 0
    if (changes === 0) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete user' })
    }

    return { success: true, Email }
  } catch (err: any) {
    const msg = String(err?.message || err)
    // if foreign key constraint prevents delete, return a helpful message
    if (msg.includes('FOREIGN KEY') || msg.includes('constraint')) {
      throw createError({ statusCode: 409, statusMessage: 'Cannot delete user: referenced by other records' })
    }
    throw createError({ statusCode: err?.statusCode || 500, statusMessage: msg })
  }
})
