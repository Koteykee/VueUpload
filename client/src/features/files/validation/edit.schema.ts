import * as yup from "yup";

export const editSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(30, "Name is too long")
    .required("This field is required"),

  isPublic: yup.boolean().required("This field is required"),
});

export type EditSchemaType = yup.InferType<typeof editSchema>;
