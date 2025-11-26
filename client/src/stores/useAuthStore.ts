import { ref } from "vue";
import { defineStore } from "pinia";
import { loginUser, registerUser } from "@/api/auth.api";
import type { LoginSchemaType } from "@/features/auth/validation/login.schema";
import { jwtDecode } from "jwt-decode";
import type { RegistrationSchemaType } from "@/features/auth/validation/registration.schema";

export interface DecodedToken {
  email: string;
  userId: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<DecodedToken | null>(null);
  const accessToken = ref<string | null>(localStorage.getItem("accessToken"));

  const decodeToken = (accessToken: string): DecodedToken | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      return { email: decoded.email, userId: decoded.userId };
    } catch (err) {
      console.error("Ошибка при декодировании токена:", err);
      logout();
      return null;
    }
  };

  if (accessToken.value) {
    user.value = decodeToken(accessToken.value);
  }

  const setToken = (token: string) => {
    const decodedToken = decodeToken(token);

    if (!decodedToken) return;

    user.value = decodedToken;
    accessToken.value = token;
    localStorage.setItem("accessToken", token);
  };

  const login = async (values: LoginSchemaType) => {
    const data = await loginUser(values);

    setToken(data.accessToken);
  };

  const register = async (values: RegistrationSchemaType) => {
    const data = await registerUser(values);
    return data;
  };

  const logout = () => {
    user.value = null;
    accessToken.value = null;
    localStorage.removeItem("accessToken");
  };

  return { user, accessToken, decodeToken, setToken, login, register, logout };
});
