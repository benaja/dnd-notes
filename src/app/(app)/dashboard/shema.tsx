import { z } from "zod";

export const campaignSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(255),
  description: z.string().optional().nullable(),
});

export enum CharacterType {
  Player = "player",
  NPC = "npc",
}

export const characterSchema = z.object({
  id: z.string().optional(),
  name: z.string().max(255),
  description: z.string().optional().nullable(),
  campaignId: z.string(),
  type: z.nativeEnum(CharacterType),
});
