import type { Metadata } from "next";
import { Poppins } from "next/font/google"; 
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LockManagerMonitor } from "@/components/LockManagerMonitor";
import AccessibilityHotkeys from "@/components/AccessibilityHotkeys";
import FloatingAccessibilityButton from "@/components/FloatingAccessibilityButton";
import FontLoader from "@/components/FontLoader";
import { QueryProvider } from "@/components/providers/QueryProvider";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"], 
});

export const metadata: Metadata = {
   title: "MultEdu | Aprender Matemática de Forma Divertida",
  description: "Plataforma educativa para crianças do ensino fundamental. Aprender matemática de forma interativa e divertida!",
  keywords: [
    "MultEdu",
    "Educação Infantil",
    "Matemática",
    "Ensino Fundamental",
    "Aprendizagem Divertida",
    "Plataforma Educativa"
  ],
  authors: [{ name: "Equipe MultEdu" }],
  openGraph: {
    title: "MultEdu | Aprender Matemática de Forma Divertida",
    description: "Plataforma educativa para crianças do ensino fundamental. Aprender matemática de forma interativa e divertida!",
    type: "website",
    locale: "pt_BR",
    url: "https://multedu.com.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Viewport meta for responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <QueryProvider>
          <FontLoader />
          
          <ErrorBoundary>
            <FloatingAccessibilityButton />
            <AccessibilityHotkeys />
            <LockManagerMonitor />
            {children}
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
