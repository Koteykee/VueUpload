<template>
  <ul class="container">
    <li
      v-for="file in filesList"
      :key="file._id"
      @click="$emit('select', file)"
      class="file"
    >
      <img src="" alt="Picture" />
      <p>{{ file.originalname }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { IFile } from "@/stores/useFileStore";

const { filesList } = defineProps<{ filesList: IFile[] }>();

defineEmits(["select"]);
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  list-style: none;
}

.file {
  padding: 10px;
  cursor: pointer;
}

.file:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
