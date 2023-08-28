import { CampaignSessions, Session } from "@prisma/client";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import ContentEditor from "~/components/fields/ContentEditor";
import DatePicker from "~/components/fields/DatePicker";
import EditableText from "~/components/fields/EditableText";
import AppLayout from "~/components/layouts/AppLayout";
import { useDebounce } from "~/lib/hooks";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";

const Page: NextPageWithLayout = function Session() {
  const router = useRouter();
  const { data: session } = trpc.session.getById.useQuery(
    router.query.session as string,
  );
  const utils = trpc.useContext();

  const updateSessionMutation = trpc.session.update.useMutation();

  function editSession(key: keyof CampaignSessions, value: any) {
    if (!session) return;
    const newSession = {
      ...session,
      [key]: value,
    };
    utils.session.getById.setData(session.id, newSession);
    updateSession(newSession);
  }

  const updateSession = useDebounce((value: typeof session) => {
    if (!value) return;
    updateSessionMutation.mutate({
      id: value.id,
      title: value.title,
      date: value.date,
      content: value.content.value,
    });
  });

  if (!session) {
    return <></>;
  }

  return (
    <div>
      <div className="flex items-center gap-6">
        <EditableText
          value={session.title}
          className="h-[1em] grow text-3xl"
          onInput={(value) => editSession("title", value)}
        >
          {({ value, ...props }) => {
            return <h1 {...props}>{value}</h1>;
          }}
        </EditableText>

        <DatePicker
          value={session.date}
          onChange={(value) => editSession("date", value)}
        />
      </div>

      {session.content && (
        <div className="mt-8">
          <ContentEditor content={session.content} />
        </div>
      )}
    </div>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;