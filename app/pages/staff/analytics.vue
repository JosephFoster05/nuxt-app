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

    <div>
        <h2>Users</h2>
        <table>
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.User_ID">
                    <td>{{ user.User_ID }}</td>
                    <td>{{ user.First_Name }}</td>
                    <td>{{ user.Last_Name }}</td>
                    <td>{{ user.Email }}</td>
                    <td>{{ user.Role }}</td>  <!-- if null then need to display just user no extra perms-->
                </tr>
            </tbody>
        </table>
    </div>


</template>