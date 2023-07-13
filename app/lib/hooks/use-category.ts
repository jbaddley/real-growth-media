import { Category } from "@prisma/client";
import useSWR from "swr";
import { Fetcher } from "../fetcher";

export function useCategories() {
  const { data, ...rest } = useSWR("/api/category", (path) => Fetcher.get<Category[]>(path));

  return {
    categories: data?.data || [],
    ...rest,
  };
}

export function useCategory(id: string) {
  const { data, ...rest } = useSWR(`/api/category/${id}`, (path) => Fetcher.get<Category>(path));

  return {
    category: data?.data,
    ...rest,
  };
}
