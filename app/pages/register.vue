<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const First_Name = ref("");
const Last_Name = ref("");
const Email = ref("");
const Password = ref("");
const Phone = ref("");
const message = ref("");

const router = useRouter();
const showSuccess = ref(false);
const registeredName = ref("");

const addUser = async () => {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        First_Name: First_Name.value,
        Last_Name: Last_Name.value,
        Email: Email.value,
        Password: Password.value,
        Phone: Phone.value,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(
        body?.statusMessage || body?.message || "Failed to add user"
      );
    }

    const data = await response.json();
    registeredName.value = data.First_Name || "";
    showSuccess.value = true;

    setTimeout(() => {
      try {
        router.push("/");
      } catch (_) {}
    }, 2200);
  } catch (error) {
    message.value = `Error: ${error.message}`;
  }
};

function confirmAndGoHome() {
  showSuccess.value = false;
  try {
    router.push("/");
  } catch (_) {}
}
</script>

<template>
  <div>
    <h2>Add New User</h2>
    <form @submit.prevent="addUser">
  <div>
    <label for="First_Name">First Name:</label>
    <input type="text" id="First_Name" v-model="First_Name" required />
  </div>
  <div>
    <label for="Last_Name">Last Name:</label>
    <input type="text" id="Last_Name" v-model="Last_Name" required />
  </div>
  <div>
    <label for="Email">Email:</label>
    <input type="email" id="Email" v-model="Email" required />
  </div>
  <div>
    <label for="Password">Password:</label>
    <input type="password" id="Password" v-model="Password" required />
  </div>
  <div>
    <label for="Phone">Phone:</label>
    <input type="tel" id="Phone" v-model="Phone" required />
  </div>
  <div class="form-actions">
    <button type="submit">Register</button>
  </div>
</form>

    <div v-if="message">{{ message }}</div>

    <transition name="fade">
      <div v-if="showSuccess" class="modal-overlay">
        <div class="modal">
          <h3>Registration successful</h3>
          <p>
            Welcome {{ registeredName }} — your account was created
            successfully.
          </p>
          <div class="modal-actions">
            <button @click="confirmAndGoHome" class="confirm">OK</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1200;
}
.modal {
  background: #fff;
  padding: 18px;
  border-radius: 8px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 220ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-from .modal,
.fade-leave-to .modal {
  transform: translateY(-6px) scale(0.99);
  opacity: 0;
}
.fade-enter-to .modal,
.fade-leave-from .modal {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
}
.confirm {
  background: #2c7a7b;
  color: #fff;
  border: 0;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
