import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup.string().min(3, "Минимум 3 символа").required("Введите логин"),
  password: yup.string().min(4, "Минимум 4 символа").required("Введите пароль"),
});
