import { getBudgets } from "@/actions/budgets/get-budgets";
import { Budget } from "@/generated/prisma/client";
import { PaginatedResponseType } from "@/schemas/pagination";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

export const useBudgets = (result: PaginatedResponseType<Budget>) => {
  const [page] = useQueryState("page", { defaultValue: "1" });
  const [filter] = useQueryState("filter", { defaultValue: "all" });

  return useQuery({
    queryKey: ["budgets", page, filter],
    queryFn: () => getBudgets({ take: 8, page: +page, filter: filter as any }),
    initialData: page === "1" && filter === "all" ? { ok: true, result } : undefined,
    staleTime: 1000 * 60 * 5, // Cada 5 minutos
  });
};
