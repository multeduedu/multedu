import type { Metadata } from "next";
import { Poppins } from "next/font/google"; 
import "./globals.css";

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
    url: "https://multedu.com.br", // SUBSTITUIR DEPOIS PELO DOMINIO REAL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
