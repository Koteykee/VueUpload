<template>
  <div class="my-5 mx-auto w-full max-w-xl">
    <form @submit="onRegister" class="flex flex-col gap-3">
      <label for="email" class="text-[20px]">Email</label>
      <input
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        id="email"
        class="text-[18px] p-1 bg-white border"
      />
      <div
        v-if="errors.email"
        class="text-[18px] text-[#E62828] first-letter:uppercase"
      >
        {{ errors.email }}
      </div>
      <label for="password" class="text-[20px]">Password</label>
      <input
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        id="password"
        class="text-[18px] p-1 bg-white border"
      />
      <div v-if="errors.password" class="text-[18px] text-[#E62828]">
        {{ errors.password }}
      </div>
      <label for="confirmPassword" class="text-[20px]">Confirm password</label>
      <input
        v-model="confirmPassword"
        v-bind="confirmPasswordAttrs"
        type="password"
        id="confirmPassword"
        class="text-[18px] p-1 bg-white border"
      />
      <div v-if="errors.confirmPassword" class="text-[18px] text-[#E62828]">
        {{ errors.confirmPassword }}
      </div>
      <p v-if="error" class="text-[18px] text-[#E62828]">{{ error }}</p>
      <button
        type="submit"
        class="text-[18px] p-1 cursor-pointer bg-white border"
        :disabled="isDisabled"
      >
        Register
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
  registrationSchema,
  type RegistrationSchemaType,
} from "@/features/auth/validation/registration.schema";
import { isAxiosError } from "axios";
import { toast } from "vue3-toastify";

const auth = useAuthStore();
const router = useRouter();
const error = ref("");

const { errors, handleSubmit, defineField, setErrors, isSubmitting } =
  useForm<RegistrationSchemaType>({
    validationSchema: registrationSchema,
  });

const onRegister = handleSubmit(async (values) => {
  try {
    const response = await auth.register(values);
    router.push("/login").then(() => {
      toast.success(response.message);
    });
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
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const isDisabled = computed(() => {
  return isSubmitting.value || Object.keys(errors.value).length > 0;
});
</script>
