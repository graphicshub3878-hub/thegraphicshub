import type { Metadata } from 'next'
import './globals.css'
import MagicWandCursor from '@/app/components/CustomCursor'
import SiteReady from '@/app/components/SiteReady'

export const metadata: Metadata = {
  title: 'Graphics Hub',
  description: 'You dream it, we design it!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Arima:wght@400;700&family=Corinthia&display=swap"
          rel="stylesheet"
        />
        <style>{`
          #site-shell {
            opacity: 0;
            visibility: hidden;
          }

          #site-boot {
            position: fixed;
            inset: 0;
            z-index: 2147483647;
            display: grid;
            place-items: center;
            background: #000;
            opacity: 1;
            visibility: visible;
            transition: opacity 180ms ease, visibility 0s linear 180ms;
          }

          #site-boot-mark {
            width: min(210px, 55vw);
            aspect-ratio: 220 / 64;
            background: url('/assets/images/Logo.png') center / contain no-repeat;
            filter: drop-shadow(0 0 22px rgba(255, 215, 0, 0.22));
          }

          html.site-ready #site-shell {
            opacity: 1;
            visibility: visible;
          }

          html.site-ready #site-boot {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }

          @media (prefers-reduced-motion: reduce) {
            #site-boot {
              transition: none;
            }
          }
        `}</style>
        <noscript>
          <style>{`
            #site-shell {
              opacity: 1 !important;
              visibility: visible !important;
            }

            #site-boot {
              display: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#000',
          color: '#fff',
        }}
      >
        <div id="site-boot" aria-hidden="true">
          <div id="site-boot-mark" />
        </div>
        <div id="site-shell">{children}</div>
        <MagicWandCursor />
        <SiteReady />
      </body>
    </html>
  )
}
