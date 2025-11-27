<template>
  <form @submit="onRegister">
    <label for="email" class="label">Email</label>
    <input
      v-model="email"
      v-bind="emailAttrs"
      type="email"
      id="email"
      class="input"
    />
    <div class="error">{{ errors.email }}</div>
    <label for="password" class="label">Password</label>
    <input
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      id="password"
      class="input"
    />
    <div class="error">{{ errors.password }}</div>
    <label for="confirmPassword" class="label">Confirm password</label>
    <input
      v-model="confirmPassword"
      v-bind="confirmPasswordAttrs"
      type="password"
      id="confirmPassword"
      class="input"
    />
    <div class="error">{{ errors.confirmPassword }}</div>
    <p v-if="error" class="error">{{ error }}</p>
    <button type="submit" class="btn">Register</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAuthStore } from "../../../stores/useAuthStore";
import {
  registrationSchema,
  type RegistrationSchemaType,
} from "@/features/auth/validation/registration.schema";
import { isAxiosError } from "axios";

const auth = useAuthStore();
const router = useRouter();
const error = ref("");

const { errors, handleSubmit, defineField, setErrors } =
  useForm<RegistrationSchemaType>({
    validationSchema: registrationSchema,
  });

const onRegister = handleSubmit(async (values) => {
  try {
    await auth.register(values);
    router.push("/login");
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
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.label {
  font-size: 20px;
  color: black;
}

.input {
  font-size: 18px;
  color: black;
  padding: 4px;
}

.error {
  font-size: 18px;
  color: rgb(230, 40, 40);
}

.message {
  font-size: 18px;
  color: rgb(40, 230, 113);
}

.btn {
  font-size: 18px;
  color: black;
  padding: 4px;
  cursor: pointer;
}
</style>
