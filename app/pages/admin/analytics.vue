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
      try {
    if (!user.value || !user) {
      router.push("/login");
      return;
    }
  } catch (_) {}
    fetchDonations();
})
function exportUsersToCSV()
{
    const csvContent = "data:text/csv;charset=utf-8,"
        + ["User_ID,First_Name,Last_Name,Email,Role"]
        .concat(users.value.map(u => `${u.User_ID},${u.First_Name},${u.Last_Name},${u.Email},${u.Role || 'User'}`))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportDonationsToCSV()
{

    const csvContent = "data:text/csv;charset=utf-8,"
        + ["Donation_ID,User_ID,Gender,Quality,Size,Status"]
        .concat(donations.value.map(d => `${d.donation_id},${d.user_id},${d.donation_gender},${d.donation_quality},${d.donation_size},${d.donation_status}`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "donations_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportUsersAndDonationsToCSV()
{
    // both as one file
    const userHeaders = "User_ID,First_Name,Last_Name,Email,Role";
    const donationHeaders = "Donation_ID,User_ID,Gender,Quality,Size,Status";

    const userRows = users.value.map(u => `${u.User_ID},${u.First_Name},${u.Last_Name},${u.Email},${u.Role || 'User'}`);
    const donationRows = donations.value.map(d => `${d.donation_id},${d.user_id},${ d.donation_gender},${d.donation_quality},${d.donation_size},${d.donation_status}`);

    const csvContent = "data:text/csv;charset=utf-8,"
        + [userHeaders]
        .concat(userRows)
        .concat([""]) // empty line between users and donations
        .concat([donationHeaders])
        .concat(donationRows)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_and_donations_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

</script>

<script>

definePageMeta({
  middleware: 'admin'
})

</script>

<template>

    <h1>Analyics</h1>
    <div>
        <h2>Statistics</h2>
        <h3>User statistics</h3>
        <ul>
            <li>Total Users: {{ users ? users.length : 0 }}</li>
            <li>Admins: {{ users ? users.filter(u => u.Role === 'Admin').length : 0 }}</li>
            <li>Staff: {{ users ? users.filter(u => u.Role === 'Staff').length : 0 }}</li>
            <li>Regular Users: {{ users ? users.filter(u => !u.Role || u.Role === 'User').length : 0 }}</li>
        </ul>

        <h3>Donation statistics</h3>
        <ul>
            <li>Total Donations: {{ donations ? donations.length : 0 }}</li>
            <li>Approved Donations: {{ donations ? donations.filter(d => d.donation_status === 'approved').length : 0 }}</li>
            <li>Pending Donations: {{ donations ? donations.filter(d => d.donation_status === 'pending').length : 0 }}</li>
            <li>Denied Donations: {{ donations ? donations.filter(d => d.donation_status === 'denied').length : 0 }}</li>
        </ul>
    </div>

    <br>
    <hr>
    <br>

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

    <!-- export to csv -->
    <div>
        <h2>Export Data</h2>
        <p>This exports the data to useable CSV files that you can put into exel or google sheets and analyse effeciently!</p>
        <button @click="exportUsersToCSV">Export Users to CSV</button>
        <button @click="exportDonationsToCSV">Export Donations to CSV</button>
        <button @click="exportUsersAndDonationsToCSV">Export Users and Donations to CSV</button>
    </div>

</template>