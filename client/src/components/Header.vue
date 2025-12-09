<template>
  <nav class="bg-[#C1D8CA] flex justify-center">
    <div v-if="!auth.user" class="flex gap-[50px] m-2.5">
      <router-link
        to="/login"
        class="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
        >Login</router-link
      >
      <router-link
        to="/registration"
        class="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
        >Registration</router-link
      >
    </div>
    <div v-else class="flex gap-[50px] m-2.5">
      <router-link
        to="/public"
        class="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
        >Main Page</router-link
      >
      <router-link
        to="/user"
        class="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
        >My files</router-link
      >
      <div
        @click="handleLogout"
        class="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
      >
        Logout
      </div>
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
