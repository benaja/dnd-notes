import { PagePreview } from "~/lib/pages";

export default function QuestListItem({ page }: { page: PagePreview }) {
  console.log(page);
  return (
    <>
      <span>{page.title}</span>
      <span>{page.previewFields.find((f) => f.name === "status")?.value}</span>
    </>
  );
}
