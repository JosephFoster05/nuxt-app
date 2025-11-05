<script setup>

// check if user is logged in, if not redirect to register page

//examaple usage of useAuth?
import { useAuth } from '@/composables/useAuth'
const { isAuthenticated } = useAuth()
if (!isAuthenticated.value) {
    navigateTo('/register')
}


</script>

<template>
    <div>
        <h2>Donate Page</h2>
        <p>This is the donate page. More features coming soon!</p>
    </div>
</template>
