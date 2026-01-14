"use client"; // Required to use usePathname

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Define paths where the Navbar should NOT appear
  // Your login page is at the root "/"
  const isLoginPage = pathname === "/";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Only render Navbar if we are NOT on the login page */}
        {!isLoginPage && <Navbar />}
        
        {children}
      </body>
    </html>
  );
}


