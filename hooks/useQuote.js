// Fetch quote query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuote } from "../api";

export const useQuote = () => {
  return useQuery({
    queryKey: ["quote"],
    queryFn: getQuote,
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
