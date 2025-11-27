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
    <div class="error">{{ errors.email }}</div>
    <label for="password" class="label">Password</label>
    <input
      v-model="password"
      v-bind="passwordAttrs"
      id="password"
      type="password"
      class="input"
    />
    <div class="error">{{ errors.password }}</div>
    <button type="submit" class="btn">Login</button>
  </form>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAuthStore } from "../../../stores/useAuthStore";
import {
  loginSchema,
  type LoginSchemaType,
} from "@/features/auth/validation/login.schema";

const auth = useAuthStore();
const router = useRouter();

const { errors, handleSubmit, defineField } = useForm<LoginSchemaType>({
  validationSchema: loginSchema,
});

//Дописать catch
const onLogin = handleSubmit(async (values) => {
  try {
    await auth.login(values);
    router.push("/public");
  } catch (err) {}
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
