import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/Providers/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GidiGo - Your Ride, Your Way",
  description: "Experience the future of urban mobility with GidiGo. Quick rides, reliable drivers - all in one app.",
  icons: {
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
  },
  manifest: '/site.webmanifest',
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
