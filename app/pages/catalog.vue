<script setup>
// took this section from other page just because i needed same info

import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useDonations } from "../../composables/useDonations";


const {
  donations,
  fetchDonations,
  loading: donationsLoading,
  error: donationsError,
} = useDonations();


// for debugging purposes
console.log("Donations in Our Impact page:", donations);

const router = useRouter();

onMounted(() => {
  fetchDonations();
});

</script>

<template>
    <h1>catalog</h1>
    
    <!-- maybe go for a card like display of the clothes kinda like the most sites do now like jd and stuff-->

    <section id="catalog-cards-section">
        <div v-if="donationsLoading">Loading donations…</div>
        <div v-else-if="donationsError">Error: {{ donationsError }}</div>
        <div v-else-if="donations && donations.length === 0">
            No donations available.
        </div>

        <!-- display all donations as cards (could add filtering in future)-->
        <div v-else class="catalog-grid">
            <div v-for="item in donations" :key="item.donation_id" class="catalog-card">
                <h3>{{ item.clothing_name }}</h3>
                <p>Status: {{ item.donation_status }}</p>
                <p>Size: {{ item.donation_size ?? "-" }}</p>
                <p>Quality: {{ item.donation_quality ?? "-" }}</p>
                <p>Gender: {{ item.donation_gender ?? "-" }}</p>
            </div>
        </div>
    </section>

</template>
