import EditableText from "~/components/fiels/EditableText";
import QuillInput from "~/components/fiels/RichtTextInput";
import prisma from "~/lib/prisma";
import { trpc } from "~/lib/trpc-client";

export default function Campaign({
  params,
}: {
  params: {
    campaign: string;
  };
}) {
  // const campaign = await prisma.campaign.findUnique({
  //   where: {
  //     id: params.campaign,
  //   },
  // });
  const campaign = {
    id: "1",
    title: "hello",
    description: "world",
  };
  if (!campaign) {
    return <div>Not found</div>;
  }

  return (
    <div>
      <EditableText
        value={campaign.title}
        className="text-3xl"
        onInput={(value) => {
          console.log(value);
        }}
      >
        {({ value, ...props }) => {
          return <h1 {...props}>{value}</h1>;
        }}
      </EditableText>
      <div className="my-4">
        <EditableText value={campaign.description} />
      </div>

      <QuillInput />
      {/* <RichtTextInput /> */}
    </div>
  );
}
