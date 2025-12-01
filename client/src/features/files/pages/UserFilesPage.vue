<template>
  <Layout>
    <p v-if="filesList.length === 0">No files yet.</p>
    <FileList
      :filesList="filesList"
      @select="openModal"
      @uploaded="refreshFiles"
    />
    <Modal v-model="isModalOpen">
      <UserFilePreview
        v-if="selectedFile"
        :file="selectedFile"
        @close="isModalOpen = false"
      />
    </Modal>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";

import Layout from "@/components/Layout.vue";
import FileList from "../components/FileList.vue";
import Modal from "@/components/Modal.vue";
import UserFilePreview from "../components/UserFilePreview.vue";

const file = useFileStore();
const filesList = ref<IFile[]>([]);
const isModalOpen = ref(false);
const selectedFile = ref<IFile | null>(null);

onMounted(async () => {
  try {
    const result = await file.fetchUserFiles();
    filesList.value = result ?? [];
  } catch (err) {
    console.error("Не удалось загрузить файлы:", err);
  }
});

const openModal = (file: IFile) => {
  selectedFile.value = file;
  isModalOpen.value = true;
};

const refreshFiles = async () => {
  const result = await file.fetchUserFiles();
  filesList.value = result ?? [];
};
</script>

<style scoped></style>
