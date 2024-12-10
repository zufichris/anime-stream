import { ApiClient } from "@/config/axios";

export async function uploadFiles(files: File[], animeId: string) {
  const formData = new FormData();

  // Append all files to FormData
  files.forEach((file) => {
    formData.append("files", file);
  });
  console.log(formData.get("files"));
  // Now `animeId` is used directly in the path
  const response = await ApiClient({
    to: "/", // Specify the base path if necessary
  }).post(`/upload/${animeId}/`, formData);

  if (!response) {
    throw new Error("Upload failed");
  }

  return response;
}
