'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/',              label: 'Kingdom',  emoji: '🏰' },
  { href: '/favorites',     label: 'Favourites', emoji: '⭐' },
  { href: '/snack-pack',    label: 'Snack Pack', emoji: '🎒' },
  { href: '/cook-together', label: 'Cook',      emoji: '👩‍🍳' },
  { href: '/try-new',       label: 'Try New',  emoji: '🌟' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop top bar */}
      <nav className="hidden md:flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b-2 border-castle-purple-light sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl animate-sparkle">🏰</span>
          <span className="font-magic text-2xl text-castle-purple leading-none">
            Krysha&apos;s Snack Kingdom
          </span>
        </Link>

        <div className="flex gap-1">
          {NAV_ITEMS.slice(1).map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-2xl font-body font-bold text-sm',
                  'transition-all duration-200 hover:scale-105 min-h-[44px]',
                  active
                    ? 'bg-castle-purple text-white shadow-md shadow-castle-purple/30'
                    : 'text-castle-purple hover:bg-castle-purple-pale',
                ].join(' ')}
              >
                <span>{item.emoji}</span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-t-2 border-castle-purple-light">
        <div className="flex">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex-1 flex flex-col items-center justify-center py-2 gap-0.5',
                  'min-h-[56px] transition-all duration-200',
                  active ? 'text-castle-purple' : 'text-gray-400',
                ].join(' ')}
              >
                <span className={`text-2xl transition-transform duration-200 ${active ? 'scale-125' : 'scale-100'}`}>
                  {item.emoji}
                </span>
                <span className={`text-xs font-body font-bold ${active ? 'text-castle-purple' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-castle-purple" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
