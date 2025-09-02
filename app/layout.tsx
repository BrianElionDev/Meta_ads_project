import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/ui/Header";
import BackgroundSpeckles from "../components/ui/BackgroundSpeckles";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meta Ads Automation",
  description: "Onboarding & Dashboard for Meta Ads Automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gray-900 relative overflow-x-hidden`}
      >
        <Providers>
          <BackgroundSpeckles />
          <Header />
          <main className="relative z-10 p-8 max-w-6xl mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
