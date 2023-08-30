import { PageType, QuestStatus } from "~/jsonTypes";
import { PreviewPage } from "../campaign/characters/ListCharacters";
import CreatePageButton from "../pages/CreatePageButton";
import Link from "next/link";
import { CampaignContext } from "~/pages/app/[campaign]";
import { useContext } from "react";
import { format, parseISO } from "date-fns";
import { trpc } from "~/lib/trpc-client";

export default function QuestList({ quests }: { quests: PreviewPage[] }) {
  const campaign = useContext(CampaignContext);

  const { data } = trpc.page.filter.useQuery({
    campaignId: campaign?.id || "",
    type: [PageType.Quest],
    fields: {
      status: { value: QuestStatus.Completed },
    },
  });

  console.log("data", data);

  return (
    <>
      <div className="mb-4 mt-8 flex items-start justify-between ">
        <p className="text-lg font-bold">Quests</p>
        <CreatePageButton type={PageType.Quest} />
      </div>
      <div>
        {quests?.length === 0 && (
          <p className="font-light text-gray-500">No quests created yet</p>
        )}
        {quests?.map((quest) => (
          <p className="mb-2 p-2 hover:bg-gray-100" key={quest.id}>
            <Link
              href={`/app/${campaign?.id}/pages/${quest.id}`}
              className="block"
            >
              <span className="font-bold">{quest.title}</span>
              {/* <span className="ml-4 font-light">
                {format(
                  parseISO(
                    quest.previewFields.find((f) => f.name === "date")?.value ||
                      new Date().toISOString(),
                  ),
                  "dd.MM.yyyy",
                )}
              </span> */}
            </Link>
          </p>
        ))}
      </div>
    </>
  );
}
