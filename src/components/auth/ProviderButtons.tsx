"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function ProviderButtons() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <>
      <button
        className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
        onClick={() => signIn("google", { callbackUrl: callbackUrl })}
      >
        Google
      </button>
    </>
  );
}
