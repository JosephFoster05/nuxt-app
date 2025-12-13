import { createError } from 'h3'
import sqlite3 from 'sqlite3'
import path from 'path'

export default defineEventHandler(async () => {
  try {
    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const db = new sqlite3.Database(dbPath)

    const result = await new Promise<{ admin: number; staff: number; user: number }>((resolve, reject) => {
      db.all(
        `
        SELECT 
          COALESCE(Role, 'user') AS role,
          COUNT(*) AS count
        FROM User
        GROUP BY COALESCE(Role, 'user')
        `,
        (err, rows: any[]) => {
          db.close()
          if (err) return reject(err)

          const counts = { admin: 0, staff: 0, user: 0 }

          for (const row of rows) {
            const role = String(row.role).toLowerCase()
            if (role in counts) {
              counts[role as keyof typeof counts] = row.count
            }
          }

          resolve(counts)
        }
      )
    })

    return result
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: String(err?.message || err)
    })
  }
})
