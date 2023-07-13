import { Article } from "@prisma/client";
import useSWR from "swr";
import { Fetcher } from "../fetcher";

export function useArticles(categoryId: string) {
  const { data, ...rest } = useSWR(`/api/category/${categoryId}/article`, (path) => Fetcher.get<Article[]>(path));

  return {
    articles: data?.data || [],
    ...rest,
  };
}

export function useArticle(categoryId: string, id: string) {
  const { data, ...rest } = useSWR(`/api/category/${categoryId}/article/${id}`, (path) => Fetcher.get<Article>(path));

  return {
    article: data?.data,
    ...rest,
  };
}
