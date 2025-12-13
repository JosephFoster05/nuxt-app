<script>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useAuth from "../../../composables/useAuth";
import { useDonations } from "../../../composables/useDonations";
import { on } from "events";

const { user, fetchUserData, logout, error: authError } = useAuth();
const {
  donations,
  fetchDonations,
  loading: donationsLoading,
  error: donationsError,
  updateDonationStatus,
} = useDonations();




onMounted(() => {
  try {
    if (!user.value || !user.value.is_staff) {
      router.push("/login");
      return;
    }
  } catch (_) {}
  fetchUserData();
  fetchDonations();
});



definePageMeta({
  middleware: 'staff'
})


</script>
<template>
  <div>
    <h2>Staff Dashboard</h2>
    <p>Welcome to the staff dashboard. Here you can manage staff-related tasks.</p>
    <ul>
      <li><NuxtLink to="/staff/manage-donations">Manage Donations</NuxtLink></li>
    </ul>
    <hr />
    <h3>Donation Statistics</h3>
    <p>Total Donations Received: {{ donations?.length || 0 }}</p>
    <p>
      <NuxtLink to="/dashboard">Back to User Dashboard</NuxtLink>
      <NuxtLink to="/staff/analytics">Go to Staff Analytics</NuxtLink>
    </p>
  </div>
</template>
