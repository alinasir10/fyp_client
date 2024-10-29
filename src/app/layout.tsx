'use client';

import React from "react";
import "./globals.css";

import localFont from "next/font/local";

import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import { UserProvider } from '@/providers/userProvider'
import Sidebar from '@/components/layout/sidebar/sidebar'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Sidebar>
            {children}
          </Sidebar>
        </UserProvider>
      </QueryClientProvider>
      <Toaster/>
      </body>
    </html>
);
}
