import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import PrelineScript from "@/components/PrelineScript";
import { Vina_Sans } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const vinaSans = Vina_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vina-sans'
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Revivo",
  description: "car scrapping platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${vinaSans.variable}`}>
        <PrelineScript />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
