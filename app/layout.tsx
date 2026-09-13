import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { inter } from "./fonts";
import AppThemeProvider from "@/components/AppThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shirtify",
  description: "Customize your tshirts with your personality and creativity.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{ variables: { colorPrimary: "#F50056" } }}
      signInFallbackRedirectUrl={"/"}
      signUpFallbackRedirectUrl={"/"}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <AppThemeProvider>{children}</AppThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
