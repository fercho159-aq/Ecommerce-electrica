import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "Eléctrica San Miguel | Material Eléctrico en CDMX",
  description: "Más de 50 años distribuyendo material eléctrico. Cables, iluminación, tableros, herramientas y más. Envío a toda la República.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
