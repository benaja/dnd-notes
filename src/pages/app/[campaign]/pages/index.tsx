import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import TextInput from "~/components/fields/inputs/TextInput";
import AppLayout from "~/components/layouts/AppLayout";
import CreatePageButton from "~/components/pages/CreatePageButton";
import { pageTypeTitle } from "~/components/pages/CreatePageModal";
import Icon from "~/components/ui/Icon";
import { PageType } from "~/jsonTypes";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";

const Page: NextPageWithLayout = function Page() {
  const router = useRouter();
  const pageType = router.query.type as PageType;
  const [searchString, setSearchString] = useState("");
  const { data: pages } = trpc.page.filter.useQuery({
    campaignId: router.query.campaign as string,
    type: [pageType],
    title: searchString,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">{pageTypeTitle(pageType)}s</h1>

        <CreatePageButton type={pageType} openAfterCreate />
      </div>
      <div className="mt-4 flex gap-4 rounded bg-white px-2 py-2 text-gray-400">
        <Icon>search</Icon>
        <input
          placeholder="Search"
          className="grow text-gray-700 placeholder:text-gray-400 focus-visible:outline-none"
          onInput={(e) => setSearchString(e.currentTarget.value)}
        ></input>
      </div>
      <div className="mt-4 space-y-4">
        {pages?.map((page) => (
          <Link
            href={`/app/${router.query.campaign}/pages/${page.id}`}
            className="flex justify-between rounded-md bg-white p-4 hover:bg-gray-100"
            key={page.id}
          >
            <span>{page.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
