import { ref } from "vue";
import { defineStore } from "pinia";
import {
  deleteFile,
  downloadFile,
  getPublicFilePreview,
  getPublicFiles,
  getUserFilePreview,
  getUserFiles,
  patchFile,
  uploadFile,
  type PatchFile,
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

export interface UploadedFile {
  message: string;
  file: IFile;
}

export interface PatchedFile {
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
  __v: number;
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

  const fetchUserFilePreview = async (id: string) => {
    try {
      const data = await getUserFilePreview(id);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUploadFile = async (file: File) => {
    try {
      const data = await uploadFile(file);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const saveFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const fetchDownloadFile = async (id: string, filename: string) => {
    try {
      const blob = await downloadFile(id);
      saveFile(blob, filename);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDeleteFile = async (id: string) => {
    try {
      const data = await deleteFile(id);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPatchFile = async (id: string, payload: PatchFile) => {
    try {
      const data = await patchFile(id, payload);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    file,
    fetchPublicFiles,
    fetchUserFiles,
    fetchPublicFilePreview,
    fetchUserFilePreview,
    fetchUploadFile,
    fetchDownloadFile,
    fetchDeleteFile,
    fetchPatchFile,
  };
});
