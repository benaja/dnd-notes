import { signIn, useSession } from "next-auth/react";
import logo from "~/assets/images/rpg_notes_logo.png";
import headerImage from "~/assets/images/wallpaper_1.jpg";
import Image from "next/image";
import Link from "next/link";
import AppContainer from "~/components/ui/AppContainer";
import { Button } from "~/components/ui/button";

export default function Page() {
  const session = useSession();

  return (
    <div>
      <nav className="fixed w-full ">
        <AppContainer className="flex h-20 items-center">
          <Link href="/admin-portal" className="flex items-center gap-4">
            <Image src={logo} alt="logo" className="h-8 w-8" />
            <span className="hidden font-medium tracking-widest sm:inline">
              RPG Notes
            </span>
          </Link>

          <div className="flex-grow" />
          <Button
            onClick={() =>
              signIn(undefined, {
                callbackUrl: "/app",
              })
            }
          >
            Login
          </Button>
        </AppContainer>
      </nav>
      {/* <div className="h-20" /> */}
      <Image
        src={headerImage}
        className="h-96 w-full object-cover"
        alt="Hero image"
      />
      <AppContainer className="pt-20">
        <h1 className="text-center text-6xl font-bold">
          Keep your RPG Notes organisied
        </h1>
        <h2 className="mt-8 text-center text-3xl">
          Simple and easy notes app for your TRPG Game.
        </h2>

        <div className="mt-8 flex justify-center">
          <Button className="" asChild>
            <Link href="/app">Get started</Link>
          </Button>
        </div>

        <div className="mx-auto mt-16 max-w-xl bg-primary/20 p-8">
          <h3 className="font-bold">Beta</h3>
          <p>
            This app is currently in beta. The app is not feature complete and
            there will probably still occure bugs from time to time.
          </p>
        </div>
      </AppContainer>
      {/* <LoginButton />
      <LogoutButton />
      <FetchButton />

      <h1 className=" text-2xl">Next.js + TypeScript + Tailwind CSS</h1>

      <pre>{JSON.stringify(session.data)}</pre> */}

      {/* <User /> */}
    </div>
  );
}
