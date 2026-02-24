import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: "Krysha's Snack Kingdom ✨",
  description: 'A magical place for Krysha and Daddy to plan healthy, yummy snacks together!',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable:           true,
    statusBarStyle:    'black-translucent',
    title:             "Snack Kingdom",
  },
  icons: {
    icon:  '/icon-192.svg',
    apple: '/icon-192.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#6B21A8" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <NavBar />
        <main className="max-w-2xl mx-auto px-4 pt-6 page-content">
          {children}
        </main>

        {/* Floating sparkles decoration */}
        <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {['✨','⭐','🌟','💫','✦'].map((s, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-20 animate-float"
              style={{
                left:              `${10 + i * 20}%`,
                top:               `${5 + i * 15}%`,
                animationDelay:    `${i * 0.6}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </body>
    </html>
  )
}
