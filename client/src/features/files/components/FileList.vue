<template>
  <ul class="container">
    <li
      v-for="file in filesList"
      :key="file._id"
      @click="$emit('select', file)"
      class="file"
    >
      <img :src="previews[file._id]" alt="Picture" />
      <p>{{ file.originalname }}</p>
    </li>
  </ul>
  <input
    type="file"
    ref="fileInput"
    @change="onFileChange"
    style="display: none"
  />
  <button @click="openFileDialog">Add file</button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";

const { filesList } = defineProps<{ filesList: IFile[] }>();

const emit = defineEmits(["select", "uploaded"]);

const previews = ref<Record<string, string>>({});
const fileStore = useFileStore();

const clearPreviews = () => {
  Object.values(previews.value).forEach((url) => URL.revokeObjectURL(url));
  previews.value = {};
};

watch(
  () => filesList,
  async (newList) => {
    clearPreviews();

    for (const file of newList) {
      try {
        const blob = await fileStore.fetchUserFilePreview(file._id);
        if (blob) {
          previews.value[file._id] = URL.createObjectURL(blob);
        }
      } catch (err) {
        console.log("Preview load error:", err);
      }
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearPreviews();
});

const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const openFileDialog = () => {
  fileInput.value?.click();
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    handleUpload();
  }
};

const handleUpload = async () => {
  if (!selectedFile.value) return;

  await fileStore.fetchUploadFile(selectedFile.value);

  emit("uploaded");
};
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
