<template>
  <div class="wrapper">
    <img v-if="imageUrl" :src="imageUrl" alt="Picture" class="img" />
    <div>
      <p>
        Name:
        <span v-if="!isEditing">{{ editableFile.originalname }}</span>
        <input v-else v-model="editableFile.originalname" />
      </p>
      <p>
        Private:
        <span v-if="!isEditing">{{
          editableFile.isPublic ? "Yes" : "No"
        }}</span>
        <select v-else v-model="editableFile.isPublic">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </p>
      <p>Type: {{ file.mimetype }}</p>
      <p>Size: {{ formatSize(file.size) }}</p>
      <p>Uploaded: {{ formatDate(file.createdAt) }}</p>
      <p>Downloads: {{ file.downloads }}</p>
    </div>
    <div class="btn-wrapper">
      <button @click="toggleEdit" class="btn edit">
        {{ isEditing ? "Save" : "Edit file" }}
      </button>
      <button
        @click="downloadFile(file._id, file.originalname)"
        class="btn download"
      >
        Download file
      </button>
      <button @click="deleteFile(file._id)" class="btn delete">
        Delete file
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";
import type { PatchFile } from "@/api/file.api";

const { file } = defineProps<{ file: IFile }>();
const store = useFileStore();
const imageUrl = ref<string | null>(null);
const isEditing = ref(false);

const editableFile = reactive({ ...file });

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
    const blob = await store.fetchUserFilePreview(file._id);

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

const toggleEdit = async () => {
  if (isEditing.value) {
    const payload: PatchFile = {};
    if (editableFile.originalname !== file.originalname) {
      payload.originalname = editableFile.originalname;
    }
    if (editableFile.isPublic !== file.isPublic) {
      payload.isPublic = editableFile.isPublic;
    }

    if (Object.keys(payload).length > 0) {
      await store.fetchPatchFile(editableFile._id, payload);

      emit("uploaded");
    }
  }

  isEditing.value = !isEditing.value;
};

const downloadFile = async (id: string, filename: string) => {
  await store.fetchDownloadFile(id, filename);
};

const deleteFile = async (id: string) => {
  await store.fetchDeleteFile(id);

  emit("uploaded");
  emit("close");
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
}

.img {
  max-width: 1100px;
}

.btn-wrapper {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}

.edit {
  background-color: #b6c46a;
}

.download {
  background-color: #78bb8f;
}

.delete {
  background-color: #d37575;
}

.btn:hover {
  filter: brightness(0.9);
}
</style>
