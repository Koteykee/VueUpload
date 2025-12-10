<template>
  <div>
    <div v-if="!editable || !isEditing">
      <p>Name: {{ file.originalname }}</p>
      <p>Private: {{ file.isPublic ? "No" : "Yes" }}</p>
    </div>
    <form v-else @submit.prevent="saveEdit">
      <FormField
        id="name"
        label="Email: "
        v-model="name"
        v-bind="nameAttrs"
        :error="errors.name"
      />
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
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useFileStore, type IFile } from "@/stores/useFileStore";
import type { PatchFile } from "@/api/file.api";
import { useForm } from "vee-validate";
import { editSchema } from "../validation/edit.schema";
import { toast } from "vue3-toastify";

import FormField from "@/components/FormField.vue";

const props = withDefaults(
  defineProps<{
    file: IFile;
    editable?: boolean;
    isEditing?: boolean;
  }>(),
  {
    editable: false,
    isEditing: false,
  }
);

const emit = defineEmits(["updated", "closeEdit"]);
const fileStore = useFileStore();

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

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: editSchema,
  initialValues: {
    name: props.file.originalname,
    isPublic: props.file.isPublic,
  },
});

const [name, nameAttrs] = defineField("name");
const [isPublic, publicAttrs] = defineField("isPublic");

watch(
  () => props.file,
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

const isDisabled = computed(() => {
  return Object.keys(errors.value).length > 0;
});

const saveEdit = handleSubmit(async (values) => {
  const payload: PatchFile = {};

  if (values.name !== props.file.originalname) {
    payload.originalname = values.name;
  }
  if (values.isPublic !== props.file.isPublic) {
    payload.isPublic = values.isPublic;
  }

  if (Object.keys(payload).length > 0) {
    try {
      await fileStore.fetchPatchFile(props.file._id, payload);

      toast.success("Edit successful!");
      emit("updated");
      emit("closeEdit");
    } catch (err) {
      console.error("Unable to edit file:", err);
    }
  }

  emit("closeEdit");
});
</script>
