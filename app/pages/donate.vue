<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useAuth from "../../composables/useAuth";
import { useDonations } from "../../composables/useDonations";

// auth + donations composables
const { user, fetchUserData } = useAuth();
const {
  donations,
  fetchDonations,
  addDonation,
  loading: donationsLoading,
  error: donationsError,
} = useDonations();

// form state
const selectedClothing = ref("t-shirt");
const customClothing = ref("");
const quantity = ref<number | null>(null);
const condition = ref("gently_used");
const gender = ref("other");
const size = ref("medium");
const message = ref("");
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const f = input.files && input.files[0];
  selectedFile.value = f ? f : null;
  if (selectedFile.value) {
    if (previewUrl.value)
      try {
        URL.revokeObjectURL(previewUrl.value);
      } catch (_) {}
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  } else {
    if (previewUrl.value)
      try {
        URL.revokeObjectURL(previewUrl.value);
      } catch (_) {}
    previewUrl.value = null;
  }
};

const filteredDonations = computed(() => {
  const u = user.value;
  if (!u || !donations.value) return [];
  return donations.value.filter((d) => Number(d.user_id) === Number(u.User_ID));
});

const router = useRouter();

onMounted(async () => {
  await fetchUserData();
  if (!user.value) {
    router.push("/register");
    return;
  }
  await fetchDonations();
});

const donationsSubmit = async () => {
  try {
    message.value = "";
    const clothingName =
      selectedClothing.value === "other"
        ? customClothing.value
        : selectedClothing.value;

    const payload: any = {
      user_id: user.value?.User_ID,
      clothing_name: clothingName,
      donation_quality: condition.value,
      donation_gender: gender.value,
      donation_size: size.value,
      donation_status: "pending",
    };

    // converts image if attached.
    if (selectedFile.value) {
      const file = selectedFile.value;
      const reader = new FileReader();
      const base64: string = await new Promise((resolve, reject) => {
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      });
      payload.image_base64 = base64;
      payload.image_name = file.name;
    }

    const created = await addDonation(payload);
    message.value = `Donation submitted (id ${created.donation_id}). Thank you!`;

    // reset form.
    selectedClothing.value = "t-shirt";
    customClothing.value = "";
    quantity.value = null;
    condition.value = "gently_used";
    gender.value = "other";
    selectedFile.value = null;
    previewUrl.value = null;
  } catch (err: any) {
    message.value = `Error: ${err?.message ?? String(err)}`;
  }
};
</script>

<template>
  <div>
    <h2>Donate Page</h2>
    <p>This is the donate page. More features coming soon!</p>

    <form @submit.prevent="donationsSubmit()">
      <div>
        <label for="clothingTypeSelect">Type of clothing:</label>
        <select id="clothingTypeSelect" v-model="selectedClothing" required>
          <option value="t-shirt">T-Shirt</option>
          <option value="jacket">Jacket</option>
          <option value="pants">Pants</option>
          <option value="dress">Dress</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div v-if="selectedClothing === 'other'">
        <label for="customClothing">Type of Clothing:</label>
        <input
          id="customClothing"
          type="text"
          v-model="customClothing"
          required
        />
      </div>
      <div>
        <label for="quantity">Quantity:</label>
        <input id="quantity" type="number" v-model.number="quantity" required />
      </div>
      <div>
        <label for="condition">Condition:</label>
        <select id="condition" v-model="condition" required>
          <option value="new">New</option>
          <option value="gently_used">Gently Used</option>
          <option value="worn">Worn</option>
        </select>
      </div>
      <div>
        <label for="gender">Gender:</label>
        <select id="gender" v-model="gender" required>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label for="size">Size:</label>
        <select id="size" v-model="size" required>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label for="image">Attach Image (optional):</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          @change="handleFileChange"
        />
        <div v-if="previewUrl">
          <p>Preview:</p>
          <img
            :src="previewUrl"
            alt="preview"
            style="max-width: 200px; max-height: 200px"
          />
        </div>
      </div>
      <button type="submit">Submit Donation</button>
      <br />
      <button type="reset">Reset</button>
    </form>

    <button @click="router.push('/catalog')">Go to Catalog</button>

    <p v-if="message">{{ message }}</p>
  </div>
</template>
