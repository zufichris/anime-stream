"use server";
import { UploadedFileData } from "uploadthing/types";
import { IEpisode } from "@/@types/anime";
import { connectDb } from "../db/db";
import { EpisodeModel } from "../models/Episode";
import { EpisodeRepository } from "../repository/EpisodeRepository";

export async function storeFiles(
  files: UploadedFileData[],
  animeId: number,
  userName?: string
) {
  try {
    const data = files.map((file, i) => ({
      animeId,
      title: `Episode ${i + 1}-${file.name}`,
      userId: userName,
      stream: file.url,
      number: i + 1,
    })) as IEpisode[];

    await connectDb();
    const saved = await new EpisodeRepository(EpisodeModel).save(data);
    return saved;
  } catch (error) {
    throw error;
  }
}
export async function getEpisodes(
  animeId: number,
  {
    limit,
    page,
  }: {
    limit?: number;
    page?: number;
  }
): Promise<{ total: number; episodes: IEpisode[] } | null> {
  try {
    await connectDb();
    const result = await new EpisodeRepository(EpisodeModel).find(animeId, {
      limit: limit ?? 10,
      page: page ?? 1,
    });
    return result;
  } catch (error) {
    throw error;
  }
}
