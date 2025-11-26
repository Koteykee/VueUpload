<template>
  <Header />
  <main class="container">
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
</script>

<style scoped></style>
