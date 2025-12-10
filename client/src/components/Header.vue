<template>
  <nav class="bg-[#C1D8CA] flex justify-center">
    <div v-if="!auth.user" class="flex gap-[50px] m-2.5">
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/registration">Registration</NavLink>
    </div>
    <div v-else class="flex gap-[50px] m-2.5">
      <NavLink to="/public">Main Page</NavLink>
      <NavLink to="/user">My files</NavLink>
      <LogoutBtn />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/useAuthStore";

import NavLink from "./NavLink.vue";
import LogoutBtn from "./LogoutBtn.vue";

const auth = useAuthStore();
</script>
