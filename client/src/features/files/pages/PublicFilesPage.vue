<template>
  <Layout>
    <FileList
      v-if="filesList.length"
      :filesList="filesList"
      @select="openModal"
    />
    <p v-else class="text">No files yet.</p>
    <Modal v-model="isModalOpen">
      <PublicFilePreview
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
import PublicFilePreview from "../components/PublicFilePreview.vue";

const file = useFileStore();
const filesList = ref<IFile[]>([]);
const isModalOpen = ref(false);
const selectedFile = ref<IFile | null>(null);

onMounted(async () => {
  try {
    const result = await file.fetchPublicFiles();
    filesList.value = result ?? [];
  } catch (err) {
    console.error("Unable to load files:", err);
  }
});

const openModal = (file: IFile) => {
  selectedFile.value = file;
  isModalOpen.value = true;
};
</script>

<style scoped>
.text {
  font-size: 24px;
  margin: 20px;
}
</style>
