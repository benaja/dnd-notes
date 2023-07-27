"use client";

import { useSession } from "next-auth/react";

export default function User() {
  const session = useSession();

  return (
    <div>
      <h1 className=" text-2xl">Clinet</h1>

      <p className="whitespace-break-spaces">{JSON.stringify(session)}</p>
    </div>
  );
}
