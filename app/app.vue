


<script setup>

if (process.server) {
    try {

        const path = await import('path')
        const sqlite3mod = await import('sqlite3')
        let sqlite3 = sqlite3mod.default ?? sqlite3mod


        if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

        const dbPath = path.join(process.cwd(), 'database', 'database.db')
        const DB = sqlite3.Database
        const db = new DB(dbPath)

        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                email TEXT UNIQUE
            )`)

            db.run(`CREATE TABLE IF NOT EXISTS data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                info TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )`)
        })

        db.close()
        console.log('[app.vue] ensured database tables exist at', dbPath)
    } catch (err) {
        console.error('[app.vue] server-side DB setup failed:', err && err.message ? err.message : err)
    }
}
</script>

<template>
    <div>
        <header>
            <nav>
                <NuxtLink to="/">Home</NuxtLink>
                <span>|</span>
                <NuxtLink to="/dash">Dashboard</NuxtLink>
                <span>|</span>
                <NuxtLink to="/add-user">Add User</NuxtLink>
            </nav>
        </header>

        <NuxtPage />

    </div>
</template>


