'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFoods } from '@/lib/storage'

interface KingdomCard {
  href:     string
  emoji:    string
  title:    string
  subtitle: string
  gradient: string
  border:   string
  badge?:   string
}

export default function HomePage() {
  const [foodCount, setFoodCount] = useState(0)

  useEffect(() => { setFoodCount(getFoods().length) }, [])

  const cards: KingdomCard[] = [
    {
      href:     '/favorites',
      emoji:    '⭐',
      title:    'My Favourites',
      subtitle: foodCount === 0
        ? 'Add your first yummy food!'
        : `${foodCount} yummy food${foodCount !== 1 ? 's' : ''} in your kingdom!`,
      gradient: 'from-castle-purple-pale to-castle-pink-pale',
      border:   'border-castle-purple-light',
      badge:    foodCount > 0 ? `${foodCount}` : undefined,
    },
    {
      href:     '/snack-pack',
      emoji:    '🎒',
      title:    'Snack Pack Magic',
      subtitle: 'Pixie packs the BEST school snacks!',
      gradient: 'from-castle-gold-light/40 to-castle-cream',
      border:   'border-castle-gold',
    },
    {
      href:     '/cook-together',
      emoji:    '👩‍🍳',
      title:    'Cook Together',
      subtitle: 'Make magical recipes with Daddy!',
      gradient: 'from-castle-teal/10 to-blue-50',
      border:   'border-castle-teal',
    },
    {
      href:     '/try-new',
      emoji:    '🌟',
      title:    'Try Something New',
      subtitle: 'Discover amazing foods from the kingdom!',
      gradient: 'from-castle-pink-pale to-castle-purple-pale',
      border:   'border-castle-pink',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center pt-4">
        <div className="relative inline-block">
          <span className="text-7xl md:text-8xl animate-float block">🏰</span>
          <span aria-hidden className="absolute -top-2 -right-4 text-3xl animate-sparkle">✨</span>
        </div>
        <h1 className="font-magic text-4xl md:text-5xl text-castle-purple mt-3 leading-tight">
          Krysha&apos;s
          <br />
          <span className="shimmer-gold">Snack Kingdom</span>
        </h1>
        <p className="font-body text-lg text-castle-purple/70 mt-2">
          Where every snack is a magical adventure! 🧚‍♀️
        </p>

        {foodCount === 0 && (
          <div className="mt-4 bg-castle-sparkle/20 border-2 border-castle-sparkle rounded-2xl px-5 py-3 inline-block">
            <p className="font-body font-bold text-amber-700">
              ✨ Start by adding your favourite foods below!
            </p>
          </div>
        )}
      </div>

      {/* Kingdom cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            className={[
              'animate-fadeInUp card-magic relative',
              `bg-gradient-to-br ${card.gradient} border-2 ${card.border}`,
              'p-6 block group',
            ].join(' ')}
          >
            {/* Badge */}
            {card.badge && (
              <span className="absolute top-3 right-3 bg-castle-purple text-white text-xs font-magic px-2.5 py-0.5 rounded-full animate-bounce_magic">
                {card.badge}
              </span>
            )}

            {/* Emoji */}
            <div
              className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {card.emoji}
            </div>

            {/* Text */}
            <h2 className="font-magic text-2xl text-castle-purple">{card.title}</h2>
            <p className="font-body text-sm text-castle-purple/70 mt-1">{card.subtitle}</p>

            {/* Arrow */}
            <span className="mt-3 inline-flex items-center gap-1 font-body font-bold text-castle-purple text-sm group-hover:gap-2 transition-all">
              Let&apos;s go <span className="text-lg">→</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pb-4">
        <p className="font-body text-sm text-castle-purple/50">
          Made with 💜 for Krysha by Daddy
        </p>
      </div>
    </div>
  )
}
