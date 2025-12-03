<template>
  <div v-if="modelValue" class="darkness" @click="close"></div>
  <div v-if="modelValue" class="modal-wrapper">
    <slot :close="close"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>();

const emit = defineEmits(["update:modelValue"]);

const close = () => emit("update:modelValue", false);
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  background-color: rgb(212, 230, 186);
  width: 80%;
  max-width: 1200px;
  min-width: 300px;
  padding: 20px;
  border-radius: 10px;
}

.darkness {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
</style>
