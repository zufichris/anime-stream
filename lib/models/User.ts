import { IUser } from "@/@types/user";
import mongoose from "mongoose";

const schema = new mongoose.Schema<IUser>(
  {
    userName: String,
    id: mongoose.Schema.Types.ObjectId,
    location: String,
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.models.User || mongoose.model("User", schema);
