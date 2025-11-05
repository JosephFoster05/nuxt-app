<script setup>

// check if user is logged in, if not redirect to register page
import { useAuth } from '../../composables/useAuth'
import { useRouter } from 'vue-router'
const { user, fetchUserData, logout, error } = useAuth()
const router = useRouter()

// redirect if not logged in 

if (!user) {
    router.push('/register')
}




// on this page logged in users can donate clothing to the organization
// for now this is just a placeholder page
// future implementation will include a form to schedule a pickup or drop-off? donations etc.


</script>

<template>
    <div>
        <h2>Donate Page</h2>
        <p>This is the donate page. More features coming soon!</p>
    </div>


    
</template>
