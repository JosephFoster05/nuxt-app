
<script setup>

import { onMounted, computed, ref } from "vue";
import useAuth from "../../../composables/useAuth";
import { useDonations } from "../../../composables/useDonations";

const { user, fetchUserData, logout, error: authError } = useAuth();
const {
  donations,
  fetchDonations,
  loading: donationsLoading,
  error: donationsError,
  updateDonationStatus
} = useDonations();

const processing = ref({})

const setProcessing = (id, v) => { processing.value = { ...processing.value, [id]: v } }

onMounted(() => {
  try {
    if (!user.value || !user.value.is_admin) {
      router.push("/login");
      return;
    }
  } catch (_) {}
  fetchUserData();
  fetchDonations();
});

const filteredDonations = computed(() => {
  if (!donations?.value) return [];
  return donations.value.filter((d) => d.donation_status === 'pending');
})

const filteredDonationsDenied = computed(() => {
  if (!donations?.value) return [];
  return donations.value.filter((d) => d.donation_status === 'declined');
})

const filteredDonationsAccepted = computed(() => {
  if (!donations?.value) return [];
  return donations.value.filter((d) => d.donation_status === 'approved');
})


// Approve or deny donation handlers
const approve = async (d) => {
  try {
    setProcessing(d.donation_id, true)
    const updated = await updateDonationStatus(d.donation_id, 'approved')
    d.donation_status = updated.donation_status
  } catch (err) {
    console.error('Failed to approve', err)
  } finally {
    setProcessing(d.donation_id, false)
  }
}

const deny = async (d) => {
  try {
    setProcessing(d.donation_id, true)
  const updated = await updateDonationStatus(d.donation_id, 'declined')
    d.donation_status = updated.donation_status
  } catch (err) {
    console.error('Failed to deny', err)
  } finally {
    setProcessing(d.donation_id, false)
  }
}

</script>


<template>
  <div>
    <h2>Manage Donations</h2>
    <p>This is where admins can manage donations.</p>
  </div>

<section>
      <h3>Donations pending</h3>
      <div v-if="donationsLoading">Loading donations…</div>
      <div v-else-if="donationsError">Error: {{ donationsError }}</div>
      <div v-else-if="filteredDonations && filteredDonations.length === 0">
        No donations.
      </div>


      <!--donations table-->
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
            <th>Actions</th>
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
            <td>
              <button @click="approve(d)" :disabled="processing[d.donation_id]">Approve</button>
              <button @click="deny(d)" :disabled="processing[d.donation_id]" style="margin-left:8px">Deny</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>



    <section>
      <h3>Past denied donations</h3>
      <div v-if="donationsLoading">Loading donations…</div>
      <div v-else-if="donationsError">Error: {{ donationsError }}</div>
      <div v-else-if="filteredDonationsDenied && filteredDonationsDenied.length === 0">
        No denied donations.
      </div>


      <!--donations denied table-->
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in filteredDonationsDenied" :key="d.donation_id">
            <td>{{ d.donation_id }}</td>
            <td>{{ d.user_id }}</td>
            <td>{{ d.clothing_name }}</td>
            <td>{{ d.donation_status }}</td>
            <td>{{ d.donation_size ?? "-" }}</td>
            <td>{{ d.donation_quality ?? "-" }}</td>
            <td>{{ d.donation_gender ?? "-" }}</td>
            <td>
              <button @click="approve(d)" :disabled="processing[d.donation_id]">Approve</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>



    <section>
      <h3>Past accepted donations</h3>
      <div v-if="donationsLoading">Loading donations…</div>
      <div v-else-if="donationsError">Error: {{ donationsError }}</div>
      <div v-else-if="filteredDonationsAccepted && filteredDonationsAccepted.length === 0">
        No accepted donations.
      </div>


      <!--donations accepted table-->
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in filteredDonationsAccepted" :key="d.donation_id">
            <td>{{ d.donation_id }}</td>
            <td>{{ d.user_id }}</td>
            <td>{{ d.clothing_name }}</td>
            <td>{{ d.donation_status }}</td>
            <td>{{ d.donation_size ?? "-" }}</td>
            <td>{{ d.donation_quality ?? "-" }}</td>
            <td>{{ d.donation_gender ?? "-" }}</td>
            <td>
              <button @click="deny(d)" :disabled="processing[d.donation_id]">Deny</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
</template>