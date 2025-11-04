<script setup>

const { data: users, pending, error, refresh } = await useFetch('/api/users')


</script>

<template>
  <div>
    <h2>Users</h2>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message || error }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.username }} ({{ user.email }})
      </li>
    </ul>
  </div>


</template>
