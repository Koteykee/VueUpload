<template>
  <div class="my-5 mx-auto w-full max-w-xl">
    <form @submit="onLogin" class="flex flex-col gap-3">
      <FormField
        id="email"
        type="email"
        label="Email"
        class="flex flex-col gap-3"
        v-model="email"
        v-bind="emailAttrs"
        :error="errors.email"
      />
      <FormField
        id="password"
        type="password"
        label="Password"
        class="flex flex-col gap-3"
        v-model="password"
        v-bind="passwordAttrs"
        :error="errors.password"
      />
      <p v-if="error" class="text-[18px] text-[#E62828]">{{ error }}</p>
      <button
        type="submit"
        class="text-[18px] p-1 cursor-pointer bg-white border"
        :disabled="isDisabled"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAuthStore } from "../../../stores/useAuthStore";
import {
  loginSchema,
  type LoginSchemaType,
} from "@/features/auth/validation/login.schema";
import { isAxiosError } from "axios";

import FormField from "@/components/FormField.vue";

const auth = useAuthStore();
const router = useRouter();
const error = ref("");

const { errors, handleSubmit, defineField, setErrors, isSubmitting } =
  useForm<LoginSchemaType>({
    validationSchema: loginSchema,
  });

const onLogin = handleSubmit(async (values) => {
  try {
    await auth.login(values);
    router.push("/public");
  } catch (err: any) {
    if (isAxiosError(err)) {
      const errorResponse = err.response?.data;
      if (errorResponse.message) {
        error.value = errorResponse.message;
      } else if (errorResponse.errors) {
        setErrors(errorResponse.errors);
      }
    } else console.log(err);
  }
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const isDisabled = computed(() => {
  return isSubmitting.value || Object.keys(errors.value).length > 0;
});
</script>
