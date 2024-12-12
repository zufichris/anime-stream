import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();
export const ourFileRouter = {
  imageUploader: f({
    video: { maxFileSize: "1GB", maxFileCount: 1000 },
  }).onUploadComplete(async ({ file }) => {
    return file;
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
