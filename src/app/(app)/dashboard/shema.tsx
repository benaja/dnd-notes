import { z } from "zod";

export const campaignSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
});
