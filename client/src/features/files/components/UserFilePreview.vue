<template>
  <div class="wrapper">
    <img v-if="imageUrl" :src="imageUrl" alt="Picture" class="img" />
    <div>
      <div v-if="!isEditing">
        <p>Name: {{ file.originalname }}</p>
        <p>Private: {{ file.isPublic ? "Yes" : "No" }}</p>
      </div>
      <form v-else @submit.prevent="saveEdit">
        <div>
          <label for="name" class="text">Name: </label>
          <input v-model="name" v-bind="nameAttrs" id="name" type="text" />
          <div class="error">{{ errors.name }}</div>
        </div>
        <div>
          <label for="public" class="text">Private: </label>
          <select v-model="isPublic" v-bind="publicAttrs" id="public">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
          <div class="error">{{ errors.isPublic }}</div>
        </div>
        <button type="submit" class="btn save">Save</button>
      </form>
      <p>Type: {{ file.mimetype }}</p>
      <p>Size: {{ formatSize(file.size) }}</p>
      <p>Uploaded: {{ formatDate(file.createdAt) }}</p>
      <p>Downloads: {{ file.downloads }}</p>
    </div>
    <div class="btn-wrapper">
      <button @click="toggleEdit" class="btn edit">
        {{ isEditing ? "Cancel" : "Edit file" }}
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
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";
import type { PatchFile } from "@/api/file.api";
import { useForm } from "vee-validate";
import { editSchema } from "../validation/edit.schema";

const { file } = defineProps<{ file: IFile }>();
const store = useFileStore();
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
      await store.fetchPatchFile(file._id, payload);

      emit("uploaded");
    } catch (err) {
      console.error("Unable to edit file:", err);
    }
  }

  toggleEdit();
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

.save {
  background-color: #78bb8f;
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

.error {
  color: rgb(230, 40, 40);
}
</style>
