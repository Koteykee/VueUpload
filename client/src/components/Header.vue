<template>
  <nav class="nav">
    <router-link to="/login" class="nav-item">Login</router-link>
    <router-link to="/registration" class="nav-item">Registration</router-link>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.nav {
  background-color: rgb(193, 216, 202);
  display: flex;
  justify-content: center;
  gap: 50px;
}

.nav-item {
  font-size: 26px;
  margin: 10px;
  cursor: pointer;
  text-decoration: none;
}

.nav-item:hover {
  text-decoration: underline;
  text-decoration-color: rgb(73, 121, 84);
}
</style>
