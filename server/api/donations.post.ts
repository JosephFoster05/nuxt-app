import { readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    user_id,
    clothing_name,
    donation_status = 'pending',
    donation_size = null,
    donation_quality = null,
    donation_gender = null
  } = body || {}

  if (!user_id || !clothing_name) {
    throw createError({ statusCode: 400, statusMessage: 'user_id and clothing_name are required' })
  }

  try {
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    const result: any = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO donations (user_id, clothing_name, donation_status, donation_size, donation_quality, donation_gender) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, clothing_name, donation_status, donation_size, donation_quality, donation_gender],
        function (err) {
          try { db.close() } catch (_) {}
          if (err) return reject(err)
          resolve({ donation_id: this.lastID, user_id, clothing_name, donation_status, donation_size, donation_quality, donation_gender })
        }
      )
    })

    return result
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: String(err?.message || err) })
  }
})
