import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Cors from "cors";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextRequest, res: NextResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  let contact = await prisma.contact.findFirst({
    where: {
      email,
    },
  });

  return NextResponse.json({
    data: contact,
    status: "success",
  });
}
export async function POST(req: NextRequest, res: NextResponse) {
  await runMiddleware(req, res, cors);

  const body = await req.json();
  let contact = await prisma.contact.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!contact) {
    contact = await prisma.contact.create({
      data: body,
    });
  } else {
    contact = await prisma.contact.update({
      where: {
        email: body.email,
      },
      data: { ...contact, ...body },
    });
  }

  return NextResponse.json({
    data: contact,
    status: "success",
  });
}
