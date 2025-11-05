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

import useAuth from '../composables/useAuth'

try {
    //fetch user data on app load to set initial auth state
    const { fetchUserData } = useAuth()
    await fetchUserData()
} catch (e) {
    //ignore errors here; user will be null if not logged in
}

// i believe that once the user auth is fetched and user is logged in they it doesnt have to be called on other pages again. 

const { user, fetchUserData, logout, error } = useAuth()


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
                <NuxtLink v-if="!user" to="/register">Register</NuxtLink>
                <NuxtLink to="/users">Users</NuxtLink>
                <NuxtLink v-if="!user" to="/login">Login</NuxtLink>
                <NuxtLink v-if="user" to="/donate">Donate</NuxtLink>
                <NuxtLink v-if="user" to="/dashboard">Dashboard</NuxtLink>
                <button v-if="user" @click="logout()">Logout</button>
            </div>
        </div>

        <main>
            <NuxtPage />
        </main>
    </div>
</template>


