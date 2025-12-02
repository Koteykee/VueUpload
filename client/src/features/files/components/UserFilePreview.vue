<template>
  <div>
    <img v-if="imageUrl" :src="imageUrl" alt="Picture" />
    <div>
      <button>Edit file</button>
      <button @click="downloadFile(file._id, file.originalname)">
        Download file
      </button>
      <button @click="deleteFile(file._id)">Delete file</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";

const { file } = defineProps<{ file: IFile }>();
const store = useFileStore();
const imageUrl = ref<string | null>(null);

const emit = defineEmits(["close", "uploaded"]);

onMounted(async () => {
  try {
    const blob = await store.fetchUserFilePreview(file._id);

    if (blob) {
      imageUrl.value = URL.createObjectURL(blob);
    }
  } catch (err) {
    console.error("Unable to load preview:", err);
  }
});

const downloadFile = async (id: string, filename: string) => {
  await store.fetchDownloadFile(id, filename);
};

const deleteFile = async (id: string) => {
  await store.fetchDeleteFile(id);

  emit("uploaded");
  emit("close");
};
</script>
