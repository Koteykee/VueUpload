<template>
  <Layout>
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
      <button type="submit" class="btn">Register</button>
    </form>
  </Layout>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import Layout from "./Layout.vue";
import {
  registrationSchema,
  type RegistrationSchemaType,
} from "@/features/auth/validation/registration.schema";
import { useAuthStore } from "../stores/useAuthStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const { errors, handleSubmit, defineField } = useForm<RegistrationSchemaType>({
  validationSchema: registrationSchema,
});

//Дописать catch
const onRegister = handleSubmit(async (values) => {
  try {
    await auth.register(values);
    router.push("/login");
  } catch (err) {}
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
