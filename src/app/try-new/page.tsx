'use client'

import { useEffect, useState } from 'react'
import { FoodItem, TryNewResponse, NewFood, FoodCategory } from '@/lib/types'
import { getFoods, getFairyName, addFood, generateId } from '@/lib/storage'
import MagicButton from '@/components/MagicButton'
import { NewFoodCard } from '@/components/RecommendationCard'
import CreditsErrorCard from '@/components/CreditsErrorCard'

export default function TryNewPage() {
  const [foods,     setFoods]     = useState<FoodItem[]>([])
  const [fairyName, setFairyName] = useState('Pixie')
  const [result,       setResult]       = useState<TryNewResponse | null>(null)
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
        body:    JSON.stringify({ type: 'try-new', foods, fairyName }),
      })
      const data: TryNewResponse = await res.json()
      if ((data as { creditsError?: boolean }).creditsError) { setCreditsError(true); return }
      setResult(data)
    } catch {
      setError(`${fairyName} flew too far into the enchanted forest! Try again 🌲✨`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFood = (food: NewFood) => {
    const validCats: FoodCategory[] = ['fruit','veggie','protein','grain','dairy','snack','other']
    const cat: FoodCategory = validCats.includes(food.category as FoodCategory)
      ? food.category as FoodCategory
      : 'other'
    addFood({
      id:        generateId(),
      name:      food.name,
      emoji:     food.emoji,
      rating:    0,
      dateAdded: new Date().toISOString(),
      category:  cat,
    })
    setFoods(getFoods())
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-2 animate-sparkle">🌟</div>
        <h1 className="font-magic text-4xl text-castle-purple">Try Something New!</h1>
        <p className="font-body text-castle-purple/70 mt-1">
          {fairyName} found amazing new foods just for Krysha! 🧚‍♀️
        </p>
      </div>

      {foods.length > 0 && (
        <div className="card-magic bg-white border-castle-pink-light p-4">
          <p className="font-body font-bold text-castle-purple mb-2">
            ✨ Based on your {foods.length} favourite food{foods.length !== 1 ? 's' : ''}:
          </p>
          <div className="flex flex-wrap gap-2">
            {foods.map(f => (
              <span
                key={f.id}
                className="bg-castle-pink-pale text-castle-pink text-sm font-body font-semibold px-3 py-1 rounded-full border border-castle-pink-light"
              >
                {f.emoji} {f.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {foods.length === 0 && (
        <div className="card-magic bg-castle-pink-pale border-castle-pink-light p-4 text-center">
          <p className="font-body text-castle-purple/70">
            🌈 No favourites yet? No problem! {fairyName} will suggest amazing foods to discover!
          </p>
        </div>
      )}

      <MagicButton onClick={askFairy} loading={loading} fullWidth variant="secondary">
        🧚 Discover New Foods with {fairyName}!
      </MagicButton>

      {error && (
        <div className="card-magic bg-rose-50 border-rose-200 p-4 text-center font-body text-rose-600">
          {error}
        </div>
      )}

      {creditsError && <CreditsErrorCard fairyName={fairyName} />}

      {result && (
        <div className="space-y-4 animate-fadeInUp">
          <div className="card-magic bg-gradient-to-r from-castle-pink to-castle-purple p-4 text-white text-center">
            <p className="font-magic text-xl">🌟 {fairyName}&apos;s Adventure Picks! 🌟</p>
            <p className="font-body mt-1">{result.greeting}</p>
          </div>

          <div className="grid gap-4">
            {result.newFoods?.map((food, i) => (
              <NewFoodCard key={i} food={food} index={i} onAdd={handleAddFood} />
            ))}
          </div>

          {result.closingNote && (
            <div className="card-magic bg-castle-pink-pale border-castle-pink-light p-4 text-center">
              <p className="font-body font-semibold text-castle-purple">
                💫 {result.closingNote}
              </p>
            </div>
          )}

          <MagicButton onClick={askFairy} loading={loading} fullWidth>
            🔮 Find More New Foods with {fairyName}!
          </MagicButton>
        </div>
      )}
    </div>
  )
}
