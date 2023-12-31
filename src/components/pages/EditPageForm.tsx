import { Page } from "@prisma/client";
import { trpc } from "~/lib/trpc-client";
import EditableText from "~/components/fields/EditableText";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GenericForm from "~/components/fields/GenericForm";
import FormField from "~/components/fields/FormField";
import { useEffect } from "react";
import useDebounce from "~/lib/hooks/useDebounce";
import { PageFormValues, PageSchema } from "./CreatePageForm";

export default function EditPageForm({
  page,
  hideTitle,
  onChange,
}: {
  page: Page;
  hideTitle?: boolean;
  onChange?: (page: PageFormValues) => void;
}) {
  const updatePageMutation = trpc.page.update.useMutation({
    onSuccess(data) {
      updatePageMutation.reset();
      onChange?.(data);
    },
  });

  const formMethods = useForm({
    defaultValues: {
      ...page,
    },
    resolver: zodResolver(PageSchema),
    mode: "onBlur",
  });

  const onSubmit = useDebounce((page: Page, values: PageFormValues) => {
    updatePageMutation.mutate({
      ...values,
      id: page.id,
      type: page.type,
    });
  });

  useEffect(() => {
    const subscription = formMethods.watch((value) => {
      formMethods.handleSubmit((values: PageFormValues) =>
        onSubmit(page, values),
      )();
    });
    return () => subscription.unsubscribe();
  }, [formMethods, onChange, page, onSubmit]);

  return (
    <>
      <FormProvider {...formMethods}>
        {!hideTitle && (
          <div className="flex items-center gap-8">
            <FormField
              name="title"
              render={(props) => (
                <EditableText {...props} className="grow text-3xl" tag="h1" />
              )}
            />
          </div>
        )}

        <GenericForm
          fields={page.fields}
          attachMentionsTo={{
            source: page,
          }}
        />
      </FormProvider>
      {/* <p>Mentions Campaigns</p>
      {mentions?.campaigns.map((campaign) => (
        <div key={campaign.id}>
          <p>{campaign.title}</p>
        </div>
      ))}

      <p>Mentions Sessions</p>
      {mentions?.sessions.map((sessions) => (
        <div key={sessions.id}>
          <p>{sessions.title}</p>
        </div>
      ))}

      <p>Mentions Characters</p>
      {mentions?.characters.map((characters) => (
        <div key={characters.id}>
          <p>{characters.name}</p>
        </div>
      ))} */}
    </>
  );
}
