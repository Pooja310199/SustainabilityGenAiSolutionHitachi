import "./globals.css";

export const metadata = { title: "Sustainability Search Tool" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
