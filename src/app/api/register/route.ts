import prisma from "~/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  const shema = z
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
    );

  type Data = z.infer<typeof shema>;

  const data = await shema.safeParseAsync((await req.json()) as Data);

  if (!data.success) {
    return new NextResponse(
      JSON.stringify({
        status: "validation-error",
        issues: data.error.issues,
        message: "Validation error",
      }),
      { status: 400 }
    );
  }

  const hashed_password = await hash(data.data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.data.name,
      email: data.data.email.toLowerCase(),
      password: hashed_password,
    },
  });

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
    },
  });
  // } catch (error: any) {
  //   return new NextResponse(
  //     {
  //       status: "error",
  //       message: error.message,
  //     },
  //     { status: 500 }
  //   );
  // }
}
