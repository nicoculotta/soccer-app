import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/authContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Toaster } from "@/components/ui/toaster";

// Can be imported from a shared config
const locales = ["en", "es"];

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Futbol El Palo",
  description: "A jugar",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: Record<string, string>;
}) {
  if (!locales.includes(locale as any)) notFound();
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
