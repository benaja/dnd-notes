import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import User from "./user";
import { LoginButton, LogoutButton } from "./auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <h1 className=" text-2xl">Next.js + TypeScript + Tailwind CSS</h1>

      <pre>{JSON.stringify(session)}</pre>

      <User />
    </div>
  );
}
