import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "OY VPS — Infrastructure, simplified",
  description: "A focused control plane for reliable VPS infrastructure.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
