// In lib/env.ts or utils/env.ts
if (!process.env.NEXT_PUBLIC_MongoDB_URI) {
  throw new Error("MongoDB_URI is not defined in environment variables");
}

export const env = {
  db_uri: process.env.NEXT_PUBLIC_MongoDB_URI as string,
} as const;
