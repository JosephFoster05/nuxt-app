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
  updateDonationStatus,
} = useDonations();

const { data: users, pending, error, refresh } = await useFetch("/api/users");

</script>

<template>

    <h1>analyics</h1>

    


</template>