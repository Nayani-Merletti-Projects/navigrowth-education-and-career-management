import { Inter } from "next/font/google";
import { AuthProvider } from './context/AuthContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NaviGrowth Education",
  description: "Education and Career Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}