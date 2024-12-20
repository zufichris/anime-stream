import { IEpisode } from "@/@types/anime";
import mongoose from "mongoose";

const schema = new mongoose.Schema<IEpisode>(
  {
    title: {
type:String,
required:true
},
    animeId: {
      type: Number,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    stream: String,
    thumbnail: String,
    userId: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

export const EpisodeModel =
  mongoose?.models?.Episode || mongoose.model("Episode", schema);
