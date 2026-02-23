'use client'

import { useEffect, useState } from 'react'
import { FoodItem, SnackPackResponse } from '@/lib/types'
import { getFoods } from '@/lib/storage'
import MagicButton from '@/components/MagicButton'
import { SnackComboCard } from '@/components/RecommendationCard'
import Link from 'next/link'

export default function SnackPackPage() {
  const [foods,    setFoods]    = useState<FoodItem[]>([])
  const [result,   setResult]   = useState<SnackPackResponse | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => { setFoods(getFoods()) }, [])

  const askPixie = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/recommend', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type: 'snack-pack', foods }),
      })
      const data: SnackPackResponse = await res.json()
      setResult(data)
    } catch {
      setError('Pixie got distracted by a rainbow! Please try again 🌈')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-2 animate-float">🎒</div>
        <h1 className="font-magic text-4xl text-castle-purple">Snack Pack Magic!</h1>
        <p className="font-body text-castle-purple/70 mt-1">
          Pixie will pack the BEST snacks for school!
        </p>
      </div>

      {/* No foods state */}
      {foods.length === 0 ? (
        <div className="card-magic bg-castle-purple-pale border-castle-purple-light p-8 text-center">
          <p className="text-5xl mb-3 animate-bounce_magic">🌟</p>
          <p className="font-magic text-2xl text-castle-purple mb-2">
            Your kingdom needs food first!
          </p>
          <p className="font-body text-castle-purple/70 mb-5">
            Add some of your favourite foods so Pixie knows what to pack!
          </p>
          <Link href="/favorites">
            <MagicButton>⭐ Add My Favourites!</MagicButton>
          </Link>
        </div>
      ) : (
        <>
          {/* Current foods summary */}
          <div className="card-magic bg-white border-castle-purple-light p-4">
            <p className="font-body font-bold text-castle-purple mb-2">
              🧺 Pixie will use your {foods.length} favourite food{foods.length !== 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-2">
              {foods.map(f => (
                <span
                  key={f.id}
                  className="bg-castle-purple-pale text-castle-purple text-sm font-body font-semibold px-3 py-1 rounded-full border border-castle-purple-light"
                >
                  {f.emoji} {f.name}
                </span>
              ))}
            </div>
          </div>

          <MagicButton onClick={askPixie} loading={loading} fullWidth variant="secondary">
            🧚 Ask Pixie to Pack My Snacks!
          </MagicButton>

          {error && (
            <div className="card-magic bg-rose-50 border-rose-200 p-4 text-center font-body text-rose-600">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="card-magic bg-gradient-to-r from-castle-purple to-castle-pink p-4 text-white text-center">
                <p className="font-magic text-xl">✨ Pixie says… ✨</p>
                <p className="font-body mt-1">{result.greeting}</p>
              </div>

              <div className="grid gap-3">
                {result.combos?.map((combo, i) => (
                  <SnackComboCard key={i} combo={combo} index={i} />
                ))}
              </div>

              {result.closingNote && (
                <div className="card-magic bg-castle-gold-light/40 border-castle-gold p-4 text-center">
                  <p className="font-body font-semibold text-castle-purple">
                    🌟 {result.closingNote}
                  </p>
                </div>
              )}

              <MagicButton onClick={askPixie} loading={loading} fullWidth>
                🔮 Ask Pixie Again!
              </MagicButton>
            </div>
          )}
        </>
      )}
    </div>
  )
}
