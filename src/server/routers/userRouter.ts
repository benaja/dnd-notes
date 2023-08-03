import { hash } from "bcrypt";
import { z } from "zod";
import prisma from "~/server/prisma";
import { router, publicProcedure, protectedProcedure } from "~/server/trpc";

export const userRouter = router({
  register: publicProcedure
    .input(
      z
        .object({
          name: z.string().min(3),
          email: z.string().email(),
          password: z.string().min(8),
          passwordConfirmation: z.string().min(8),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
          message: "Passwords do not match",
          path: ["passwordConfirmation"],
        })
        .refine(
          async (data) => {
            const user = await prisma.user.findUnique({
              where: {
                email: data.email,
              },
            });
            return !user;
          },
          {
            message: "Email already exists",
            path: ["email"],
          }
        )
    )
    .mutation(async ({ input }) => {
      const hashed_password = await hash(input.password, 10);

      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email.toLowerCase(),
          password: hashed_password,
        },
      });

      return {
        user: {
          name: user.name,
          email: user.email,
        },
      };
    }),
});
