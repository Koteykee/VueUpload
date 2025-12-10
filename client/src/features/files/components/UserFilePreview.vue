<template>
  <div
    class="flex flex-col items-center justify-center text-center gap-5 w-full h-full overflow-hidden"
  >
    <div v-if="imageUrl" class="flex-1 min-h-0 overflow-hidden">
      <img
        :src="imageUrl"
        alt="Picture"
        class="max-w-full max-h-full object-contain"
      />
    </div>
    <div class="shrink-0">
      <Infoblock
        :file="file"
        :editable="true"
        :is-editing="isEditing"
        @updated="emit('uploaded')"
        @close-edit="isEditing = false"
      />
      <div class="flex gap-5 mt-2.5 justify-center">
        <button
          @click="toggleEdit"
          class="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 bg-[#b6c46a]"
        >
          {{ isEditing ? "Cancel" : "Edit file" }}
        </button>
        <button
          @click="downloadFile(file._id, file.originalname)"
          class="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 bg-[#78bb8f]"
        >
          Download file
        </button>
        <button
          @click="deleteFile(file._id)"
          class="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 bg-[#d37575]"
        >
          Delete file
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";
import { toast } from "vue3-toastify";

import Infoblock from "./Infoblock.vue";

const { file } = defineProps<{ file: IFile }>();
const emit = defineEmits(["close", "uploaded"]);
const fileStore = useFileStore();
const imageUrl = ref<string | null>(null);
const isEditing = ref(false);

onMounted(async () => {
  try {
    const blob = await fileStore.fetchUserFilePreview(file._id);

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

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const downloadFile = async (id: string, filename: string) => {
  try {
    await fileStore.fetchDownloadFile(id, filename);
  } catch (err) {
    console.error("Unable to download file:", err);
  }
};

const deleteFile = async (id: string) => {
  const confirmed = confirm("Do you really want to delete this file?");
  if (!confirmed) return;

  try {
    await fileStore.fetchDeleteFile(id);

    emit("uploaded");
    emit("close");
    toast.success("Deleted successfully!");
  } catch (err) {
    console.error("Unable to delete file:", err);
  }
};
</script>
