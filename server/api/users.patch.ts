import { readBody, createError } from 'h3'

const VALID_ROLES = ['Donor', 'Admin', 'Staff']

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { User_ID, First_Name, Last_Name, Email, Phone, Role, NewPassword } = body || {}

  if (!User_ID) {
    throw createError({ statusCode: 400, statusMessage: 'User_ID is required' })
  }

  try {
    const path = await import('path')
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

  const updates: string[] = []
  const params: any[] = []

    if (First_Name !== undefined) { updates.push('First_Name = ?'); params.push(First_Name) }
    if (Last_Name !== undefined) { updates.push('Last_Name = ?'); params.push(Last_Name) }
    if (Email !== undefined) { updates.push('Email = ?'); params.push(Email) }
    if (Phone !== undefined) { updates.push('Phone = ?'); params.push(Phone) }
    if (Role !== undefined) {
      if (!VALID_ROLES.includes(Role)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid role' })
      }
      updates.push('Role = ?')
      params.push(Role)
    }

  if (NewPassword !== undefined && NewPassword !== null && String(NewPassword).length > 0) {
      const bcryptmod = await import('bcryptjs')
      const bcrypt = bcryptmod.default ?? bcryptmod
      const hashed = await bcrypt.hash(String(NewPassword), 10)
      updates.push('Password = ?')
      params.push(hashed)
    }

    if (updates.length === 0) {
      try { db.close() } catch (_) {}
      return { success: true }
    }

    params.push(User_ID)
    const sql = `UPDATE User SET ${updates.join(', ')} WHERE User_ID = ?`

    const result = await new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        try { db.close() } catch (_) {}
        if (err) return reject(err)
        resolve({ changes: this.changes })
      })
    })

    const changes = (result as any).changes || 0
    if (changes === 0) {
      throw createError({ statusCode: 404, statusMessage: 'User not found or no changes applied' })
    }

    return { success: true, User_ID }
  } catch (err: any) {
    const msg = String(err?.message || err)
    if (msg.includes('UNIQUE') || msg.includes('constraint')) {
      throw createError({ statusCode: 409, statusMessage: msg })
    }
    throw createError({ statusCode: err?.statusCode || 500, statusMessage: msg })
  }
})
