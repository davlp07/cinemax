import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const authSession = req.cookies.get("auth_session")?.value;

    const nextAuthSession = req.cookies.get("authjs.session-token")?.value || req.cookies.get("next-auth.session-token")?.value;

    const isLoggedIn = !!authSession || !!nextAuthSession;
    const { pathname } = req.nextUrl;

    const isProtectedRoute = pathname.startsWith("/cliente") || pathname.startsWith("/admin");
    const isClientLoginRoute = pathname.startsWith("/login/cliente");
    const isAdminLoginRoute = pathname.startsWith("/login/admin");

    // Bloqueia acesso a rotas privadas se deslogado
    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Redireciona usuários já logados que tentarem abrir o /login
    if (isClientLoginRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/cliente", req.url));
    }

    if (isAdminLoginRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};