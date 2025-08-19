import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Daily Discounts Price Checker",
  description: "Internal tool for market price comparison",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="dd-header">
          <div className="dd-container">
            <h1 className="dd-header__title">Daily Discounts — Price Checker</h1>
          </div>
        </header>
        <main className="dd-container" style={{ paddingTop: 16, paddingBottom: 24 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
