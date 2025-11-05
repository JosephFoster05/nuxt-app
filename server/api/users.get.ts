import { createError } from 'h3'

export default defineEventHandler(async () => {
  try {
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT User_ID, First_Name, Last_Name, Email, Phone FROM User ORDER BY User_ID DESC', (err, rows) => {
        db.close()
        if (err) return reject(err)
        resolve(rows)
      })
    })

    return rows
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: String(err?.message || err) })
  }
})
