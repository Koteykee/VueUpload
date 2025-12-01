import { ref } from "vue";
import { defineStore } from "pinia";
import {
  getPublicFilePreview,
  getPublicFiles,
  getUserFiles,
} from "@/api/file.api";

export interface IFile {
  _id: string;
  user: string;
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  isPublic: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export const useFileStore = defineStore("file", () => {
  const file = ref<IFile | null>(null);

  const fetchPublicFiles = async () => {
    try {
      const data = await getPublicFiles();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserFiles = async () => {
    try {
      const data = await getUserFiles();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPublicFilePreview = async (id: string) => {
    try {
      const data = await getPublicFilePreview(id);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  return { file, fetchPublicFiles, fetchUserFiles, fetchPublicFilePreview };
});
