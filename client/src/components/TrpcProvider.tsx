import { COOKIE_NAME } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createContext, useContext, useState, type ReactNode } from "react";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";

const TrpcAvailabilityContext = createContext(false);

export function useHasTrpcProvider() {
  return useContext(TrpcAvailabilityContext);
}

export default function TrpcProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          headers() {
            try {
              const raw = sessionStorage.getItem("manus-cookie");

              if (!raw) return {};

              const prefix = `${COOKIE_NAME}=`;
              const pair = raw
                .split(";")
                .find(value => value.trim().startsWith(prefix));
              const token = pair?.trim().slice(prefix.length);

              return token ? { Authorization: `Bearer ${token}` } : {};
            } catch {
              return {};
            }
          },
          fetch(input, init) {
            return globalThis.fetch(input, {
              ...(init ?? {}),
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <TrpcAvailabilityContext.Provider value>
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          {children}
        </trpc.Provider>
      </QueryClientProvider>
    </TrpcAvailabilityContext.Provider>
  );
}
