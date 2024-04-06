import "./globals.css";
import { Inter } from "next/font/google";

import Header from "@/components/Header";
import { SparklesCore } from "@/components/ui/sparkles";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Verve | AI Web Developer",
  description: "Your new Web Buddy",
  creator: "Amaan",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        {children}
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.0}
            particleDensity={70}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
      </body>
    </html>
  );
}
