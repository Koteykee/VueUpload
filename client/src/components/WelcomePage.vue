<template>
  <Layout>
    <h1 v-if="!auth.user" class="title">
      Hello! Please login to upload a picture!
    </h1>
    <h1 v-else class="title">You are logged in as {{ auth.user.email }}</h1>
  </Layout>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/useAuthStore";
import Layout from "./Layout.vue";

const auth = useAuthStore();
</script>

<style scoped>
.title {
  margin: 20px;
}
</style>
