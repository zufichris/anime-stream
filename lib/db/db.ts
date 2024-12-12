import { env } from "@/config/env";
import { staticData } from "@/static";
import mongoose from "mongoose";

let cached: typeof mongoose | null = null;

export async function connectDb() {
  if (cached) {
    return cached;
  }

  if (!env.db_uri) {
    throw new Error("MongoDB URI is not defined");
  }

  try {
    if (mongoose.connection?.readyState === 1) {
      cached = mongoose;
      return cached;
    }

    const conn = await mongoose.connect(env.db_uri, {
      appName: staticData.appName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    cached = conn;
    return cached;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
