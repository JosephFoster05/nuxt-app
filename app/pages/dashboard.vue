<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useAuth from "../../composables/useAuth";
import { useDonations } from "../../composables/useDonations";

const { user, fetchUserData, logout, error: authError } = useAuth();
const {
  donations,
  fetchDonations,
  loading: donationsLoading,
  error: donationsError,
} = useDonations();

const filteredDonations = computed(() => {
  const u = user?.value;
  if (!u || !donations?.value) return [];
  return donations.value.filter((d) => Number(d.user_id) === Number(u.User_ID));
});
const router = useRouter();

onMounted(() => {
  fetchUserData();
  fetchDonations();
});

const doLogout = async () => {
  await logout();
  router.push("/login");
};
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
    </div>

    <div v-else>
      <p>You are not logged in.</p>
      <NuxtLink to="/login">Go to Login</NuxtLink>
      <div v-if="authError">{{ authError }}</div>
    </div>

    <hr />

    <section>
      <h3>Donations</h3>

      <div v-if="donationsLoading">Loading donations…</div>
      <div v-else-if="donationsError">Error: {{ donationsError }}</div>
      <div v-else-if="filteredDonations && filteredDonations.length === 0">
        No donations.
      </div>

      <table v-else class="donations-table" border="1" cellpadding="6">
        <thead>
          <tr>
            <th>Donation ID</th>
            <th>User ID</th>
            <th>Clothing Name</th>
            <th>Status</th>
            <th>Size</th>
            <th>Quality</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in filteredDonations" :key="d.donation_id">
            <td>{{ d.donation_id }}</td>
            <td>{{ d.user_id }}</td>
            <td>{{ d.clothing_name }}</td>
            <td>{{ d.donation_status }}</td>
            <td>{{ d.donation_size ?? "-" }}</td>
            <td>{{ d.donation_quality ?? "-" }}</td>
            <td>{{ d.donation_gender ?? "-" }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
