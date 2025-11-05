<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useAuth from '../../composables/useAuth'
//useAuth composable to get user data and logout function
//can be innvoked on mounted to fetch user data when web pages loads

//fetch user data on component mount ie.. when dashboard page loads
onMounted(() => {
  fetchUserData()
})


const { user, fetchUserData, logout, error } = useAuth()

// user has the values of the current logged in user
// user.First_Name, user.Last_Name, user.Email, user.Phone
// if user is null, then no user is logged in this will be used to conditionally render content

const message = error
const router = useRouter()

// Logout function to log the user out and redirect to login page
const doLogout = async () => {
  await logout()
  router.push('/login')
}




</script>

<template>
    <div>
        <h2>Dashboard</h2>
        <div v-if="user">
            <p>Welcome, {{ user.First_Name }} {{ user.Last_Name }}!</p>
            <ul>
                <li><strong>Email:</strong> {{ user.Email }}</li>
                <li v-if="user.Phone"><strong>Phone:</strong> {{ user.Phone }}</li>
            </ul>
            <button @click="logout">Logout</button>
        </div>

        <div v-else>
            <p>You are not logged in.</p>
            <NuxtLink to="/login">Go to Login</NuxtLink>
            <div v-if="message">{{ message }}</div>
        </div>
    </div>
</template>
