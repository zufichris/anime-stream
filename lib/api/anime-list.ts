import { IAnime, IAnimeList, IEpisode } from "@/@types/anime";
import { ApiClient } from "@/config/axios";

class AniListAdapter {
  private readonly apiClient = ApiClient({
    to: "anime-list",
    type: "json",
  });

  constructor(
    private readonly queryObj: {
      limit?: number;
      sort?: "TRENDING_DESC" | "POPULARITY_DESC" | "START_DATE_DESC";
      title?: boolean;
      coverImage?: "large" | "medium";
      description?: boolean;
      search?: string;
      id?: string | number;
    } = {}
  ) {
    this.queryObj = {
      limit: 10,
      sort: "TRENDING_DESC",
      coverImage: "large",
      title: true,
      description: false,
      ...queryObj,
    };
  }

  async getAnimeList(query?: typeof this.queryObj) {
    try {
      const qObj = this.generateQuery({
        ...this.queryObj,
        ...(query ?? {}),
      });

      const res = await this.apiClient.post(
        "/",
        JSON.stringify({
          query: qObj,
        })
      );
      const page = res.data.data.Page;
      const animeList = this.mapper(page);
      return animeList;
    } catch (error: unknown) {
      console.error(`Error fetching anime:`, error);
    }
  }
  async search(search: string): Promise<IAnime[]> {
    try {
      if (search?.length < 1) return [];
      const result = await this.getAnimeList({
        search,
      });
      return result!.list ?? [];
    } catch (error) {
      console.error("Error during search:", error);
      throw error;
    }
  }
  async getById(id: number): Promise<IAnime> {
    try {
      const result = await this.getAnimeList({
        id,
        coverImage: "large",
        description: true,
      });
      return result!.list[0] ?? [];
    } catch (error) {
      console.error("Error during search:", error);
      throw error;
    }
  }
  async getAnimeEpisodes(id: number): Promise<IEpisode[]> {
    try {
      const query = `query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
          }
          streamingEpisodes {
            title
            thumbnail
            url
            site
          }
        }
      }`;
      const res = await this.apiClient.post("/", {
        query,
        variables: { id },
      });
      const result = res.data.data?.Media?.streamingEpisodes?.map(
        (x: Record<string, string>) => ({
          title: x?.title,
          id: x?.title,
          thumbnail: x?.thumbnail,
        })
      ) as IEpisode[];
      return result;
    } catch (error) {
      console.error("Error fetching episodes:", error);
      throw error;
    }
  }

  private mapper(page: Record<string, unknown>): IAnimeList {
    const result = {
      page: (page?.currentPage as number) ?? 1,
      hasNextPage: page?.hasNextPage as boolean,
      limit: page?.perPage as number,
      list: (
        page?.media as Record<string, unknown | Record<string, unknown>>[]
      )?.map((x) => ({
        id: x.id,
        title:
          (x?.title as Record<string, string>)?.english ??
          (x?.title as Record<string, string>)?.romaji ??
          "N/A",
        imgLg:
          (x?.coverImage as Record<string, string>)?.medium?.replace(
            "medium",
            "large"
          ) ??
          (x?.coverImage as Record<string, string>)?.large?.replace(
            "medium",
            "large"
          ),
        imgMd:
          (x?.coverImage as Record<string, string>)?.medium ??
          (x?.coverImage as Record<string, string>)?.large,
        description: x.description ?? "N?A",
      })) as IAnime[],
    };
    return result;
  }

  private generateQuery(query: typeof this.queryObj): string {
    const mediaArgs = query.id
      ? `id: ${query.id}, type: ANIME`
      : `${query.search ? `search: "${query.search}",` : ""}${
          query.sort ? `sort: ${query.sort},` : ""
        } type: ANIME`;

    return `query {
      Page(perPage: ${query.limit ?? 10}) {
        pageInfo {
          currentPage
          hasNextPage
          perPage
        }
        media(${mediaArgs}) {
          id
          ${query.title ? `title { romaji english }` : ""}
          ${query.coverImage ? `coverImage { large }` : ""}
          ${query.description ? "description" : ""}
        }
      }
    }`;
  }
}

export const aniListAdapter = new AniListAdapter();
