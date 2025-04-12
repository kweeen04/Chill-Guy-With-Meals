'use client';

import { metadata } from "./metadata";
import { RootLayout } from '@/components/RootLayout'
import { Providers } from "./providers";
import "../styles/globals.css";

export default function Layout({ children }) {

  return (
    <html lang="en" className="mdl-js">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        suppressHydrationWarning
      >
        <Providers>
          <RootLayout>{children}</RootLayout>
        </Providers>
      </body>
    </html>
  );
}