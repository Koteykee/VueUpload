<template>
  <div
    class="flex flex-col items-center justify-center text-center gap-5 flex-1"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="Picture" class="max-w-full" />
    <Infoblock :file="file" />
    <button
      @click="downloadFile(file._id, file.originalname)"
      class="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 bg-[#78bb8f]"
    >
      Download file
    </button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";

import Infoblock from "./Infoblock.vue";

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

const downloadFile = async (id: string, filename: string) => {
  try {
    await fileStore.fetchDownloadFile(id, filename);
  } catch (err) {
    console.error("Unable to download file:", err);
  }
};
</script>
