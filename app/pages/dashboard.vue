<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
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
  router.push("/");
};

// request deletion of user data stuff, reused code from users.vue
const showRequestDelete = ref(false);
const requestPassword = ref("");
const requestDeleting = ref(false);
const requestDeleteError = ref("");

function openRequestDelete() {
  requestPassword.value = "";
  requestDeleteError.value = "";
  showRequestDelete.value = true;
}

function closeRequestDelete() {
  showRequestDelete.value = false;
  requestPassword.value = "";
  requestDeleteError.value = "";
}

async function submitRequestDelete() {
  requestDeleteError.value = "";
  if (!user?.value?.Email) {
    requestDeleteError.value = 'User email not available';
    return;
  }
  if (!requestPassword.value) {
    requestDeleteError.value = 'Please enter your password.';
    return;
  }

  requestDeleting.value = true;
  try {
    const loginRes = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: user.value.Email, Password: requestPassword.value })
    });
    if (!loginRes.ok) {
      const txt = await loginRes.text();
      throw new Error(txt || loginRes.statusText || 'Invalid password');
    }

    const delRes = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: user.value.Email })
    });
    if (!delRes.ok) {
      const txt = await delRes.text();
      throw new Error(txt || delRes.statusText || 'Failed to delete');
    }

    await logout();
    closeRequestDelete();
    router.push('/');
  } catch (err: any) {
    requestDeleteError.value = String(err?.message || err);
  } finally {
    requestDeleting.value = false;
  }
}

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

    <section id="stats">
      <h3>Personal Statistics</h3>
      <!-- Assuming an average CO2e savings of 6kg per donated clothing item and only accepted ones and for this user only -->
      <ul>
        <li>
          Total Clothing items donated:
          {{ filteredDonations ? filteredDonations.length : 0 }}+
        </li>
        <li>
          Estimated CO2e savings:
          {{
            (filteredDonations
              ? filteredDonations.filter(
                  (d) => d.donation_status === "approved"
                ).length
              : 0) * 6
          }}kg
        </li>
        <p style="color: red">
          co2e savings will only show approved donations!
        </p>
      </ul>
    </section>

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

  <div>
    <h2>Account Actions</h2>
    <button @click="doLogout">Logout</button>
    <button @click="router.push('/donate')">Make a Donation</button>
    <button @click="router.push('/catalog')">View Catalog</button>
    <button @click="router.push('/inventory')">View Inventory</button>
    <button class="delete-data" @click="openRequestDelete">
      Request deletion of data
    </button>
  </div>

  <!-- Request deletion modal -->
  <div v-if="showRequestDelete" class="modal-overlay">
    <div class="modal">
      <h3>Request data deletion</h3>
      <p>
        This will permanently delete your account and associated data. Enter
        your password to confirm.
      </p>
      <label>
        Password
        <input
          type="password"
          v-model="requestPassword"
          :disabled="requestDeleting"
        />
      </label>
      <div class="modal-actions">
        <button @click="closeRequestDelete" :disabled="requestDeleting">
          Cancel
        </button>
        <button @click="submitRequestDelete" :disabled="requestDeleting">
          {{ requestDeleting ? "Deleting..." : "Delete my data" }}
        </button>
      </div>
      <div v-if="requestDeleteError" class="error">
        Failed to delete data, is the password correct?
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 14px;
  border-radius: 8px;
  width: 92%;
  max-width: 420px;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.modal input,
.modal select,
.modal textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  margin-top: 6px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
}
.error {
  color: #b00020;
  margin-top: 8px;
}
</style>
