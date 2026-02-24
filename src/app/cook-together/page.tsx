'use client'

import { useEffect, useState } from 'react'
import { FoodItem, CookTogetherResponse } from '@/lib/types'
import { getFoods, getFairyName } from '@/lib/storage'
import MagicButton from '@/components/MagicButton'
import { RecipeCard } from '@/components/RecommendationCard'
import CreditsErrorCard from '@/components/CreditsErrorCard'
import Link from 'next/link'

export default function CookTogetherPage() {
  const [foods,     setFoods]     = useState<FoodItem[]>([])
  const [fairyName, setFairyName] = useState('Pixie')
  const [result,       setResult]       = useState<CookTogetherResponse | null>(null)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [creditsError, setCreditsError] = useState(false)

  useEffect(() => {
    setFoods(getFoods())
    setFairyName(getFairyName())
  }, [])

  const askFairy = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    setCreditsError(false)
    try {
      const res = await fetch('/api/recommend', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type: 'cook-together', foods, fairyName }),
      })
      const data: CookTogetherResponse = await res.json()
      if ((data as { creditsError?: boolean }).creditsError) { setCreditsError(true); return }
      setResult(data)
    } catch {
      setError(`${fairyName} accidentally turned the recipe into glitter! Try again 🌟`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-2 animate-float">👩‍🍳</div>
        <h1 className="font-magic text-4xl text-castle-purple">Cook Together!</h1>
        <p className="font-body text-castle-purple/70 mt-1">
          Make magical recipes with Daddy! 🍳✨
        </p>
      </div>

      {foods.length === 0 ? (
        <div className="card-magic bg-castle-gold-light/40 border-castle-gold p-8 text-center">
          <p className="text-5xl mb-3 animate-bounce_magic">👨‍🍳</p>
          <p className="font-magic text-2xl text-castle-purple mb-2">
            The kitchen needs ingredients!
          </p>
          <p className="font-body text-castle-purple/70 mb-5">
            Add your favourite foods first so {fairyName} can create amazing recipes!
          </p>
          <Link href="/favorites">
            <MagicButton variant="secondary">⭐ Add My Favourites!</MagicButton>
          </Link>
        </div>
      ) : (
        <>
          <div className="card-magic bg-white border-castle-gold p-4">
            <p className="font-body font-bold text-castle-purple mb-2">
              🧺 {fairyName} will cook with your {foods.length} favourite food{foods.length !== 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-2">
              {foods.map(f => (
                <span
                  key={f.id}
                  className="bg-castle-gold-light/30 text-amber-700 text-sm font-body font-semibold px-3 py-1 rounded-full border border-castle-gold"
                >
                  {f.emoji} {f.name}
                </span>
              ))}
            </div>
          </div>

          <MagicButton onClick={askFairy} loading={loading} fullWidth variant="secondary">
            🧚 Get Magical Recipes from {fairyName}!
          </MagicButton>

          {error && (
            <div className="card-magic bg-rose-50 border-rose-200 p-4 text-center font-body text-rose-600">
              {error}
            </div>
          )}

          {creditsError && <CreditsErrorCard fairyName={fairyName} />}

          {result && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="card-magic bg-gradient-to-r from-castle-gold to-castle-teal p-4 text-white text-center">
                <p className="font-magic text-xl">🍳 {fairyName}&apos;s Kitchen Says… 🍳</p>
                <p className="font-body mt-1">{result.greeting}</p>
              </div>

              <div className="grid gap-4">
                {result.recipes?.map((recipe, i) => (
                  <RecipeCard key={i} recipe={recipe} index={i} />
                ))}
              </div>

              {result.closingNote && (
                <div className="card-magic bg-castle-gold-light/40 border-castle-gold p-4 text-center">
                  <p className="font-body font-semibold text-castle-purple">
                    🌟 {result.closingNote}
                  </p>
                </div>
              )}

              <MagicButton onClick={askFairy} loading={loading} fullWidth>
                🔮 Get More Recipes from {fairyName}!
              </MagicButton>
            </div>
          )}
        </>
      )}
    </div>
  )
}
