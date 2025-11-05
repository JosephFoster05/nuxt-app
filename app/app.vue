<script setup>
import { useHead } from '#app'

useHead({
    title: 'SustainWear',
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { charset: 'utf-8' }
    ],
    link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' },
        { rel: 'stylesheet', href: '/css/style.css' }
    ],
    script: [
        { src: '/js/script.js', body: true }
    ]
})

if (process.server) {
    (async () => {
        try {
            const path = await import('path')
            const sqlite3mod = await import('sqlite3')
            let sqlite3 = sqlite3mod.default ?? sqlite3mod

            if (typeof sqlite3.verbose === 'function') sqlite3 = sqlite3.verbose()

            const dbPath = path.join(process.cwd(), 'database', 'database.db')
            const DB = sqlite3.Database
            const db = new DB(dbPath)

            db.close()
            console.log('[app.vue] ensured database tables exist at', dbPath)
        } catch (err) {
            console.error('[app.vue] server-side DB setup failed:', err && err.message ? err.message : err)
        }
    })()
}


</script>

<template>
    <div>
        <header>
            <h2><NuxtLink to="/">S.W</NuxtLink></h2>
            <div id="hamburgerIcon">
                <a href="javascript:void(0);" class="icon" onclick="generateHamburgerLinks()">
                    <i class="fa fa-bars"></i>
                </a>
            </div>
        </header>
        <hr class="divider" />

        <div id="hamburgerLinksVisor">
            <div id="hamburgerLinks">
                <NuxtLink to="/about-us">About</NuxtLink>
                <NuxtLink to="/our-impact">Impact</NuxtLink>
                <NuxtLink to="/register">Register</NuxtLink>
                <NuxtLink to="/users">Users</NuxtLink>
            </div>
        </div>

        <main>
            <NuxtPage />
        </main>
    </div>
</template>


