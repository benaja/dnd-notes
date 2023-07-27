import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import User from "../user";
import { FetchButton, LoginButton, LogoutButton } from "../auth";
import { trpc } from "~/lib/trpc-client";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // console.log((await res).json());

  // const res = await trpc.example.getSecretMessage.query();

  // console.log(res);
  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <FetchButton />
      <h1 className=" text-2xl">Next.js + TypeScript + Tailwind CSS</h1>

      <p className="whitespace-break-spaces">{JSON.stringify(session)}</p>

      <User />
    </div>
  );
}
