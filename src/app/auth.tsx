"use client";

import { signIn, signOut } from "next-auth/react";
import { trpc } from "~/lib/trpc-client";

export function LoginButton() {
  return <button onClick={() => signIn()}>Sign in</button>;
}

export function LogoutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}

export function FetchButton() {
  async function doFetch() {
    const res = fetch("http://localhost:3000/api/test", {
      next: {
        revalidate: 0.1,
      },
      credentials: "include",
    });

    const message = await trpc.example.getSecretMessage.query();
    console.log(message);
  }

  return <button onClick={() => doFetch()}>Fetch</button>;
}
