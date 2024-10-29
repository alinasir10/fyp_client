import React from 'react';
import { MessageSquare, Users, Settings } from 'lucide-react';

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
      <nav className="flex h-16">
        <a
          href="/messages"
          className="flex-1 flex flex-col items-center justify-center gap-1"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Messages</span>
        </a>
        <a
          href="/contacts"
          className="flex-1 flex flex-col items-center justify-center gap-1"
        >
          <Users className="h-5 w-5" />
          <span className="text-xs">Contacts</span>
        </a>
        <a
          href="/settings"
          className="flex-1 flex flex-col items-center justify-center gap-1"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </a>
      </nav>
    </div>
  );
}