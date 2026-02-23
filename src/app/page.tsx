'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getFoods, getFairyName, saveFairyName } from '@/lib/storage'

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
  const [foodCount,    setFoodCount]    = useState(0)
  const [fairyName,    setFairyName]    = useState('Pixie')
  const [editingName,  setEditingName]  = useState(false)
  const [draftName,    setDraftName]    = useState('')
  const [nameSaved,    setNameSaved]    = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFoodCount(getFoods().length)
    setFairyName(getFairyName())
  }, [])

  const startEditing = () => {
    setDraftName(fairyName)
    setEditingName(true)
    setTimeout(() => nameInputRef.current?.select(), 30)
  }

  const commitName = () => {
    const trimmed = draftName.trim() || 'Pixie'
    saveFairyName(trimmed)
    setFairyName(trimmed)
    setEditingName(false)
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
  }

  const handleNameKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')  commitName()
    if (e.key === 'Escape') setEditingName(false)
  }

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
      subtitle: `${fairyName} packs the BEST school snacks!`,
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
      subtitle: `${fairyName} found amazing foods to discover!`,
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

        {/* Fairy name editor */}
        <div className="mt-4 inline-flex flex-col items-center gap-2">
          <p className="font-body text-sm text-castle-purple/60">Your magical fairy is named:</p>

          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                ref={nameInputRef}
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                onKeyDown={handleNameKey}
                maxLength={20}
                placeholder="Fairy name…"
                className="font-magic text-2xl text-castle-purple text-center bg-white border-2 border-castle-purple rounded-2xl px-4 py-1 w-44 focus:outline-none focus:ring-2 focus:ring-castle-purple/30"
              />
              <button
                onClick={commitName}
                className="text-2xl min-h-[44px] min-w-[44px] hover:scale-125 active:scale-90 transition-transform"
                aria-label="Save name"
              >
                ✅
              </button>
            </div>
          ) : (
            <button
              onClick={startEditing}
              className="group flex items-center gap-2 font-magic text-3xl text-castle-purple hover:text-castle-pink transition-colors min-h-[44px]"
              aria-label={`Fairy name is ${fairyName}. Tap to change.`}
            >
              🧚 {fairyName}
              <span className="text-xl opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
            </button>
          )}

          {nameSaved && (
            <p className="animate-fadeInUp font-body text-sm text-green-600 font-bold">
              ✨ Saved! Hello, {fairyName}!
            </p>
          )}
        </div>

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
            {card.badge && (
              <span className="absolute top-3 right-3 bg-castle-purple text-white text-xs font-magic px-2.5 py-0.5 rounded-full animate-bounce_magic">
                {card.badge}
              </span>
            )}

            <div
              className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {card.emoji}
            </div>

            <h2 className="font-magic text-2xl text-castle-purple">{card.title}</h2>
            <p className="font-body text-sm text-castle-purple/70 mt-1">{card.subtitle}</p>

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
