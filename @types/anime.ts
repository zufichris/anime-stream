export interface IAnime {
  id: number | string;
  title: string;
  imgLg: string;
  imgMd: string;
  description: string;
}
export interface IAnimeList {
  page: number;
  limit: number;
  hasNextPage: boolean;
  list: IAnime[];
}
export interface IEpisode {
  id?: string;
  title: string;
  number: number;
  stream?: string;
  thumbnail?: string;
  userId?: string;
  animeId: number;
}
