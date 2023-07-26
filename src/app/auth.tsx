"use client";

import { signIn, signOut } from "next-auth/react";

export function LoginButton() {
  return <button onClick={() => signIn()}>Sign in</button>;
}

export function LogoutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
