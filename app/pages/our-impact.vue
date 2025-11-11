<script setup>
// we can add content later for now this is just a placeholder page
// we can add stats, images, testimonials, etc. about the impact of the organization here

// in the stats section we can fetch some data from an api endpoint in the future if needed
// for now we will just hardcode some stats?



import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useDonations } from "../../composables/useDonations";


const {
  donations,
  fetchDonations,
  loading: donationsLoading,
  error: donationsError,
} = useDonations();

console.log("Donations in Our Impact page:", donations);


const router = useRouter();

const dummyStats = {
    peopleHelped: 5000,
    communitiesServed: 50
}

onMounted(() => {
  fetchDonations();
});


</script>


<template>
    <div>
        <h2>Our Impact</h2>
        <p>This is the Our Impact page. More content coming soon!</p>
    </div>

    <section id="stats">
        <h3>Statistics</h3>
        <ul>
            <li>Clothing items donated: {{ donations ? donations.length : 0 }}+</li>
            <li>People helped: {{ dummyStats.peopleHelped }}+</li>
            <li>Communities served: {{ dummyStats.communitiesServed }}+</li>
        </ul>
    </section>

    <section id="donations-over-time">
        <h3>Donations Over Time</h3>
        <div v-if="donationsLoading">Loading donations…</div>
        <div v-else-if="donationsError">Error: {{ donationsError }}</div>
        <div v-else>
            <p>Total Donations Recorded: {{ donations ? donations.length : 0 }}</p>
            <!-- Future implementation: Add charts/graphs to visualize donation trends -->
        </div>
    </section>

<section>
      <h3>Donations</h3>

      <div v-if="donationsLoading">Loading donations…</div>
      <div v-else-if="donationsError">Error: {{ donationsError }}</div>
      <div v-else-if="donations.length === 0">
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
          <tr v-for="d in donations" :key="d.donation_id">
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


</template>
