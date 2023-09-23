import { hash } from "bcrypt";
import { z } from "zod";
import { prisma } from "~/server/prisma";
import { router, publicProcedure, protectedProcedure } from "~/server/trpc";
import mailer, { sendMail } from "../mailer";
import { addHours } from "date-fns";

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
          },
        ),
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

  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email.toLowerCase(),
        },
      });

      if (!user) {
        return {
          success: true,
        };
      }

      const resetPasswordToken = Math.random().toString(36).slice(2);

      await prisma.passwordResets.create({
        data: {
          token: resetPasswordToken,
          email: input.email,
          expires: addHours(new Date(), 1),
        },
      });

      sendMail({
        to: input.email,
        subject: "RPG Notes - Reset Password",
        templateName: "forgotPassword",
        templateData: {
          logo: `${process.env.APP_URL}/images/rpg_notes_logo.png`,
          name: user.name,
          resetPasswordUrl: `${process.env.APP_URL}/auth/reset-password?token=${resetPasswordToken}&email=${user.email}`,
        },
      });

      return {
        success: true,
      };
    }),

  resetPassword: publicProcedure
    .input(
      z
        .object({
          email: z.string().email(),
          token: z.string(),
          password: z.string().min(8),
          passwordConfirmation: z.string().min(8),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
          message: "Passwords do not match",
          path: ["passwordConfirmation"],
        })
        .refine(
          async (data) => {
            const passwordReset = await prisma.passwordResets.findFirst({
              where: {
                email: data.email,
                token: data.token,
                expires: {
                  gt: new Date(),
                },
              },
            });

            return !!passwordReset;
          },
          {
            message: "Invalid token",
            path: ["token"],
          },
        ),
    )
    .mutation(async ({ input }) => {
      const hashed_password = await hash(input.password, 10);

      await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          password: hashed_password,
        },
      });

      await prisma.passwordResets.deleteMany({
        where: {
          email: input.email,
        },
      });

      return {
        success: true,
      };
    }),
});
