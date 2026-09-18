import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // <-- এই লাইনটাই মেইন!

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Workforce Analytics Platform',
  description: 'Employee Performance and Attendance Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}