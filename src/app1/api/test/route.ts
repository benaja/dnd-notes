import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("sesson", session);
  return NextResponse.json({
    message: "Hello world",
  });
}
