"use client";

import { signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { trpc } from "~/lib/trpc-client";

export function LoginButton() {
  return <button onClick={() => signIn()}>Sign in</button>;
}

export function LogoutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}

export function FetchButton() {
  const secretMessageQuery = trpc.example.getSecretMessage.useQuery();

  async function doFetch() {
    const res = fetch("http://localhost:3000/api/test", {
      next: {
        revalidate: 0.1,
      },
      credentials: "include",
    });
  }

  useEffect(() => {
    console.log("secretMessageQuery.data", secretMessageQuery.data);
  }, [secretMessageQuery.data]);


  return <button onClick={() => doFetch()}>Fetch</button>;
}
