import * as yup from "yup";

export const registrationSchema = yup.object({
  email: yup.string().email().required("Enter email"),
  password: yup
    .string()
    .min(4, "Minimum 4 characters")
    .required("Enter password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords don't match")
    .required("Confirm password"),
});

export type RegistrationSchemaType = yup.InferType<typeof registrationSchema>;
