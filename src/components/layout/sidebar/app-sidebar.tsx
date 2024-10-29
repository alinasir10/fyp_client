import React from 'react';
import {
  MessageSquare,
  Users,
  Command
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail, SidebarTrigger,
} from '@/components/ui/sidebar';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {TeamSwitcher} from "@/components/layout/sidebar/team-switcher";
import {ScrollArea} from "@/components/ui/scroll-area";

const chatNavItems = [
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    isActive: true,
    items: [
      {
        title: "All Messages",
        url: "/messages/",
      },
      {
        title: "Archived",
        url: "/messages/archived",
      },
    ],
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Users,
    items: [
      {
        title: "All Contacts",
        url: "/contacts/all",
      },
      {
        title: "Favorites",
        url: "/contacts/favorites",
      },
      {
        title: "Blocked",
        url: "/contacts/blocked",
      },
    ],
  },
];

const teamData = [
  {
    name: "Personal",
    logo: Command,
    plan: "Free",
  },
  {
    name: "Professional",
    logo: Command,
    plan: "Pro",
  }
];

export function ChatSidebar({ ...props }) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <div className="flex flex-col items-end gap-2">
          <SidebarTrigger/>
          <TeamSwitcher teams={teamData}/>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <NavMain items={chatNavItems} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}