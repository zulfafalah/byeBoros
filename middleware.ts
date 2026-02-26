import { NextResponse } from "next/server";

// All pages are public. Auth is enforced at the API layer.
export function middleware() {
  return NextResponse.next();
}
