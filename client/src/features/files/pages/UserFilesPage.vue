<template>
  <Layout>
    <FileList v-if="filesList" :filesList="filesList" />
    <p v-else>No files yet.</p>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";
import Layout from "@/components/Layout.vue";
import FileList from "../components/FileList.vue";

const file = useFileStore();
const filesList = ref<IFile[] | null>();

const loadFilesList = async () => {
  try {
    filesList.value = await file.fetchUserFiles();
  } catch (error) {}
};

onMounted(async () => {
  await loadFilesList();
});
</script>

<style scoped></style>
