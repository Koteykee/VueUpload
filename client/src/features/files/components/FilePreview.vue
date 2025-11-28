<template>
  <div>
    <img src="" alt="Picture" />
    <div>
      <button @click="download">Скачать файл</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFile } from "@/stores/useFileStore";

const { file } = defineProps<{ file: IFile }>();

const download = () => {};
</script>
