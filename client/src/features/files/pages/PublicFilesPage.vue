<template>
  <Layout>
    <p v-if="filesList.length === 0" class="text-[24px] m-5 text-center">
      No files yet.
    </p>
    <FileList :filesList="filesList" :isUserPage="false" @select="openModal" />
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

const fileStore = useFileStore();
const filesList = ref<IFile[]>([]);
const isModalOpen = ref(false);
const selectedFile = ref<IFile | null>(null);

onMounted(async () => {
  try {
    const result = await fileStore.fetchPublicFiles();
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
