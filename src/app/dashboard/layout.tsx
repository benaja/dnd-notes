"use client";

import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import Icon from "~/components/ui/Icon";
import TopNavigation from "~/components/ui/TopNavigation";
import { Transition } from "react-transition-group";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useState(false);
  const [mousover, setMousover] = useState(false);
  const [persist, setPersist] = useState(false);
  const expanded = persist || mousover;

  const navItems = [
    {
      icon: "dashboard",
      text: "Dashboard",
      link: "/admin-portal",
    },
    {
      icon: "person",
      text: "Kunden",
      link: "/admin-portal/customers",
    },
    // {
    //   icon: 'person_apron',
    //   text: 'Mitarbeiter',
    //   link: '/admin-portal/employees',
    // },
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
    <>
      <TopNavigation persist={persist} setPersist={setPersist}></TopNavigation>
      <nav
        v-if="expanded || !isMobile"
        className={classNames(
          "fixed left-0 top-0 z-30 h-screen overflow-x-hidden bg-white px-4 pt-14 transition-all duration-500 sm:pt-20",
          {
            "w-80": expanded,
            "w-20": !expanded,
          }
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
                    "bg-green-600 text-white": isActive,
                    "text-gray-500 hover:bg-green-600/10": !isActive,
                  }
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
      <div className="flex w-screen pt-14 sm:pt-20">
        <div
          className={classNames(
            {
              "w-80": persist,
              "w-20": !persist,
            },
            "hidden shrink-0 transition-all duration-500 sm:block"
          )}
        ></div>
        <div className="overflow-x-hidden px-6 py-6 sm:px-10 sm:py-8">
          {children}
        </div>
      </div>
    </>
  );
}
