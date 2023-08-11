import { Magic } from "@magic-sdk/admin";
import { NextResponse } from "next/server";
let mAdmin = new Magic(process.env.MAGIC_SECRET_KEY);

export async function POST(req: Request, res) {
  try {
    // Grab the DID token from our headers and parse it
    const auth = req.headers.get("authorization");
    console.log({ auth });
    const didToken = mAdmin.utils.parseAuthorizationHeader(auth);
    // Validate the token and send back a successful response
    mAdmin.token.validate(didToken);
    return NextResponse.json({ authenticated: true, message: "You are now logged in.", status: "success" });
  } catch (error) {
    return NextResponse.json({ authenticated: false, message: error, status: "error" });
  }
}
