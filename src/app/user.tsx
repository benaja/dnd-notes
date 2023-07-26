"use client";

import { useSession } from "next-auth/react";

export default function User() {
  const session = useSession();

  return (
    <div>
      <h1 className=" text-2xl">Clinet</h1>

      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}
