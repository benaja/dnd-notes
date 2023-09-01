import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { Fields, PageType } from "~/jsonTypes";
import {
  DateField,
  ImageField,
  PageField,
  RichTextField,
  SelectField,
  TextField,
} from "~/lib/form-fields";

export const settingsRouter = router({
  fields: protectedProcedure
    .input(z.nativeEnum(PageType))
    .query(async ({ input, ctx }) => {
      let fields: Fields = [
        new TextField({
          showOnCreate: true,
          showOnPreview: true,
          name: "title",
          label: [PageType.Player, PageType.NPC].includes(input)
            ? "Name"
            : "Title",
        }),
      ];

      switch (input) {
        case PageType.Player:
        case PageType.NPC:
          fields.push(
            new ImageField({
              label: "Avatar",
              name: "avatar",
              showOnCreate: true,
              showOnPreview: true,
              options: {
                type: "round",
              },
            }),
            new TextField({
              label: "Age",
              width: 0.5,
              name: "age",
              options: {
                type: "number",
              },
            }),
            new SelectField({
              label: "Gender",
              name: "gender",
              width: 0.5,
              options: { items: ["Male", "Female", "Unknown"] },
            }),
            new RichTextField({
              label: "Notes",
              name: "notes",
            }),
          );
          break;
        case PageType.Session:
          fields = [
            new TextField({
              name: "title",
              label: "Title",
              className: "sm:w-2/3",
              showOnCreate: true,
              showOnPreview: true,
            }),
            new DateField({
              label: "Date",
              name: "date",
              className: "sm:w-1/3",
              value: new Date(),
              showOnCreate: true,
              showOnPreview: true,
            }),
            new PageField({
              name: "location",
              label: "Location",
              width: 0.5,
            }),
            new RichTextField({
              label: "Description",
              name: "description",
            }),
          ];
          break;
        case PageType.Quest:
          fields.push(
            new SelectField({
              label: "Status",
              name: "status",
              options: { items: ["open", "inProgress", "completed", "onHold"] },
              value: "open",
            }),
          );
          break;
        case PageType.CampaignLandingPage:
          fields.push(
            new RichTextField({
              label: "Notes",
              name: "notes",
            }),
          );
          break;
      }

      // fields = Object.keys(fields).reduce(
      //   (obj, key, index) => ({
      //     ...obj,
      //     [key]: {
      //       ...fields[key],
      //       position: index,
      //     },
      //   }),
      //   {},
      // );

      return fields;
    }),
});
