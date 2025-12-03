<script>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useAuth from "../../../composables/useAuth";
import { useDonations } from "../../../composables/useDonations";
import { on } from "events";

const { user, fetchUserData, logout, error: authError } = useAuth();


onMounted(() => {
  try {
    if (!user.value || !user.value.is_staff) {
      router.push("/login");
      return;
    }
  } catch (_) {}
  fetchUserData();
});



</script>
<template>
  <div>
    <h2>Staff Dashboard</h2>
    <p>Welcome to the staff dashboard. Here you can manage staff-related tasks.</p>
    <ul>
      <li><NuxtLink to="/staff/manage-donations">Manage Donations</NuxtLink></li>
    </ul>
  </div>
</template>
