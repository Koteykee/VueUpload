<template>
  <form @submit="onLogin">
    <label for="email" class="label">Email</label>
    <input
      v-model="email"
      v-bind="emailAttrs"
      id="email"
      type="email"
      class="input"
    />
    <div v-if="errors.email" class="error">{{ errors.email }}</div>
    <label for="password" class="label">Password</label>
    <input
      v-model="password"
      v-bind="passwordAttrs"
      id="password"
      type="password"
      class="input"
    />
    <div v-if="errors.password" class="error">{{ errors.password }}</div>
    <p v-if="error" class="error">{{ error }}</p>
    <button type="submit" class="btn">Login</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAuthStore } from "../../../stores/useAuthStore";
import {
  loginSchema,
  type LoginSchemaType,
} from "@/features/auth/validation/login.schema";
import { isAxiosError } from "axios";

const auth = useAuthStore();
const router = useRouter();
const error = ref("");

const { errors, handleSubmit, defineField, setErrors } =
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

.btn {
  font-size: 18px;
  color: black;
  padding: 4px;
  cursor: pointer;
}
</style>
