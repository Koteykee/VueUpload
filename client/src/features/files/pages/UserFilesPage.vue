<template>
  <Layout>
    <p v-if="filesList.length === 0" class="text-[24px] m-5 text-center">
      No files yet.
    </p>
    <FileList
      :filesList="filesList"
      :isUserPage="true"
      @select="openModal"
      @uploaded="refreshFiles"
    />
    <Modal v-model="isModalOpen">
      <UserFilePreview
        v-if="selectedFile"
        :file="selectedFile"
        @close="isModalOpen = false"
        @uploaded="refreshFiles"
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

const fileStore = useFileStore();
const filesList = ref<IFile[]>([]);
const isModalOpen = ref(false);
const selectedFile = ref<IFile | null>(null);

onMounted(async () => {
  try {
    refreshFiles();
  } catch (err) {
    console.error("Unable to load files:", err);
  }
});

const openModal = (file: IFile) => {
  selectedFile.value = file;
  isModalOpen.value = true;
};

const refreshFiles = async () => {
  const result = await fileStore.fetchUserFiles();
  filesList.value = result ?? [];

  if (selectedFile.value) {
    const updated = filesList.value.find(
      (file) => file._id === selectedFile.value!._id
    );
    if (updated) {
      selectedFile.value = updated;
    }
  }
};
</script>
