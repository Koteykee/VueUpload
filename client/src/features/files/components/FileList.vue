<template>
  <ul>
    <li v-for="file in filesList" :key="file._id">
      <img src="" alt="Picture" />
      <p>{{ file.originalname }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { IFile } from "@/stores/useFileStore";

const { filesList } = defineProps<{ filesList: IFile[] }>();
</script>

<style scoped></style>
