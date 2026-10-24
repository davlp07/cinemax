import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    const isPublicRoute = pathname === "/" || pathname === "/cliente/login" || pathname === "/cinema/login";
    const isProtectedRoute = pathname.startsWith("/cliente") || pathname.startsWith("/cinema");

    /* ----- Regras para quando usuario NAO estiver LOGADO ----- */
    if (!isLoggedIn) {
        if (isProtectedRoute && !isPublicRoute) {
            return Response.redirect(new URL("/", req.url));
        }
        return; 
    }

    /* ----- Regras para quando usuario estiver LOGADO ----- */
    
    const role = (req.auth?.user as { role: string })?.role || "CLIENTE";

    if (!role && isProtectedRoute && !isPublicRoute) {
        return Response.redirect(new URL("/", req.url)); 
    }

    if (role === "CINEMA_ADMIN") {
        if (pathname === "/cinema/login" || pathname.startsWith("/cliente")) {
            return Response.redirect(new URL("/cinema", req.url));
        }
    } else if (role === "CLIENT") {
        if (pathname === "/cliente/login" || pathname.startsWith("/cinema")) {
            return Response.redirect(new URL("/cliente", req.url));
        }
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};