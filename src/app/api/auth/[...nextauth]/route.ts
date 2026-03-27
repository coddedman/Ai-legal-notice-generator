import { handlers } from "@/auth";
import { NextRequest } from "next/server";

const { GET: AuthGET, POST: AuthPOST } = handlers;

export async function GET(req: NextRequest) {
  try {
    return await AuthGET(req);
  } catch (error) {
    console.error("🟢 FATAL HANDLER GET ERROR:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    return await AuthPOST(req);
  } catch (error) {
    console.error("🟢 FATAL HANDLER POST ERROR:", error);
    throw error;
  }
}
