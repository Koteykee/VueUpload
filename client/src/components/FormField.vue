<template>
  <div :class="class">
    <label :for="id" class="text-[20px]">{{ label }}</label>
    <input
      v-model="modelValue"
      v-bind="$attrs"
      :id="id"
      :type="type"
      :class="[
        'text-[18px] p-1 bg-white border min-w-[300px]',
        { 'border-[#E62828] border-2': error },
      ]"
    />
    <div v-if="error" class="text-[18px] text-[#E62828] first-letter:uppercase">
      {{ error }}
    </div>
  </div>
</template>

<!-- flex flex-col gap-3 -->
<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

interface Props {
  id: string;
  label?: string;
  type?: string;
  error?: string;
  class?: string;
}

withDefaults(defineProps<Props>(), {
  type: "text",
});

const modelValue = defineModel<string>();
</script>

<style scoped></style>
