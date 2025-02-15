import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import AuthProvider from "./auth/Provider";
import ReduxProvider from "./ReduxProvider";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ToastProvider from "./ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link
          rel="stylesheet"
          href="/css/header.css"
          precedence="default"
      />
      <link
          rel="stylesheet"
          href="/css/bootstrap.min.css"
          precedence="default"
      />
      <link rel="stylesheet" href="/css/slick.css" precedence="default" />
      <link
          rel="stylesheet"
          href="/css/slick-theme.css"
          precedence="default"
      />
      <link
          rel="stylesheet"
          href="/css/animatloading.css"
          precedence="default"
      />
      <link
          rel="stylesheet"
          href="/css/header.css"
          precedence="default"
      />
      <link
          rel="stylesheet"
          href="/css/customer-dashboard.css"
          precedence="default"
      />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense>
          <AuthProvider>
            <ReduxProvider>
              <ErrorBoundary>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </ErrorBoundary>
            </ReduxProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
