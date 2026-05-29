import { QueryClient } from "@tanstack/react-query";

export const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});
