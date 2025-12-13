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

onMounted(() => {
    fetchDonations();
})


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
                    <td>{{ user.Role || 'User' }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <br>
    <hr>
    <br>

    <div>
        <h2>Donations</h2>
        <table>
            <thead>
                <tr>
                    <th>Donation ID</th>
                    <th>User ID</th>
                    <th>Gender</th>
                    <th>Quality</th>
                    <th>size</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="donation in donations" :key="donation.donation_id">
                    <td>{{ donation.donation_id }}</td>
                    <td>{{ donation.user_id }}</td>
                    <td>{{ donation.donation_gender }}</td>
                    <td>{{ donation.donation_quality }}</td>
                    <td>{{ donation.donation_size }}</td>
                    <td>{{ donation.donation_status }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <br>
    <hr>
    <br>



</template>