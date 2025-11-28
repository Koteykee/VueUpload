<template>
  <Layout>
    <FileList v-if="filesList" :filesList="filesList" @select="openModal" />
    <p v-else>No files yet.</p>
    <Modal v-model="isModalOpen">
      <FilePreview
        v-if="selectedFile"
        :file="selectedFile"
        @close="isModalOpen = false"
      />
    </Modal>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";

import Layout from "@/components/Layout.vue";
import FileList from "../components/FileList.vue";
import Modal from "@/components/Modal.vue";
import FilePreview from "../components/FilePreview.vue";

const file = useFileStore();
const filesList = ref<IFile[] | null>(null);
const isModalOpen = ref(false);
const selectedFile = ref<IFile | null>(null);

onMounted(async () => {
  try {
    const result = await file.fetchPublicFiles();
    filesList.value = result ?? null;
  } catch (err) {
    console.error("Не удалось загрузить файлы:", err);
  }
});

const openModal = (file: IFile) => {
  selectedFile.value = file;
  isModalOpen.value = true;
};
</script>

<style scoped></style>
