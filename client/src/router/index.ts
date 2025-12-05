import { createRouter, createWebHistory } from "vue-router";

import WelcomePage from "@/components/WelcomePage.vue";
import LoginPage from "@/features/auth/pages/LoginPage.vue";
import RegistrationPage from "@/features/auth/pages/RegistrationPage.vue";
import PublicFilesPage from "@/features/files/pages/PublicFilesPage.vue";
import UserFilesPage from "@/features/files/pages/UserFilesPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: WelcomePage,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/registration",
      name: "Registration",
      component: RegistrationPage,
    },
    {
      path: "/public",
      name: "Public",
      component: PublicFilesPage,
    },
    {
      path: "/user",
      name: "User",
      component: UserFilesPage,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

const protectedRoutes = ["User", "Public"];

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem("accessToken");

  if (
    typeof to.name === "string" &&
    protectedRoutes.includes(to.name) &&
    !accessToken
  ) {
    return next("/");
  }

  next();
});

export default router;
