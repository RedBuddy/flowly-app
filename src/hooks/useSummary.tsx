import { getBalanceSummary } from "@/actions/landing/get-balance-summary";
import { useQuery } from "@tanstack/react-query";

export const useGetBalanceSummary = () => {
  return useQuery({
    queryKey: ["balanceSummary"],
    queryFn: () => getBalanceSummary(),
  });
};
