import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "app/Providers";
import "app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3 Transaction Manager",
  description: "Send transactions",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
