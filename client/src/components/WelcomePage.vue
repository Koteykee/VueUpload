<template>
  <Layout>
    <h1 v-if="!auth.user" class="text-[26px] m-5 font-bold text-center">
      Hello! Please login to upload a picture!
    </h1>
    <h1 v-else class="text-[26px] m-5 font-bold text-center">
      You are logged in as {{ auth.user.email }}
    </h1>
  </Layout>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/useAuthStore";
import Layout from "./Layout.vue";

const auth = useAuthStore();
</script>
