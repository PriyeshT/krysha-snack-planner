'use client'

import { useState } from 'react'
import { SnackCombo, Recipe, NewFood } from '@/lib/types'

// ── Snack Pack ────────────────────────────────────────────────────────────────
export function SnackComboCard({ combo, index }: { combo: SnackCombo; index: number }) {
  const gradients = [
    'from-castle-purple-pale to-castle-pink-pale border-castle-pink-light',
    'from-castle-gold-light/30 to-castle-cream border-castle-gold',
    'from-blue-50 to-castle-teal/10 border-castle-teal',
    'from-castle-pink-pale to-castle-purple-pale border-castle-purple-light',
  ]

  return (
    <div
      style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
      className={`animate-fadeInUp card-magic bg-gradient-to-br ${gradients[index % gradients.length]} p-5`}
    >
      <h3 className="font-magic text-xl text-castle-purple mb-3">{combo.name}</h3>
      <ul className="space-y-1 mb-3">
        {combo.items.map((item, i) => (
          <li key={i} className="font-body text-base flex items-start gap-2">
            <span className="text-castle-gold mt-0.5">✦</span>
            {item}
          </li>
        ))}
      </ul>
      <p className="font-body text-sm text-castle-purple/70 italic">{combo.whyItsYummy}</p>
    </div>
  )
}

// ── Cook Together ─────────────────────────────────────────────────────────────
export function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const missing = recipe.missingIngredients ?? []

  const isMissing = (ing: string) =>
    missing.some(m =>
      ing.toLowerCase().includes(m.toLowerCase()) ||
      m.toLowerCase().includes(ing.toLowerCase())
    )

  const hasMissing = missing.length > 0

  return (
    <div
      style={{ animationDelay: `${index * 140}ms`, animationFillMode: 'both' }}
      className="animate-fadeInUp card-magic bg-gradient-to-br from-castle-gold-light/30 to-castle-cream border-castle-gold p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl animate-float" style={{ animationDelay: `${index * 200}ms` }}>
          {recipe.emoji}
        </span>
        <h3 className="font-magic text-xl text-castle-purple">{recipe.name}</h3>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="font-body font-bold text-sm text-castle-purple">🧺 You need:</p>
          {hasMissing && (
            <span className="text-xs font-body font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
              🛒 some shopping needed
            </span>
          )}
        </div>
        <ul className="space-y-1">
          {recipe.ingredients.map((ing, i) => {
            const needsToBuy = isMissing(ing)
            return (
              <li
                key={i}
                className={[
                  'font-body text-sm flex items-center gap-2 px-2 py-1 rounded-lg',
                  needsToBuy
                    ? 'bg-amber-50 border border-amber-200 text-amber-800'
                    : 'text-gray-700',
                ].join(' ')}
              >
                <span>{needsToBuy ? '🛒' : '✅'}</span>
                <span>{ing}</span>
                {needsToBuy && (
                  <span className="ml-auto text-xs text-amber-600 font-bold">need to buy</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mb-3">
        <p className="font-body font-bold text-sm text-castle-purple mb-1">👩‍🍳 How to make it:</p>
        <ol className="space-y-1 pl-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="font-body text-sm list-decimal text-gray-700">{step}</li>
          ))}
        </ol>
      </div>

      <div className="mt-3 bg-white/60 rounded-xl p-3">
        <p className="font-body text-sm text-castle-teal font-semibold">🌟 Fun fact: {recipe.funFact}</p>
      </div>
    </div>
  )
}

// ── Try New Food ──────────────────────────────────────────────────────────────
export function NewFoodCard({ food, index, onAdd }: { food: NewFood; index: number; onAdd?: (food: NewFood) => void }) {
  const [added, setAdded] = useState(false)

  const gradients = [
    'from-castle-pink-pale to-castle-purple-pale border-castle-pink',
    'from-castle-teal/10 to-blue-50 border-castle-teal',
    'from-castle-gold-light/30 to-castle-cream border-castle-gold',
  ]

  const handleAdd = () => {
    if (added || !onAdd) return
    setAdded(true)
    onAdd(food)
  }

  return (
    <div
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
      className={`animate-fadeInUp card-magic bg-gradient-to-br ${gradients[index % gradients.length]} p-5`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl animate-sparkle">{food.emoji}</span>
        <div>
          <h3 className="font-magic text-xl text-castle-purple">{food.name}</h3>
          <span className="text-xs font-body text-castle-purple/60 capitalize">{food.category}</span>
        </div>
      </div>

      <div className="space-y-2 font-body text-sm text-gray-700">
        <p><span className="font-bold text-castle-pink">🌺 Why try it?</span> {food.whyTryIt}</p>
        <p><span className="font-bold text-castle-gold">👅 It tastes:</span> {food.tastes}</p>
        <div className="bg-white/70 rounded-xl p-3 mt-2">
          <p className="font-bold text-castle-purple mb-1">🎯 Krysha&apos;s Challenge:</p>
          <p>{food.challenge}</p>
        </div>
      </div>

      {onAdd && (
        <button
          onClick={handleAdd}
          disabled={added}
          className={[
            'mt-4 w-full flex items-center justify-center gap-2',
            'font-body font-bold text-sm px-4 py-2.5 rounded-2xl border-2',
            'transition-all duration-200 min-h-[44px]',
            added
              ? 'bg-green-100 border-green-300 text-green-700 cursor-default'
              : 'bg-white/80 border-castle-purple text-castle-purple hover:bg-castle-purple hover:text-white hover:scale-[1.02] active:scale-[0.98]',
          ].join(' ')}
        >
          {added ? '✅ Added to My Kingdom!' : '⭐ Add to My Favourites!'}
        </button>
      )}
    </div>
  )
}
