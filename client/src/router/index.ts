import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/components/HomePage.vue";
import Login from "@/components/Login.vue";
import Registration from "@/components/Registration.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/registration",
      name: "Registration",
      component: Registration,
    },
  ],
});

export default router;
