import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import logo from "~/assets/images/rpg_notes_logo.png";
import Icon from "../../ui/Icon";
import ProfilePopup from "./ProfilePopup";

export default function TopNavigation({
  persist,
  setPersist,
}: {
  persist?: boolean;
  setPersist: (persist: boolean) => void;
}) {
  return (
    <>
      <div className="fixed left-0 top-0 z-40 flex h-14 w-full items-center justify-between bg-white sm:h-20">
        <div className="flex h-full flex-row-reverse items-center justify-end gap-x-4 px-4 sm:w-80 sm:flex-row sm:justify-between">
          <Link href="/app" className="flex items-center gap-4">
            <Image src={logo} alt="logo" className="h-8 w-8" />
            <span className="hidden font-medium tracking-widest sm:inline">
              RPG Notes
            </span>
          </Link>
          <button
            v-if="!props.hideMenu"
            type="submit"
            className="p-2"
            onClick={() => setPersist(!persist)}
          >
            <Icon>{persist ? "menu_open" : "menu"}</Icon>
          </button>
        </div>

        <div className="flex items-center gap-6 pr-4">
          <ProfilePopup />
        </div>
      </div>
    </>
  );
}
