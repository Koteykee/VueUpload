<template>
  <router-link
    :to="to"
    class="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
  >
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  to: string;
}

defineProps<Props>();
</script>
