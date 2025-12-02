<template>
  <div>
    <img src="" alt="Picture" />
    <div>
      <button @click="downloadFile(file._id, file.originalname)">
        Скачать файл
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";

const { file } = defineProps<{ file: IFile }>();
const store = useFileStore();
const publicFile = ref();

onMounted(async () => {
  try {
    const result = await store.fetchUserFilePreview(file._id);
    publicFile.value = result ?? null;
  } catch (err) {
    console.error("Не удалось загрузить файлы:", err);
  }
});

const downloadFile = async (id: string, filename: string) => {
  await store.fetchDownloadFile(id, filename);
};
</script>
