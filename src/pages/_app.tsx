import "~/assets/globals.css";
import "@uploadthing/react/styles.css";

import type { AppProps, AppType } from "next/app";
import { trpc } from "~/lib/trpc-client";
import { SessionProvider } from "next-auth/react";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import "~/components/lexical-editor/themes/styles.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
