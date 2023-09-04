import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import Icon from "~/components/ui/Icon";
import TopNavigation from "~/components/layouts/navigation/TopNavigation";
import { Transition } from "react-transition-group";
import { useRouter } from "next/router";
import { trpc } from "~/lib/trpc-client";
import { CampaignContext } from "~/pages/app/[campaign]";
import { PageType } from "~/jsonTypes";

export function getIconForPage(page: PageType) {
  switch (page) {
    case PageType.Session:
      return "calendar_month";
    case PageType.Player:
      return "group";
    case PageType.NPC:
      return "groups";
    case PageType.Quest:
      return "task_alt";
    case PageType.Location:
      return "map";
  }
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [mousover, setMousover] = useState(false);
  const [persist, setPersist] = useState(false);
  const expanded = persist || mousover;
  const router = useRouter();

  const { data: campaign } = trpc.campaign.getById.useQuery(
    router.query.campaign as string,
  );

  const basePath = `/app/${campaign?.id}`;

  const navItems = [
    {
      icon: "dashboard",
      text: "Overview",
      link: basePath,
    },
    {
      icon: getIconForPage(PageType.Session),
      text: "Sessions",
      link: `${basePath}/pages?type=${PageType.Session}`,
    },
    {
      icon: getIconForPage(PageType.Player),
      text: "Players",
      link: `${basePath}/pages?type=${PageType.Player}`,
    },
    {
      icon: getIconForPage(PageType.NPC),
      text: "NPCs",
      link: `${basePath}/pages?type=${PageType.NPC}`,
    },
    {
      icon: getIconForPage(PageType.Quest),
      text: "Quests",
      link: `${basePath}/pages?type=${PageType.Quest}`,
    },
    {
      icon: getIconForPage(PageType.Location),
      text: "Locations",
      link: `${basePath}/pages?type=${PageType.Location}`,
    },
  ];

  const defaultStyle = {
    transition: `opacity 500ms ease`,
    opacity: 0,
  };

  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 },
  };

  return (
    <CampaignContext.Provider value={campaign || null}>
      <TopNavigation persist={persist} setPersist={setPersist}></TopNavigation>
      {campaign && (
        <nav
          v-if="expanded || !isMobile"
          className={classNames(
            "fixed left-0 top-0 z-30 h-screen overflow-x-hidden bg-white px-4 pt-14 transition-all duration-500 sm:pt-20",
            {
              "w-80": expanded,
              "w-20": !expanded,
            },
          )}
          onMouseOver={() => setMousover(true)}
          onMouseLeave={() => setMousover(false)}
          onFocus={() => setMousover(true)}
          onBlur={() => setMousover(false)}
        >
          <ul className="mt-4 space-y-4">
            {navItems.map((item) => (
              <li key={item.text}>
                <Link
                  v-slot="{ href, isActive, navigate }"
                  href={item.link}
                  className={classNames(
                    "flex items-center gap-x-4 rounded p-3 font-medium",
                    {
                      "bg-primary text-white": isActive,
                      "text-gray-500 hover:bg-primary/10": !isActive,
                    },
                  )}
                >
                  <Icon className={classNames({ "text-gray-700": !isActive })}>
                    {item.icon}
                  </Icon>
                  <Transition in={expanded} timeout={0}>
                    {(state: string) => (
                      <span
                        style={{
                          ...defaultStyle,
                          ...transitionStyles[
                            state as keyof typeof transitionStyles
                          ],
                        }}
                        className="text-gray-700"
                      >
                        {item.text}
                      </span>
                    )}
                  </Transition>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div
        className={classNames(
          "min-h-screen bg-gray-50 px-4 pt-20 transition-all duration-500 sm:pt-24 md:px-10",
          {
            "ml-20": !expanded && campaign,
            "ml-80": expanded && campaign,
          },
        )}
      >
        {children}
      </div>
    </CampaignContext.Provider>
  );
}
