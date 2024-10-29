"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/layout/sidebar/app-sidebar";
import { BottomNav } from "@/components/layout/sidebar/bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {!isMobile && <ChatSidebar className="hidden md:flex" />}
      <SidebarInset>
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
      {isMobile && <BottomNav />}
    </SidebarProvider>
  );
}
