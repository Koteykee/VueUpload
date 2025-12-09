<template>
  <Header />
  <main class="container mx-auto p-8">
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
</script>
