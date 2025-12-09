<template>
  <ul class="container flex justify-center flex-wrap gap-5 list-none mx-5">
    <li
      v-for="file in filesList"
      :key="file._id"
      @click="$emit('select', file)"
      class="w-[150px] p-2.5 cursor-pointer flex flex-col items-center justify-start hover:bg-black/10"
    >
      <div
        class="w-full h-[100px] flex items-center justify-center overflow-hidden"
      >
        <img
          :src="previews[file._id]"
          alt="Picture"
          class="max-w-full max-h-full object-contain"
        />
      </div>
      <p class="text-center whitespace-normal wrap-break-word text-[14px]">
        {{ file.originalname }}
      </p>
    </li>
    <li
      v-if="isUserPage"
      class="cursor-pointer w-[100px] h-[100px] my-5 border-2 border-dashed border-[#8a8a8a] text-[#555] text-[16px] flex items-center justify-center hover:bg-black/10"
      @click="openFileDialog"
    >
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
import { toast } from "vue3-toastify";

const { filesList, isUserPage } = defineProps<{
  filesList: IFile[];
  isUserPage: boolean;
}>();

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
        let blob;
        if (isUserPage) {
          blob = await fileStore.fetchUserFilePreview(file._id);
        } else {
          blob = await fileStore.fetchPublicFilePreview(file._id);
        }
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
  toast.success("Added successfully!");
};
</script>
