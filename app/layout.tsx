import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ScrollWatcher from "@/components/ScrollWatcher";
import { Toaster } from 'react-hot-toast';
import { Inter } from "next/font/google";
import  Menu  from "@/components/Menu";
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Cinemax",
  description: "Aplicação para gerenciamento de cinemas",
  icons: {
    icon: "/logo.png",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="h-full flex flex-col" style={{ fontFamily: inter.style.fontFamily }}>
        <Providers>
          <ScrollWatcher />
          <Menu />
          <main className="flex-grow container mx-auto pt-20">
            {children}
          </main>
          <Toaster position="top-center" toastOptions={{ duration: 2000}} />
        </Providers>
      </body>
    </html>
  );
}