import { NextRequest, NextResponse } from "next/server";
import { Fetcher } from "../../../lib/fetcher";

const service =
  "https://services.leadconnectorhq.com/hooks/nrw8M8zQccEYIjAMiR22/webhook-trigger/262a198b-2a47-4132-9451-f2c95bd20b67";

export async function POST(req: NextRequest, res: NextResponse) {
  return Fetcher.post(service, req.body);
}
