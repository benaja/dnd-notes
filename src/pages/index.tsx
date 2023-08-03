import { useSession } from "next-auth/react";
import { FetchButton, LoginButton, LogoutButton } from "~/app1/auth";

export default function Page() {
  const session = useSession();

  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <FetchButton />

      <h1 className=" text-2xl">Next.js + TypeScript + Tailwind CSS</h1>

      <pre>{JSON.stringify(session.data)}</pre>

      {/* <User /> */}
    </div>
  );
}
