<template>
  <Layout>
    <FileList v-if="filesList.length" :filesList="filesList" />
    <p v-else>No files yet.</p>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";
import Layout from "@/components/Layout.vue";
import FileList from "../components/FileList.vue";

const file = useFileStore();
const filesList = ref<IFile[]>([]);

onMounted(async () => {
  try {
    const result = await file.fetchUserFiles();
    filesList.value = result ?? [];
  } catch (err) {
    console.error("Не удалось загрузить файлы:", err);
  }
});
</script>

<style scoped></style>
