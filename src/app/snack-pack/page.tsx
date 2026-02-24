'use client'

import { useEffect, useState } from 'react'
import { FoodItem, SnackPackResponse, GapSuggestion, FoodCategory } from '@/lib/types'
import { getFoods, getFairyName, addFood, generateId } from '@/lib/storage'
import MagicButton from '@/components/MagicButton'
import { SnackComboCard } from '@/components/RecommendationCard'
import Link from 'next/link'

const COMPONENT_META: Record<string, { icon: string; colour: string; border: string; bg: string }> = {
  'fruit':       { icon: '🍎', colour: 'text-rose-700',   border: 'border-rose-200',   bg: 'bg-rose-50'   },
  'protein':     { icon: '💪', colour: 'text-amber-700',  border: 'border-amber-200',  bg: 'bg-amber-50'  },
  'healthy fat': { icon: '🥑', colour: 'text-green-700',  border: 'border-green-200',  bg: 'bg-green-50'  },
  'dip':         { icon: '🫙', colour: 'text-purple-700', border: 'border-purple-200', bg: 'bg-purple-50' },
}

function fallbackMeta(component: string) {
  return { icon: '⚠️', colour: 'text-orange-700', border: 'border-orange-200', bg: 'bg-orange-50' }
}

function getMeta(component: string) {
  return COMPONENT_META[component.toLowerCase()] ?? fallbackMeta(component)
}

interface AddedState { [key: string]: boolean }

function GapsSection({
  gaps,
  fairyName,
  onAdded,
}: {
  gaps: GapSuggestion[]
  fairyName: string
  onAdded: () => void
}) {
  const [added, setAdded] = useState<AddedState>({})

  if (!gaps || gaps.length === 0) return null

  const handleAdd = (name: string, emoji: string, category: FoodCategory) => {
    const key = name.toLowerCase()
    if (added[key]) return
    addFood({
      id:        generateId(),
      name,
      emoji,
      rating:    0,
      dateAdded: new Date().toISOString(),
      category,
    })
    setAdded(prev => ({ ...prev, [key]: true }))
    onAdded()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚠️</span>
        <p className="font-magic text-xl text-orange-700">
          {fairyName} found some gaps!
        </p>
      </div>
      <p className="font-body text-sm text-orange-600/80">
        Your snack box needs these components. Add some to your favourites so {fairyName} can build the perfect box!
      </p>

      {gaps.map((gap, i) => {
        const meta = getMeta(gap.component)
        return (
          <div
            key={i}
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            className={`animate-fadeInUp card-magic ${meta.bg} ${meta.border} p-4`}
          >
            <p className={`font-magic text-lg ${meta.colour} mb-1`}>
              {meta.icon} Missing: {gap.component}
            </p>
            <p className={`font-body text-sm ${meta.colour}/80 mb-3`}>{gap.message}</p>

            <div className="flex flex-wrap gap-2">
              {gap.suggestions?.map((s, j) => {
                const key = s.name.toLowerCase()
                const isAdded = !!added[key]
                const cat = (s.category as FoodCategory) || 'other'
                return (
                  <button
                    key={j}
                    onClick={() => handleAdd(s.name, s.emoji, cat)}
                    disabled={isAdded}
                    className={[
                      'flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2',
                      'font-body font-bold text-sm min-h-[44px]',
                      'transition-all duration-200',
                      isAdded
                        ? 'bg-green-100 border-green-300 text-green-700 cursor-default'
                        : `bg-white ${meta.border} ${meta.colour} hover:scale-105 active:scale-95`,
                    ].join(' ')}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    {s.name}
                    <span className="ml-1">{isAdded ? '✅' : '➕'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function SnackPackPage() {
  const [foods,     setFoods]     = useState<FoodItem[]>([])
  const [fairyName, setFairyName] = useState('Pixie')
  const [result,    setResult]    = useState<SnackPackResponse | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const refreshFoods = () => setFoods(getFoods())

  useEffect(() => {
    refreshFoods()
    setFairyName(getFairyName())
  }, [])

  const askFairy = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/recommend', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type: 'snack-pack', foods, fairyName }),
      })
      const data: SnackPackResponse = await res.json()
      setResult(data)
    } catch {
      setError(`${fairyName} got distracted by a rainbow! Please try again 🌈`)
    } finally {
      setLoading(false)
    }
  }

  const hasGaps = (result?.gaps?.length ?? 0) > 0

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-2 animate-float">🎒</div>
        <h1 className="font-magic text-4xl text-castle-purple">Snack Pack Magic!</h1>
        <p className="font-body text-castle-purple/70 mt-1">
          {fairyName} will pack the BEST snacks for school!
        </p>
        {/* Component legend */}
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-body font-semibold">
          {[['🍎','Fruit'],['💪','Protein'],['🥑','Healthy Fat'],['🫙','Dip']].map(([icon, label]) => (
            <span key={label} className="bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
              {icon} {label}
            </span>
          ))}
        </div>
      </div>

      {foods.length === 0 ? (
        <div className="card-magic bg-castle-purple-pale border-castle-purple-light p-8 text-center">
          <p className="text-5xl mb-3 animate-bounce_magic">🌟</p>
          <p className="font-magic text-2xl text-castle-purple mb-2">Your kingdom needs food first!</p>
          <p className="font-body text-castle-purple/70 mb-5">
            Add some of your favourite foods so {fairyName} knows what to pack!
          </p>
          <Link href="/favorites">
            <MagicButton>⭐ Add My Favourites!</MagicButton>
          </Link>
        </div>
      ) : (
        <>
          <div className="card-magic bg-white border-castle-purple-light p-4">
            <p className="font-body font-bold text-castle-purple mb-2">
              🧺 {fairyName} will use your {foods.length} favourite food{foods.length !== 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-2">
              {foods.map(f => (
                <span key={f.id} className="bg-castle-purple-pale text-castle-purple text-sm font-body font-semibold px-3 py-1 rounded-full border border-castle-purple-light">
                  {f.emoji} {f.name}
                </span>
              ))}
            </div>
          </div>

          <MagicButton onClick={askFairy} loading={loading} fullWidth variant="secondary">
            🧚 Ask {fairyName} to Pack My Snacks!
          </MagicButton>

          {error && (
            <div className="card-magic bg-rose-50 border-rose-200 p-4 text-center font-body text-rose-600">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fadeInUp">
              {/* Greeting */}
              <div className="card-magic bg-gradient-to-r from-castle-purple to-castle-pink p-4 text-white text-center">
                <p className="font-magic text-xl">✨ {fairyName} says… ✨</p>
                <p className="font-body mt-1">{result.greeting}</p>
              </div>

              {/* Gap warnings */}
              {hasGaps && (
                <div className="card-magic bg-orange-50 border-orange-200 p-4 space-y-4">
                  <GapsSection
                    gaps={result.gaps}
                    fairyName={fairyName}
                    onAdded={refreshFoods}
                  />
                </div>
              )}

              {/* All clear badge */}
              {!hasGaps && (
                <div className="card-magic bg-green-50 border-green-200 p-3 flex items-center gap-3">
                  <span className="text-3xl">✅</span>
                  <div>
                    <p className="font-magic text-lg text-green-700">All 4 components covered!</p>
                    <p className="font-body text-sm text-green-600">Fruit · Protein · Healthy Fat · Dip — great variety!</p>
                  </div>
                </div>
              )}

              {/* Snack combos */}
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

              <MagicButton onClick={askFairy} loading={loading} fullWidth>
                🔮 Ask {fairyName} Again!
              </MagicButton>
            </div>
          )}
        </>
      )}
    </div>
  )
}
