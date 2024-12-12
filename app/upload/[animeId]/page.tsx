"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/utils/uploadthing";
import { storeFiles } from "@/lib/actions/anime";
import { LocalStore } from "@/utils/localstore";
import { IUser } from "@/@types/user";
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_FILES = 10;
const ALLOWED_TYPES = {
  "video/*": [".mp4", ".mkv", ".avi"],
};

interface UploadPageProps {
  params: {
    animeId: string;
  };
}

export default function UploadPage({ params }: UploadPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate file sizes
    const validFiles = acceptedFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length !== acceptedFiles.length) {
    }

    setFiles((prev) => {
      const newFiles = [...prev, ...validFiles];
      return newFiles.slice(0, MAX_FILES);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_TYPES,
    maxSize: MAX_FILE_SIZE,
  });
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (files) => {
      await storeFiles(
        files,
        Number(params.animeId),
        new LocalStore(window).getItem<IUser>("user")?.userName
      );
      setFiles([]);
    },
    onUploadProgress: (p) => setProgress(p),
    onUploadError: () => {
      alert("error occurred while uploading");
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Upload Episodes</h1>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
          ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div>
            <p className="mb-2">
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB | Allowed
              types: MP4, MKV, AVI
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Selected Files:</h2>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:text-black rounded"
              >
                <span>
                  EP{index + 1}-{file.name} (
                  {(file.size / 1024 / 1024).toFixed(2)}
                  MB)
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isUploading && progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <Button
        onClick={() => startUpload(files)}
        disabled={files.length === 0 || isUploading}
        className="w-full md:w-auto"
      >
        {isUploading ? `Uploading (${progress}%)...` : "Upload Files"}
      </Button>
    </div>
  );
}
