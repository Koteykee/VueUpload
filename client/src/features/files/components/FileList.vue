<template>
  <ul class="container">
    <li
      v-for="file in filesList"
      :key="file._id"
      @click="$emit('select', file)"
      class="file"
    >
      <div class="img-wrapper">
        <img :src="previews[file._id]" alt="Picture" />
      </div>
      <p class="name">{{ file.originalname }}</p>
    </li>
    <li class="file add-file" @click="openFileDialog">
      <span>Add file</span>
    </li>
  </ul>
  <input
    type="file"
    ref="fileInput"
    @change="onFileChange"
    style="display: none"
  />
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
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  list-style: none;
}

.file {
  width: 150px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.file:hover,
.add-file:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.img-wrapper {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.img-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.name {
  text-align: center;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  font-size: 14px;
}

.add-file {
  width: 100px;
  height: 100px;
  margin: 20px 0;
  border: 2px dashed #8a8a8a;
  color: #555;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
