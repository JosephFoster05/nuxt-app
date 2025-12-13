<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuth from '../../composables/useAuth'
import { useHead } from '#app'

useHead({
    title: 'Login - SustainWear',
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { charset: 'utf-8' }
    ]
})

const Email = ref('')
const Password = ref('')
const message = ref('')
const router = useRouter()
const { fetchUserData } = useAuth()

const loginUser = async () => {

    message.value = ''

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: Email.value, Password: Password.value })
        })

        if (!res.ok) {
            const text = await res.text()
            message.value = `Login failed ultimately: ${res.status} ${text}`
            return
        }

    const data = await res.json()
    try { await fetchUserData() } catch (_) {}
    message.value = 'Login successful'
    console.log('Login data:', data)
    if (data.Role === 'Admin')
        router.push('/admin/admin-dashboard')
    else if (data.Role === 'Staff')
        router.push('/staff/staff-dashboard')
    else
        router.push('/dashboard')

        } catch (err) {
            message.value = `Error: ${err?.message || err}` // shouldnt do this in production its bad to leak errors
    }
}
</script>

<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="loginUser">
            <div>
                <label for="Email">Email:</label>
                <input id="Email" type="email" v-model="Email" required />
            </div>
            <div>
                <label for="Password">Password:</label>
                <input id="Password" type="password" v-model="Password" required />
            </div>
            <button type="submit">Login</button>
        </form>
        <div v-if="message">{{ message }}</div>
    </div>
</template>
