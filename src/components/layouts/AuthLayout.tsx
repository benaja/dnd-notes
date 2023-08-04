import Image from "next/image";
import wallpaper from "~/assets/images/login_wallpaper.jpg";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <main className="flex h-screen w-full items-center justify-center lg:w-1/2">
        <div className="w-[28rem] max-w-full p-4">{children}</div>
      </main>

      <div className="w-ful relative hidden md:block lg:w-1/2">
        <Image
          src={wallpaper}
          alt="Signin"
          className="h-full w-full object-cover"
        />

        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-black/60 to-black/20">
          <div className="absolute bottom-0 left-0 w-full p-12 lg:p-20 ">
            <h2 className="text-6xl tracking-wide text-white">
              Start your Adventure
            </h2>
            <h3 className="text-4xl tracking-wide text-white">
              and keep track of everything
            </h3>

            <h3 className="mt-20 text-xl font-medium uppercase tracking-widest text-white">
              The RPG Notes taking App you ever wanted
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
