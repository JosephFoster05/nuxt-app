<script setup>
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const message = ref('')

const addUser = async () => {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value
            })
        })

        if (!response.ok) {
            throw new Error('Failed to add user')
        }

        const data = await response.json()
        message.value = `User added: ${data.username}`
    } catch (error) {
        message.value = `Error: ${error.message}`
    }
}
</script>




<template>



    <div>
        <h2>Add New User</h2>
        <form @submit.prevent="addUser">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Add User</button>
        </form>
        <div v-if="message">{{ message }}</div>
    </div>
</template>

