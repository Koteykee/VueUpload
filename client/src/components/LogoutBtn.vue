<template>
  <button
    @click="handleLogout"
    class="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
  >
    Logout
  </button>
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
