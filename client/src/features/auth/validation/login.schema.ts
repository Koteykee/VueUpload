import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email().required("Введите email"),
  password: yup.string().required("Введите пароль"),
});

export type LoginSchemaType = yup.InferType<typeof loginSchema>;
