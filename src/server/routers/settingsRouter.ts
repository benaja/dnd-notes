import { Character } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { Fields, FormFieldType, PageType } from "~/jsonTypes";

export const settingsRouter = router({
  fields: protectedProcedure
    .input(z.nativeEnum(PageType))
    .query(async ({ input, ctx }) => {
      let fields: Fields = {};

      switch (input) {
        case PageType.Player:
        case PageType.NPC:
          fields = {
            avatar: {
              type: FormFieldType.Avatar,
              label: "Avatar",
              width: 1,
              value: null,
              showOnCreate: true,
              showOnPreview: true,
            },
            age: {
              type: FormFieldType.Number,
              label: "Age",
              width: 0.5,
              value: null,
            },
            gender: {
              type: FormFieldType.Select,
              label: "Gender",
              width: 0.5,
              options: ["Male", "Female", "Unknown"],
              value: null,
            },
            description: {
              type: FormFieldType.RichText,
              label: "Description",
              width: 1,
              value: null,
            },
          };
          break;
        case PageType.Session:
          fields = {
            date: {
              type: FormFieldType.Date,
              label: "Date",
              width: 0.5,
              value: null,
              showOnCreate: true,
              showOnPreview: true,
            },
            location: {
              type: FormFieldType.String,
              label: "Location",
              width: 0.5,
              value: null,
            },
            description: {
              type: FormFieldType.RichText,
              label: "Description",
              width: 1,
              value: null,
            },
          };
          break;
        case PageType.Quest:
          fields = {
            status: {
              type: FormFieldType.Select,
              label: "Status",
              width: 1,
              options: ["open", "inProgress", "completed", "onHold"],
              value: "open",
            },
          };
          break;
        case PageType.CampaignLandingPage:
          fields = {
            notes: {
              type: FormFieldType.RichText,
              label: "Notes",
              width: 1,
              value: "",
            },
          };
      }

      fields = Object.keys(fields).reduce(
        (obj, key, index) => ({
          ...obj,
          [key]: {
            ...fields[key],
            position: index,
          },
        }),
        {},
      );

      return fields;
    }),
});
