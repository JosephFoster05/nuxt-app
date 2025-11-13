<script>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useAuth from "../../../composables/useAuth";
import { useDonations } from "../../../composables/useDonations";
import { on } from "events";

const { user, fetchUserData, logout, error: authError } = useAuth();


onMounted(() => {
  fetchUserData();
});


</script>

<template>
  <div>
    <h2>Admin Dashboard</h2>
    <p>Welcome to the admin dashboard. Here you can manage the application.</p>
    <ul>
      <li><NuxtLink to="/users">Manage Users</NuxtLink></li>
      <li><NuxtLink to="/admin/manage-donations">Manage Donations</NuxtLink></li>
    </ul>
  </div>
</template>