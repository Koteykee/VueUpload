<template>
  <div
    v-if="modelValue"
    class="fixed top-0 left-0 w-full h-full bg-black/50 z-10"
    @click="close"
  ></div>
  <div
    v-if="modelValue"
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#D4E6BA] max-w-[80%] max-h-[90%] min-w-[40%] min-h-[50%] p-5 rounded-[10px] flex flex-col justify-center items-center"
  >
    <slot :close="close"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>();

const emit = defineEmits(["update:modelValue"]);

const close = () => emit("update:modelValue", false);
</script>
