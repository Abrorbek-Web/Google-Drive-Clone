import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  console.log("Middleware ishladi:", request.nextUrl.pathname);

  // Agar route public bo‘lsa, himoyadan o‘tish shart emas
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  try {
    // himoya qilinayotgan route uchun Clerk middleware tekshiradi
    const response = await auth.protect();
    // Agar auth.protect() javoban qaytsa (masalan, redirect yoki error), uni qaytaramiz
    if (response) {
      return response;
    }
    // Aks holda, keyingi middleware yoki page ga o‘tish
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware xatosi:", error);
    return new Response("Middleware xatosi", { status: 500 });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
