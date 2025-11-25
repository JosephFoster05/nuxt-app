<script setup lang="ts">

import useAuth from '../../composables/useAuth'
const { user, fetchUserData } = useAuth()
await fetchUserData()

// add edit logic here later


</script>


<template>
    <h1>Profile Page</h1>
    <p>This is the profile page.</p>
    <p>{{ user ? `Welcome, ${user.First_Name}` : 'Loading user data...' }}</p>
</template>