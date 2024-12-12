import { IEpisode } from "@/@types/anime";
import mongoose from "mongoose";

const schema = new mongoose.Schema<IEpisode>(
  {
    title: String,
    animeId: {
      type: Number,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    id: mongoose.Schema.Types.ObjectId,
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
