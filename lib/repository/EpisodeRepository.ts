import { IEpisode } from "@/@types/anime";
import { EpisodeModel } from "../models/Episode";
import { FilterQuery } from "mongoose";

export class EpisodeRepository {
  constructor(private readonly model: typeof EpisodeModel) {}
  async save(episodes: IEpisode[]): Promise<IEpisode[]> {
    try {
      const saved = await this.model.insertMany(episodes);
      return saved as IEpisode[];
    } catch (error) {
      throw error;
    }
  }
  async count(filter?: FilterQuery<unknown>): Promise<number> {
    try {
      const count = await this.model.countDocuments(filter);
      return count;
    } catch (error) {
      throw error;
    }
  }
  async find(
    animeId: number,
    {
      limit,
      page,
    }: {
      limit: number;
      page: number;
    }
  ): Promise<{ total: number; episodes: IEpisode[] } | null> {
    try {
      const skip = (page - 1) * limit;
      const episodes = await this.model.find({ animeId }, undefined, {
        limit,
        skip,
      });
      const total = await this.count({ animeId });
      return { total, episodes };
    } catch (error) {
      throw error;
    }
  }
}
