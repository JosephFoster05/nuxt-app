import { readBody, createError, setCookie } from 'h3'


const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7



export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { Email, Password } = body || {}

  if (!Email || !Password) {
    throw createError({ statusCode: 400, statusMessage: 'email and password are required' })
  }

  try {
    // fetch user from database
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    // query user
    const row: any = await new Promise((resolve, reject) => {
      db.get('SELECT User_ID, First_Name, Last_Name, Email, Password, Phone FROM User WHERE Email = ?', [Email], (err, row) => {
        db.close()
        if (err) return reject(err)
        resolve(row)
      })
    })

    if (!row) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
    }

    // compare passwords
    const bcryptmod = await import('bcryptjs')
    const bcrypt = bcryptmod.default ?? bcryptmod
    const match = await bcrypt.compare(Password, row.Password)

    if (!match) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
    }

    // remove sensitive fields before returning
    const safeUser = { ...row }
    delete safeUser.Password

    // create JWT and set HTTP-only cookie
    const jwtmod = await import('jsonwebtoken')
    const jwt = jwtmod.default ?? jwtmod
    const token = jwt.sign({ uid: row.User_ID }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN_SECONDS })

    setCookie(event, 'auth', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: JWT_EXPIRES_IN_SECONDS,
      secure: process.env.NODE_ENV === 'production'
    })

    return { success: true, user: safeUser, Role: row.Role || 'User' }
  } catch (err: any) {
    throw createError({ statusCode: err?.statusCode || 500, statusMessage: String(err?.statusMessage || err?.message || err) })
  }
})
