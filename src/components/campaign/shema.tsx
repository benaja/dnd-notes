import { z } from "zod";
import { CharacterType } from "~/jsonTypes";

export const campaignSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(255).min(1, "Campaign title is required"),
  notes: z.string().optional().nullable(),
});

export const characterSchema = z.object({
  id: z.string(),
  name: z.string().max(255).min(1, "Character name is required"),
  campaignId: z.string(),
  type: z.nativeEnum(CharacterType),
  avatar: z.string().optional().nullable(),
  fields: z.record(z.any()),
});
