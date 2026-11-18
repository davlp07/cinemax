"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Menu from "@/components/layout/Menu";

export default function ScrollToTop() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userIdentity = `${session?.user?.id ?? ""}:${session?.user?.role ?? ""}`;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return <Menu key={`${pathname}:${userIdentity}`} />;
}