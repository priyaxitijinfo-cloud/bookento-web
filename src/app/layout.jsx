import { APP_CONFIG } from "@/config/app.config";
import { poppins } from "@/lib/fonts";
import { AppProviders } from "@/providers/app-providers";

import "@/styles/globals.css";

export const metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  metadataBase: new URL(APP_CONFIG.url),
};

export const viewport = {
  themeColor: "#1865EA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
