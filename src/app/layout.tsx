import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ThemeProvider } from "@/shared/components/provider/theme-provider";
import { Toaster } from "sonner";
import { ASSETS } from "@/shared/constants/assets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFlow | Developer Questions, Answers & Insights",
  description:
    "DevFlow helps developers find solutions quickly. Ask programming questions, share expertise, and learn from a global dev community.",
  icons: {
    icon: ASSETS.LOGO.SRC,
  },
  openGraph: {
    title: "DevFlow | Developer Questions, Answers & Insights",
    description:
      "DevFlow helps developers find solutions quickly. Ask programming questions, share expertise, and learn from a global dev community.",
    images: [
      {
        url: ASSETS.LOGO.SRC,
        alt: ASSETS.LOGO.ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFlow | Developer Questions, Answers & Insights",
    description:
      "DevFlow helps developers find solutions quickly. Ask programming questions, share expertise, and learn from a global dev community.",
    images: [
      {
        url: ASSETS.LOGO.SRC,
        alt: ASSETS.LOGO.ALT,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
