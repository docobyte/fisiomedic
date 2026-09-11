import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FISIOMEDIC — SIMRS & EMR Klinik Fisioterapi Indonesia",
  description:
    "Sistem Informasi Manajemen Klinik & Praktik Mandiri Fisioterapi Indonesia terintegrasi SatuSehat Kemenkes RI, SOAP Assessment, VAS Pain Scale, dan Goniometri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#07090d] text-slate-100 antialiased selection:bg-teal-500/20 selection:text-teal-300">
        {children}
      </body>
    </html>
  );
}
