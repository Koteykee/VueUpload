import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email().required("Enter email"),
  password: yup.string().required("Enter password"),
});

export type LoginSchemaType = yup.InferType<typeof loginSchema>;
