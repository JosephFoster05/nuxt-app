<script setup>
import { ref, computed } from "vue";
import useAuth from "../../composables/useAuth";

const { user } = useAuth();
const isAdmin = computed(
  () =>
    !!(user.value && String(user.value.Role || "").toLowerCase() === "admin")
);

// Fetch and display list of users
const { data: users, pending, error, refresh } = await useFetch("/api/users");

const showConfirm = ref(false);
const selectedUser = ref(null);
const deleting = ref(false);
const deleteError = ref("");
const showEdit = ref(false);
const editError = ref("");
const saving = ref(false);

const editUser = ref({
  User_ID: null,
  First_Name: "",
  Last_Name: "",
  Email: "",
  Phone: "",
  Role: "",
});
const newPassword = ref("");
const confirmPassword = ref("");

function openConfirm(u) {
  selectedUser.value = u;
  deleteError.value = "";
  showConfirm.value = true;
}

function closeConfirm() {
  showConfirm.value = false;
  selectedUser.value = null;
}

function openEdit(u) {
  editError.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  editUser.value = {
    User_ID: u.User_ID,
    First_Name: u.First_Name || "",
    Last_Name: u.Last_Name || "",
    Email: u.Email || "",
    Phone: u.Phone || "",
    Role: u.Role || "",
  };
  showEdit.value = true;
}

function closeEdit() {
  showEdit.value = false;
  editUser.value = {
    User_ID: null,
    First_Name: "",
    Last_Name: "",
    Email: "",
    Phone: "",
    Role: "",
  };
  newPassword.value = "";
  confirmPassword.value = "";
}

async function confirmDelete() {
  if (!selectedUser.value) return;
  deleting.value = true;
  deleteError.value = "";
  try {
    await $fetch("/api/users", {
      method: "DELETE",
      body: { Email: selectedUser.value.Email },
    });

    await refresh();
    closeConfirm();
  } catch (err) {
    // show a readable error
    deleteError.value = String(
      err?.data?.message || err?.statusMessage || err?.message || err
    );
  } finally {
    deleting.value = false;
  }
}

async function saveEdit() {
  editError.value = "";
  if (!editUser.value || !editUser.value.User_ID) return;
  if (newPassword.value || confirmPassword.value) {
    if (newPassword.value !== confirmPassword.value) {
      editError.value = "Passwords do not match";
      return;
    }
    if (String(newPassword.value).length < 6) {
      editError.value = "Password must be at least 6 characters";
      return;
    }
  }

  saving.value = true;
  try {
    const body = {
      User_ID: editUser.value.User_ID,
      First_Name: editUser.value.First_Name,
      Last_Name: editUser.value.Last_Name,
      Email: editUser.value.Email,
      Phone: editUser.value.Phone,
      Role: editUser.value.Role,
    };
    if (newPassword.value) body.NewPassword = newPassword.value;

    await $fetch("/api/users", { method: "PATCH", body });
    await refresh();
    closeEdit();
  } catch (err) {
    editError.value = String(
      err?.data?.message || err?.statusMessage || err?.message || err
    );
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div>
    <h2>Users</h2>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message || error }}</div>
    <ul v-else>
      <li v-for="u in users || []" :key="u.User_ID" style="margin-bottom: 12px">
        <div style="display: flex; align-items: center; gap: 12px">
          <div>
            <strong>{{ u.First_Name }} {{ u.Last_Name }}</strong>
            <div>{{ u.Email }}</div>
            <div v-if="u.Role">Role: {{ u.Role }}</div>
            <div v-if="u.Phone">Phone: {{ u.Phone }}</div>
          </div>
          <div style="margin-left: auto; display: flex; gap: 8px">
            <button v-if="isAdmin" @click="openEdit(u)" class="modify-btn">
              Modify
            </button>
            <button
              @click="openConfirm(u)"
              aria-label="Delete user"
              class="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="showConfirm" class="modal-overlay">
      <div class="modal">
        <h3>Confirm delete</h3>
        <p>
          Are you sure you want to delete
          <strong
            >{{ selectedUser?.First_Name }}
            {{ selectedUser?.Last_Name }}</strong
          >
          (<em>{{ selectedUser?.Email }}</em
          >)?
        </p>
        <div v-if="deleteError" class="error">Error: {{ deleteError }}</div>
        <div class="modal-actions">
          <button @click="confirmDelete" :disabled="deleting" class="confirm">
            Yes, delete
          </button>
          <button @click="closeConfirm" :disabled="deleting">Cancel</button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showEdit" class="modal-overlay">
        <div class="modal">
          <h3>Edit user</h3>
          <form @submit.prevent="saveEdit">
            <div>
              <label>First name</label>
              <input v-model="editUser.First_Name" required />
            </div>
            <div>
              <label>Last name</label>
              <input v-model="editUser.Last_Name" required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" v-model="editUser.Email" required />
            </div>
            <div>
              <label>Phone</label>
              <input v-model="editUser.Phone" />
            </div>
            <div>
              <label>Role</label>
              <select v-model="editUser.Role">
                <option value="Donor">Donor</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <hr />
            <div>
              <label>New password (leave blank to keep current)</label>
              <input type="password" v-model="newPassword" />
            </div>
            <div>
              <label>Confirm password</label>
              <input type="password" v-model="confirmPassword" />
            </div>

            <div v-if="editError" class="error">{{ editError }}</div>

            <div class="modal-actions">
              <button type="submit" :disabled="saving" class="confirm">
                Save
              </button>
              <button type="button" @click="closeEdit" :disabled="saving">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
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
  max-width: 640px; /* a bit wider for edit form but still constrained */
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
.modal form > div {
  margin-bottom: 8px;
}
.modal hr {
  margin: 10px 0;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
}
.delete-btn {
  background: #d9534f;
  color: #fff;
  border: 0;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn:hover {
  opacity: 0.9;
}
.modify-btn {
  background: #2b6cb0;
  color: #fff;
  border: 0;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.modify-btn:hover {
  opacity: 0.95;
}
.confirm {
  background: #c0392b;
  color: #fff;
  border: 0;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: #b00020;
  margin-top: 8px;
}
</style>
