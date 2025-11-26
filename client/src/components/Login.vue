<template>
  <Layout>
    <form @submit="">
      <label for="username" class="label">Username</label>
      <input
        v-model="username"
        v-bind="usernameAttrs"
        id="username"
        type="text"
        class="input"
      />
      <div class="error">{{ errors.username }}</div>
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
  </Layout>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { loginSchema } from "@/features/auth/validation/login.schema";
import Layout from "./Layout.vue";

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: loginSchema,
});

// const onLogin = handleSubmit(async (values) => {

//   try {
//     await
//   } catch (err) {

//   }
// });

const [username, usernameAttrs] = defineField("username");
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
