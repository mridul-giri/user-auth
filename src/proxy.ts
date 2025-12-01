import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl;
  if (token && url.pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (
    !token &&
    (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/edit"))
  ) {
    return NextResponse.redirect(new URL("/register", req.url));
  }
}

export const config = {
  matcher: ["/register", "/dashboard", "/edit"],
};
