import { IUser } from "@/@types/user";
import mongoose from "mongoose";

const schema = new mongoose.Schema<IUser>(
  {
    userName: {
type:String,
required:[true,"username required to track you down"]
},
    location: {
type:String,
required:[true,"username required to track you down lol"]
},
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.models.User || mongoose.model("User", schema);
