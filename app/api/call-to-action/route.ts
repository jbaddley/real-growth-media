import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../lib/prismadb";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const callToAction = await prisma.callToAction.findMany();

    if (!callToAction) {
      return NextResponse.json({ data: null, message: "Call to action could not be found.", status: "error" });
    }

    return NextResponse.json({ data: callToAction, message: `Call to action found successfully.`, status: "ok" });
  } catch (e) {
    console.error("Call to action fetch Error", e);
    return NextResponse.json({ data: null, message: "Call to action could not be found.", status: "error" });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  try {
    const data = await req.json();

    const callToAction = await prisma.callToAction.create({
      data,
    });

    if (!callToAction) {
      return NextResponse.json({ data: null, message: "Call to action could not be created.", status: "error" });
    }

    return NextResponse.json({ data: callToAction, message: `Call to action created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Call to action Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Call to action could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
