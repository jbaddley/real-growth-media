import { headers } from "next/headers";
import { env } from "process";

export default function getHostname() {
  const headersList = headers();
  const referer = headersList.get("referer");
  let hostname = "";
  if (env.NODE_ENV === "development") {
    hostname = env.PRODUCTION_BASE_URL;
  } else {
    const url = new URL(referer);
    hostname = url.hostname;
  }
  console.log({ hostname });
  return hostname;
}
