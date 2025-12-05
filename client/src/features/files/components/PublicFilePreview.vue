<template>
  <div class="wrapper">
    <img v-if="imageUrl" :src="imageUrl" alt="Picture" class="img" />
    <div>
      <p>Name: {{ file.originalname }}</p>
      <p>Private: {{ file.isPublic ? "No" : "Yes" }}</p>
      <p>Type: {{ file.mimetype }}</p>
      <p>Size: {{ formatSize(file.size) }}</p>
      <p>Uploaded: {{ formatDate(file.createdAt) }}</p>
      <p>Downloads: {{ file.downloads }}</p>
    </div>
    <button
      @click="downloadFile(file._id, file.originalname)"
      class="btn download"
    >
      Download file
    </button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";

const { file } = defineProps<{ file: IFile }>();
const fileStore = useFileStore();
const imageUrl = ref<string | null>(null);

onMounted(async () => {
  try {
    const blob = await fileStore.fetchPublicFilePreview(file._id);

    if (blob) {
      imageUrl.value = URL.createObjectURL(blob);
    }
  } catch (err) {
    console.error("Unable to load preview:", err);
  }
});

onBeforeUnmount(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});

const formatSize = (bytes: number) => {
  return (bytes / 1024).toFixed(1) + " KB";
};

const formatDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const downloadFile = async (id: string, filename: string) => {
  try {
    await fileStore.fetchDownloadFile(id, filename);
  } catch (err) {
    console.error("Unable to download file:", err);
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
  flex: 1;
}

.img {
  max-width: 100%;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}

.download {
  background-color: #78bb8f;
}

.btn:hover {
  filter: brightness(0.9);
}
</style>
