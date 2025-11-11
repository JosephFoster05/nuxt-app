<script setup>
// Form to remove a user

// await server api call to delete user by email? 

// display success or error message

import { ref } from 'vue'
const Email = ref('')
const message = ref('')

const removeUser = async () => {
    try {
        const response = await fetch('/api/users', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Email: Email.value
            })
        })

        if (!response.ok) {
            const text = await response.text()
            throw new Error(text || 'Failed to remove user')
        }

        const data = await response.json()
        message.value = `User removed: ${data.Email}`
    } catch (error) {
        message.value = `Error: ${error.message}`
    }
}

</script>


<template>
    <form @submit.prevent="removeUser">
        <h2>Remove User</h2>
        <div>
            <label for="Email">Email:</label>
            <input type="email" id="Email" v-model="Email" required />
        </div>
        <button type="submit">Remove User</button>
        <div v-if="message">{{ message }}</div>
    </form>
</template>