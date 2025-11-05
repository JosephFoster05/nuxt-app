<script setup>
import { ref } from 'vue'

const First_Name = ref('')
const Last_Name = ref('')
const Email = ref('')
const Password = ref('')
const Phone = ref('')
const message = ref('')
const role = ref('user')  // Default role set to 'user'


const addUser = async () => {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                First_Name: First_Name.value,
                Last_Name: Last_Name.value,
                Email: Email.value,
                Password: Password.value,
                Phone: Phone.value,
                Role: role.value
            })
        })

        if (!response.ok) {
            throw new Error('Failed to add user')
        }

        const data = await response.json()
        message.value = `User added: ${data.First_Name} ${data.Last_Name} (${data.Role})`
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
                <label for="First_Name">First Name:</label>
                <input type="text" id="First_Name" v-model="First_Name" required />
            </div>
            <div>
                <label for="Last_Name">Last Name:</label>
                <input type="text" id="Last_Name" v-model="Last_Name" required />
            </div>
            <div>
                <label for="Email">Email:</label>
                <input type="email" id="Email" v-model="Email" required />
            </div>
            <div>
                <label for="Password">Password:</label>
                <input type="password" id="Password" v-model="Password" required />
            </div>
            <div>
                <label for="Phone">Phone:</label>
                <input type="tel" id="Phone" v-model="Phone" required />
            </div>
            <button type="submit">Add User</button>
        </form>
        <div v-if="message">{{ message }}</div>
    </div>
</template>

