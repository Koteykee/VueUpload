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
      <div>
        <div v-if="!isEditing">
          <p>Name: {{ file.originalname }}</p>
          <p>Private: {{ file.isPublic ? "No" : "Yes" }}</p>
        </div>
        <form v-else @submit.prevent="saveEdit">
          <div>
            <label for="name">Name: </label>
            <input
              v-model="name"
              v-bind="nameAttrs"
              id="name"
              type="text"
              class="w-[300px] p-1 bg-white border"
            />
            <div class="text-[#e62828] mt-1">{{ errors.name }}</div>
          </div>
          <div>
            <label for="public">Private: </label>
            <select
              v-model="isPublic"
              v-bind="publicAttrs"
              id="public"
              class="p-1 my-1 cursor-pointer bg-white border"
            >
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
            <div class="text-[#e62828] mt-1">{{ errors.isPublic }}</div>
          </div>
          <button
            type="submit"
            class="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 disabled:brightness-70 disabled:cursor-not-allowed bg-[#78bb8f] mb-1"
            :disabled="isDisabled"
          >
            Save
          </button>
        </form>
        <p>Type: {{ file.mimetype }}</p>
        <p>Size: {{ formatSize(file.size) }}</p>
        <p>Uploaded: {{ formatDate(file.createdAt) }}</p>
        <p>Downloads: {{ file.downloads }}</p>
      </div>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";
import type { PatchFile } from "@/api/file.api";
import { useForm } from "vee-validate";
import { editSchema } from "../validation/edit.schema";
import { toast } from "vue3-toastify";

const { file } = defineProps<{ file: IFile }>();
const fileStore = useFileStore();
const imageUrl = ref<string | null>(null);
const isEditing = ref(false);

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: editSchema,
  initialValues: {
    name: file.originalname,
    isPublic: file.isPublic,
  },
});

const [name, nameAttrs] = defineField("name");
const [isPublic, publicAttrs] = defineField("isPublic");

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

const emit = defineEmits(["close", "uploaded"]);

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

watch(
  () => file,
  (newFile) => {
    resetForm({
      values: {
        name: newFile.originalname,
        isPublic: newFile.isPublic,
      },
    });
  },
  { deep: true }
);

const toggleEdit = async () => {
  if (isEditing.value) resetForm();

  isEditing.value = !isEditing.value;
};

const saveEdit = handleSubmit(async (values) => {
  const payload: PatchFile = {};

  if (values.name !== file.originalname) {
    payload.originalname = values.name;
  }
  if (values.isPublic !== file.isPublic) {
    payload.isPublic = values.isPublic;
  }

  if (Object.keys(payload).length > 0) {
    try {
      await fileStore.fetchPatchFile(file._id, payload);

      emit("uploaded");
      toast.success("Edit successful!");
    } catch (err) {
      console.error("Unable to edit file:", err);
    }
  }

  toggleEdit();
});

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

const isDisabled = computed(() => {
  return Object.keys(errors.value).length > 0;
});
</script>
