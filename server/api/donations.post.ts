import { readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    user_id,
    clothing_name,
    donation_status = 'pending',
    donation_size = null,
    donation_quality = null,
    donation_gender = null,
    image_base64 = null,
    image_name = null
  } = body || {}

  if (!user_id || !clothing_name) {
    throw createError({ statusCode: 400, statusMessage: 'user_id and clothing_name are required' })
  }

  try {
    const path = await import('path')
    const fs = await import('fs')
    const fsp = fs.promises
    const sqlite3mod = await import('sqlite3')
    let sqlite3 = sqlite3mod.default ?? sqlite3mod
    if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

    const dbPath = path.join(process.cwd(), 'database', 'database.db')
    const DB = sqlite3.Database
    const db = new DB(dbPath)

    // handle optional image base64 -> write to public/images and set image_url
    let image_url: string | null = null
    if (image_base64 && typeof image_base64 === 'string') {
      // image_base64 may be a data URL like 'data:image/png;base64,AAA...'
      const matches = image_base64.match(/^data:(image\/(png|jpeg|jpg|gif));base64,(.+)$/)
      let b64data = image_base64
      let ext = 'png'
      if (matches) {
        ext = matches[1].split('/')[1]
        b64data = matches[3]
      } else if (image_name) {
        const m = String(image_name).match(/\.([a-zA-Z0-9]+)$/)
        if (m) ext = m[1]
      }

      const buffer = Buffer.from(b64data, 'base64')
      const imagesDir = path.join(process.cwd(), 'public', 'images')
      try { await fsp.mkdir(imagesDir, { recursive: true }) } catch (e) {}
      const fileName = `donation-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`
      const filePath = path.join(imagesDir, fileName)
      await fsp.writeFile(filePath, buffer)
      image_url = `/images/${fileName}`
    }

    const result: any = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO donations (user_id, clothing_name, donation_status, donation_size, donation_quality, donation_gender, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, clothing_name, donation_status, donation_size, donation_quality, donation_gender, image_url],
        function (err) {
          try { db.close() } catch (_) {}
          if (err) return reject(err)
          resolve({ donation_id: this.lastID, user_id, clothing_name, donation_status, donation_size, donation_quality, donation_gender, image_url })
        }
      )
    })

    return result
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: String(err?.message || err) })
  }
})
