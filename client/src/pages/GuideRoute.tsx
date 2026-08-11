import { COOKIE_NAME } from "@shared/const";
import { useQueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import Guide from "./Guide";

export default function GuideRoute() {
  const queryClient = useQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          headers() {
            try {
              const raw = sessionStorage.getItem("manus-cookie");

              if (!raw) {
                return {};
              }

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
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <Guide />
    </trpc.Provider>
  );
}
