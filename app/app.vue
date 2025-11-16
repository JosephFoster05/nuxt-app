<script setup>
import { useHead } from "#app";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

useHead({
  title: "SustainWear",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { charset: "utf-8" },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
    },
    { rel: "stylesheet", href: "/css/style.css" },
  ],
  script: [{ src: "/js/script.js", body: true }],
});

import useAuth from "../composables/useAuth";

try {
  //fetch user data on app load to set initial auth state
  const { fetchUserData } = useAuth();
  await fetchUserData();
} catch (e) {
  //ignore errors here; user will be null if not logged in
}

// i believe that once the user auth is fetched and user is logged in they it doesnt have to be called on other pages again.

const { user, fetchUserData, logout, error } = useAuth();
const router = useRouter();

const showLogoutSuccess = ref(false);
const logoutMessage = ref("");

async function handleLogout() {
  try {
    await logout();
  } catch (_) {}

  try {
    const visor = document.getElementById("hamburgerLinksVisor");
    if (visor) visor.style.display = "none";
  } catch (_) {}

  logoutMessage.value = user.value
    ? `Goodbye ${user.value.First_Name}! You have been logged out.`
    : "Logout successful.";
  showLogoutSuccess.value = true;

  setTimeout(() => {
    showLogoutSuccess.value = false;
    try {
      router.push("/");
    } catch (_) {}
  }, 2000);
}

const isAdmin = computed(() => {
  return !!(
    user.value && String(user.value.Role || "").toLowerCase() === "admin"
  );
});

const toast = ref(null);
onMounted(() => {
  try {
    const raw = sessionStorage.getItem("toast");
    if (raw) {
      const obj = JSON.parse(raw);
      toast.value = obj?.message || String(obj);
      sessionStorage.removeItem("toast");
      setTimeout(() => (toast.value = null), 3500);
    }
  } catch (_) {}
});
</script>

<template>
  <div>
    <header>
      <h2><NuxtLink to="/">S.W</NuxtLink></h2>
      <div id="hamburgerIcon">
        <a
          href="javascript:void(0);"
          class="icon"
          onclick="generateHamburgerLinks()"
        >
          <i class="fa fa-bars"></i>
        </a>
      </div>
    </header>

    <hr class="divider" />

    <div v-if="toast" class="app-toast">{{ toast }}</div>

    <div id="hamburgerLinksVisor">
      <div id="hamburgerLinks">
        <NuxtLink to="/about-us">About</NuxtLink>
        <NuxtLink to="/our-impact">Impact</NuxtLink>
        <NuxtLink v-if="!user" to="/register">Register</NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin/admin-dashboard"
          >Admin Dashboard</NuxtLink
        >
        <NuxtLink v-if="!user" to="/login">Login</NuxtLink>
        <NuxtLink v-if="user" to="/donate">Donate</NuxtLink>
        <NuxtLink v-if="user" to="/dashboard">Dashboard</NuxtLink>
        <button v-if="user" @click="handleLogout()">Logout</button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showLogoutSuccess" class="app-modal-overlay">
        <div class="app-modal">
          <h3>Logged out</h3>
          <p>{{ logoutMessage }}</p>
        </div>
      </div>
    </transition>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.app-toast {
  position: fixed;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 10px 14px;
  border-radius: 6px;
  z-index: 1100;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.app-modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1200;
}
.app-modal {
  background: #fff;
  padding: 16px 18px;
  border-radius: 8px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
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
.fade-enter-from .app-modal,
.fade-leave-to .app-modal {
  transform: translateY(-6px) scale(0.99);
  opacity: 0;
}
.fade-enter-to .app-modal,
.fade-leave-from .app-modal {
  transform: translateY(0) scale(1);
  opacity: 1;
}
</style>
