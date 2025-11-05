<script setup>

const { data: users, pending, error, refresh } = await useFetch('/api/users')
</script>

<template>
  <div>
    <h2>Users</h2>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message || error }}</div>
    <ul v-else>
      <li v-for="u in (users || [])" :key="u.User_ID">
        {{ u.First_Name }} {{ u.Last_Name }} ({{ u.Email }})
        <div v-if="u.Phone">Phone: {{ u.Phone }}</div>
      </li>
    </ul>
  </div>
</template>
