import { staticData } from "@/static";
import mongoose from "mongoose";

export async function connectDb(uri: string) {
  try {
    if (!uri) throw Error("Invalid DB Uri");
    if (mongoose.connection.readyState) return mongoose.connection;
    else {
      const conn = await mongoose.connect(uri, {
        appName: staticData.appName,
      });
      return conn;
    }
  } catch (error) {
    throw error;
  }
}
