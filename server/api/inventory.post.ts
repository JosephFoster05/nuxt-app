import { readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // accept the DB's misspelled field `availablilty` in the request body
  const { item_id, location, availablilty = 'available' } = body || {}

  if (!item_id || !location) {
    throw createError({ statusCode: 400, statusMessage: 'item_id and location are required' })
  }

  try {
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    // The database schema uses the misspelled column name `availablilty`.
    const result: any = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO Inventory (Item_ID, availablilty, Location) VALUES (?, ?, ?)',
        [item_id, availablilty, location],
        function (err) {
          try { db.close() } catch (_) {}
          if (err) return reject(err)
          resolve({ inventory_id: this.lastID, item_id, availablilty, location })
        }
      )
    })

    return result
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: String(err?.message || err) })
  }
})
