import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../lib/prismadb";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  try {
    const data = await req.json();

    const callToActions = await prisma.callToAction.createMany({
      data,
    });

    if (!callToActions) {
      return NextResponse.json({ data: null, message: "Call to actions could not be created.", status: "error" });
    }

    return NextResponse.json({ data: callToActions, message: `Call to actions created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Call to actions Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Call to actions could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
