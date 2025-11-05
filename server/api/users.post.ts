import { readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { First_Name, Last_Name, Email, Password, Phone, Role } = body || {}

  if (!First_Name || !Last_Name || !Email || !Password || !Phone || !Role) {
    throw createError({ statusCode: 400, statusMessage: 'first name, last name, email, password, phone and role are required' })
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

      db.run(
        'INSERT INTO User (First_Name, Last_Name, Email, Password, Phone, Role) VALUES (?, ?, ?, ?, ?, ?)',
        [First_Name, Last_Name, Email, Password, Phone, Role],
        function (err) {
          try { db.close() } catch (_) {}
          if (err) return reject(err)
          resolve({ id: this.lastID, First_Name, Last_Name, Email, Phone, Role })
        }
      )
    })

    return result
  } catch (err: any) {
    const msg = String(err?.message || err)
    if (msg.includes('UNIQUE') || msg.includes('constraint')) {
      throw createError({ statusCode: 409, statusMessage: msg })
    }
    throw createError({ statusCode: 500, statusMessage: msg })
  }
})
