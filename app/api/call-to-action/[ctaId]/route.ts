import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../lib/prismadb";

export async function GET(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const callToAction = await prisma.callToAction.findFirst({
      where: {
        id: params.ctaId,
      },
    });

    if (!callToAction) {
      return NextResponse.json({ data: null, message: "Call to action could not be fetched.", status: "error" });
    }

    return NextResponse.json({ data: callToAction, message: `Call to action fetched successfully.`, status: "ok" });
  } catch (e) {
    console.error("Call to action Fetched Error", e);
    return NextResponse.json({ data: null, message: "Call to action could not be fetched.", status: "error" });
  }
}
export async function PUT(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const data = await req.json();
    const callToAction = await prisma.callToAction.update({
      where: {
        id: params.ctaId,
      },
      data,
    });

    if (!callToAction) {
      return NextResponse.json({ data: null, message: "Call to action could not be updated.", status: "error" });
    }

    return NextResponse.json({ data: callToAction, message: `Call to action updated successfully.`, status: "ok" });
  } catch (e) {
    console.error("Call to action Update Error", e);
    return NextResponse.json({ data: null, message: "Call to action could not be updated.", status: "error" });
  }
}

export async function DELETE(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }

  try {
    await prisma.callToAction.delete({
      where: {
        id: params.ctaId,
      },
    });

    return NextResponse.json({ message: `Call to action deleted successfully.`, status: "ok" });
  } catch (e) {
    console.error("Call to action Deleted Error", e);
    return NextResponse.json({ data: null, message: "Call to action could not be deleted.", status: "error" });
  }
}
