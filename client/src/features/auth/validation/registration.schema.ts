import * as yup from "yup";

export const registrationSchema = yup.object({
  username: yup.string().min(3, "Минимум 3 символа").required("Введите логин"),
  password: yup.string().min(4, "Минимум 4 символа").required("Введите пароль"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли не совпадают")
    .required("Подтвердите пароль"),
});
