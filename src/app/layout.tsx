import type { Metadata } from "next";
import { Poppins } from "next/font/google"; 
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LockManagerMonitor } from "@/components/LockManagerMonitor";
import AccessibilityHotkeys from "@/components/AccessibilityHotkeys";
import FloatingAccessibilityButton from "@/components/FloatingAccessibilityButton";
import VLibrasWidget from "@/components/VLibrasWidget";
import FontLoader from "@/components/FontLoader";

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
        {/* VLibras meta tag para funcionalidade correta */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <FontLoader />
        
        {/* Wrapper para VLibras - Estrutura que o script do VLibras procura */}
        <div {...({ vw: "true" } as any)} className="enabled">
          <div id="vw-plugin-wrapper" className="access-button" style={{ position: 'fixed', zIndex: 9998, bottom: 0, right: 0 }} />
        </div>
        
        <ErrorBoundary>
          <VLibrasWidget />
          <FloatingAccessibilityButton />
          <AccessibilityHotkeys />
          <LockManagerMonitor />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
