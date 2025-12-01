import type { IFile } from "@/stores/useFileStore";
import { Api } from "./api";

export const getPublicFiles = async () => {
  const { data } = await Api.get<{ files: IFile[] }>("/files/public");
  return data.files;
};

export const getUserFiles = async () => {
  const { data } = await Api.get<{ files: IFile[] }>("/files/user");
  return data.files;
};

export const getPublicFilePreview = async (id: string) => {
  const { data } = await Api.get<{ files: IFile[] }>(
    `/files/public/preview/${id}`
  );
  return data.files;
};
