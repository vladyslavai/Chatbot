import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KI-Karriereberater | Stadtpolizei Zürich",
  description: "Entdecken Sie Ihre ideale Laufbahn bei der Stadtpolizei Zürich mit unserem intelligenten Karriereberater.",
  keywords: "Karriere, Polizei, Zürich, Stadtpolizei, Beruf, KI, Karriereberatung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
