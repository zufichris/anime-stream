import axios from "axios";

export const ApiClient = (config?: {
  to?: "/" | "anime-list";
  type?: "json" | "html" | "gzip" | "form-data";
}) => {
  const baseURL =
    config?.to === "anime-list" ? "https://graphql.anilist.co" : "/";
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": `application/${config?.type ?? "json"}`,
    },
  });
};
