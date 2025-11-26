<template>
  <Layout>
    <form @submit="">
      <label for="username" class="label">Username</label>
      <input
        v-model="username"
        v-bind="usernameAttrs"
        type="text"
        id="username"
        class="input"
      />
      <div class="error">{{ errors.username }}</div>
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
import { registrationSchema } from "@/features/auth/validation/registration.schema";

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: registrationSchema,
});

// const onRegister = handleSubmit(async (values) => {

//   try {
//     await
//   } catch (err) {

//   }
// });

const [username, usernameAttrs] = defineField("username");
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
