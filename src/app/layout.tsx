import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Alan Carwash | Autolavado con cita previa",
  description:
    "Reserva tu cita en Alan Carwash. Autolavado profesional con el mejor cuidado para tu vehículo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
