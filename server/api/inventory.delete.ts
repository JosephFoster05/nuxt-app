import { readBody, createError, getCookie } from 'h3'


const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth')
    if (!token) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })

    const jwtmod = await import('jsonwebtoken')
    const jwt = jwtmod.default ?? jwtmod
    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }

    const uid = payload?.uid
    if (!uid) throw createError({ statusCode: 401, statusMessage: 'Invalid token payload' })

    // check user's role
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    const userRow: any = await new Promise((resolve, reject) => {
      db.get('SELECT Role FROM User WHERE User_ID = ?', [uid], (err, row) => {
        try { db.close() } catch (_) {}
        if (err) return reject(err)
        resolve(row)
      })
    })

    const role = (userRow?.Role ?? userRow?.role ?? '').toString().toLowerCase()
    if (role !== 'staff' && role !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Insufficient privileges' })
    }

    // read inventory id from body or query
    const body = await readBody(event)
    const q = getQuery(event) as any
    const inventory_id = body?.inventory_id ?? q?.inventory_id
    if (!inventory_id) throw createError({ statusCode: 400, statusMessage: 'inventory_id is required' })

    // perform delete
    const delResult: any = await new Promise((resolve, reject) => {
      const db2 = new DB(dbPath)
      db2.run('DELETE FROM Inventory WHERE Inventory_ID = ?', [inventory_id], function (err) {
        try { db2.close() } catch (_) {}
        if (err) return reject(err)
        resolve({ changes: this.changes ?? 0 })
      })
    })

    if (!delResult || delResult.changes === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Inventory item not found' })
    }

    return { success: true }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: String(err?.message || err) })
  }
})
