"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  // const { data: session, status } = useSession();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
