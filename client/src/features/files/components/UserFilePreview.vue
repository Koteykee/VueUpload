<template>
  <div class="wrapper">
    <img v-if="imageUrl" :src="imageUrl" alt="Picture" class="img" />
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
            class="input"
          />
          <div class="error">{{ errors.name }}</div>
        </div>
        <div>
          <label for="public">Private: </label>
          <select
            v-model="isPublic"
            v-bind="publicAttrs"
            id="public"
            class="select"
          >
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
          <div class="error">{{ errors.isPublic }}</div>
        </div>
        <button type="submit" class="btn save" :disabled="isDisabled">
          Save
        </button>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";
import type { PatchFile } from "@/api/file.api";
import { useForm } from "vee-validate";
import { editSchema } from "../validation/edit.schema";

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
  } catch (err) {
    console.error("Unable to delete file:", err);
  }
};

const isDisabled = computed(() => {
  return Object.keys(errors.value).length > 0;
});
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
  margin-bottom: 4px;
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

.btn:disabled {
  filter: brightness(0.7);
  cursor: not-allowed;
}

.error {
  color: rgb(230, 40, 40);
  margin-top: 4px;
}

.input {
  width: 300px;
  padding: 4px;
}

.select {
  padding: 4px;
  margin: 4px 0;
  cursor: pointer;
}
</style>
