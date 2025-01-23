import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/Providers/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GidiGo - Your Ride, Your Way",
  description: "Experience the future of urban mobility with GidiGo. Quick rides, reliable drivers, and seamless payments - all in one app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
