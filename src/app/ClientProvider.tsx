"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session, status } = useSession();

  return <SessionProvider>{children}</SessionProvider>;
}
