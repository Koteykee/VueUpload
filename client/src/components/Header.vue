<template>
  <nav class="nav">
    <div v-if="!auth.user" class="wrapper">
      <router-link to="/login" class="nav-item">Login</router-link>
      <router-link to="/registration" class="nav-item"
        >Registration</router-link
      >
    </div>
    <div v-else class="wrapper">
      <router-link to="/public" class="nav-item">Main Page</router-link>
      <router-link to="/user" class="nav-item">My files</router-link>
      <div @click="handleLogout" class="nav-item">Logout</div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push("/");
}
</script>

<style scoped>
.nav {
  background-color: rgb(193, 216, 202);
  display: flex;
  justify-content: center;
}

.wrapper {
  display: flex;
  gap: 50px;
  margin: 10px;
}

.nav-item {
  font-size: 26px;
  cursor: pointer;
  text-decoration: none;
}

.nav-item:hover {
  text-decoration: underline;
  text-decoration-color: rgb(73, 121, 84);
}
</style>
