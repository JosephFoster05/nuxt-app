import { readBody, createError } from 'h3'


export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) || {}
  let { donation_id, donation_status } = body

  // coerce donation_id
  if (typeof donation_id === 'string') donation_id = parseInt(donation_id, 10)
  if (!Number.isInteger(donation_id) || donation_id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'donation_id must be a positive integer' })
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
        'UPDATE donations SET donation_status = ? WHERE donation_id = ?',
        [donation_status, donation_id],
        function (this: any, err: any) {
          if (err) {
            try { db.close() } catch (_) {}
            const msg = String(err?.message || err)
            if (msg.includes('SQLITE_CONSTRAINT')) return reject(createError({ statusCode: 400, statusMessage: msg }))
            return reject(err)
          }

          if (this.changes === 0) {
            try { db.close() } catch (_) {}
            return reject(createError({ statusCode: 404, statusMessage: 'Donation not found' }))
          }

          // select updated row
          db.get(
            'SELECT donation_id, user_id, clothing_name, donation_status, donation_size, donation_quality, donation_gender FROM donations WHERE donation_id = ?',
            [donation_id],
            (err2: any, row: any) => {
              try { db.close() } catch (_) {}
              if (err2) return reject(err2)
              resolve(row)
            }
          )
        }
      )
    })

    return result
  } catch (err: any) {
    const msg = String(err?.message || err)
    if (msg.includes('SQLITE_CONSTRAINT')) {
      throw createError({ statusCode: 400, statusMessage: msg })
    }
    if (err && err.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: msg })
  }
})
