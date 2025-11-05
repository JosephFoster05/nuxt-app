import { createError, getCookie } from 'h3'


const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export default defineEventHandler(async (event) => {
  try {
    // get auth cookie
    const token = getCookie(event, 'auth')
    // no token = no user
    if (!token) return { user: null }


    const jwtmod = await import('jsonwebtoken')
    const jwt = jwtmod.default ?? jwtmod
    let payload: any

    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      // invalid token
      return { user: null }
    }

    // get user ID from payload
    const uid = payload?.uid
    if (!uid) return { user: null }

    // fetch user from database
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    // query user by ID
    const row: any = await new Promise((resolve, reject) => {
      db.get('SELECT User_ID, First_Name, Last_Name, Email, Phone FROM User WHERE User_ID = ?', [uid], (err, row) => {
        db.close()
        if (err) return reject(err)
        resolve(row)
      })
    })

    if (!row) return { user: null }
    return { user: row }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: String(err?.message || err) })
  }
})
