import superjson from "superjson";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "~/server/root";
import { createTRPCReact } from "@trpc/react-query";

//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
// export const trpc = createTRPCProxyClient<AppRouter>({
//   transformer: superjson,
//   links: [httpBatchLink({ url: "http://localhost:3000/api/trpc" })],
// });

export const trpc = createTRPCReact<AppRouter>();
