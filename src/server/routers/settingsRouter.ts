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
      let fields: Fields = [];

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
              className: "sm:w-1/3",
              options: { types: [PageType.Location] },
            }),
            new RichTextField({
              label: "Notes",
              name: "notes",
            }),
          ];
          break;
        case PageType.Quest:
          fields.push(
            new TextField({
              label: "Goal",
              name: "goal",
              options: {
                type: "textarea",
              },
              className: "sm:w-1/2",
            }),
            new TextField({
              label: "Reward",
              name: "reward",
              options: {
                type: "textarea",
              },
              className: "sm:w-1/2",
            }),
            new SelectField({
              label: "Status",
              name: "status",
              options: {
                items: [
                  { value: "open", label: "Open" },
                  { value: "inProgress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                  { value: "onHold", label: "On Hold" },
                ],
              },
              className: "sm:w-1/2",
              value: "open",
              showOnPreview: true,
            }),
            new PageField({
              label: "Given By",
              name: "givenBy",
              className: "sm:w-1/2",
              options: {
                types: [PageType.NPC, PageType.Player],
              },
            }),
            new RichTextField({
              label: "Notes",
              name: "notes",
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
