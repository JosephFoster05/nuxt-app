<script setup lang="ts">
import { onMounted, computed, ref, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDonations } from "../../composables/useDonations";

const {
  donations,
  fetchDonations,
  loading: donationsLoading,
  error: donationsError,
} = useDonations();

const router = useRouter();
const route = useRoute();

// highlight handling: read query `highlight` (donation_id) to visually mark and scroll
const highlightedId = ref<number | null>(null);
function applyHighlight(id: number | null) {
  highlightedId.value = id;
  if (id !== null) {
    nextTick(() => {
      const el = document.getElementById(`donation-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    // remove highlight after a short timeout
    setTimeout(() => { highlightedId.value = null }, 6000);
  }
}

watch(() => route.query.highlight, (v) => {
  const num = v ? Number(v) : null;
  if (!num || Number.isNaN(num)) return;
  applyHighlight(num);
});

// only show approved donations in catalog
const filteredDonationsApproved = computed(() => {
  if (!donations?.value) return [];
  return donations.value.filter((d) => d.donation_status === "approved");
});

// distribution centers map: label -> address (address will be sent to inventory)
const distribution_centers = {
  North: "123 North St",
  South: "456 South St",
  East: "789 East St",
  West: "101 West St",
};

// track selected center (address string) per donation id
const selectedCenters = ref({} as Record<string | number, string | null>);
// track which donation items have been added to inventory
const addedInventory = ref(new Set<number>());
const itemMessages = ref({} as Record<string | number, string>);

onMounted(() => {
  fetchDonations();
});

async function addToInventory(item: any) {
  const id = item?.donation_id;
  const selected = selectedCenters.value[id];
  if (!id || !selected) {
    itemMessages.value[id] = "Please choose a distribution center.";
    return;
  }

  try {
    itemMessages.value[id] = "Adding to inventory...";
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: id, location: selected, availablilty: "available" }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    const data = await res.json();
    addedInventory.value.add(Number(id));
    itemMessages.value[id] = "Added to inventory.";
  } catch (err: any) {
    itemMessages.value[id] = "Failed to add: " + (err?.message || String(err));
  }
}
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
      <div
        v-for="item in filteredDonationsApproved"
        :key="item.donation_id"
        :id="`donation-${item.donation_id}`"
        :class="['catalog-card', { highlighted: highlightedId === item.donation_id }]"
      >
        <div v-if="item.image_url" class="catalog-image-wrap">
          <img
            :src="item.image_url"
            :alt="item.clothing_name || 'donation image'"
            class="catalog-image"
          />
        </div>
        <h3>{{ item.clothing_name }}</h3>
        <p>Status: {{ item.donation_status }}</p>
        <p>Size: {{ item.donation_size ?? "-" }}</p>
        <p>Quality: {{ item.donation_quality ?? "-" }}</p>
        <p>Gender: {{ item.donation_gender ?? "-" }}</p>
        <div class="inventory-actions">
          <label for="center-select-{{ item.donation_id }}">Choose distribution center:</label>
          <select :id="`center-select-${item.donation_id}`" v-model="selectedCenters[item.donation_id]">
            <option value="" disabled selected>Select center</option>
            <option v-for="(addr, name) in distribution_centers" :key="name" :value="addr">{{ name }}</option>
          </select>
          <button
            :disabled="!selectedCenters[item.donation_id] || addedInventory.has(Number(item.donation_id))"
            @click.prevent="addToInventory(item)"
          >
            {{ addedInventory.has(Number(item.donation_id)) ? 'Added' : 'Add to Inventory' }}
          </button>
          <div class="item-message" v-if="itemMessages[item.donation_id]">{{ itemMessages[item.donation_id] }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.catalog-card {
  border: 1px solid #e1e1e1;
  padding: 0.75rem;
  border-radius: 6px;
  background: #fff;
}
.catalog-image-wrap {
  width: 100%;
  height: 160px;
  overflow: hidden;
  display: block;
  margin-bottom: 0.5rem;
}
.catalog-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.inventory-actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.inventory-actions select {
  padding: 0.25rem;
}
.inventory-actions button {
  padding: 0.35rem 0.6rem;
}
.item-message {
  width: 100%;
  font-size: 0.85rem;
  color: #444;
}
.highlighted {
  box-shadow: 0 0 0 3px rgba(255, 210, 80, 0.35), 0 4px 10px rgba(0,0,0,0.08);
  transform: translateY(-2px);
  transition: box-shadow 220ms ease, transform 120ms ease;
}
</style>
