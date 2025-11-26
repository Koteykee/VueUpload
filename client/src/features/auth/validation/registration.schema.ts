import * as yup from "yup";

export const registrationSchema = yup.object({
  email: yup.string().email().required("Введите логин"),
  password: yup.string().min(4, "Минимум 4 символа").required("Введите пароль"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли не совпадают")
    .required("Подтвердите пароль"),
});

export type RegistrationSchemaType = yup.InferType<typeof registrationSchema>;
