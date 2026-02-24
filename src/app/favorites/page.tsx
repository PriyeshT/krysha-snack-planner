'use client'

import { useEffect, useState } from 'react'
import { FoodItem } from '@/lib/types'
import { getFoods } from '@/lib/storage'
import AddFoodForm from '@/components/AddFoodForm'
import FoodCard from '@/components/FoodCard'
import SuggestionsPanel from '@/components/SuggestionsPanel'

const CATEGORY_ORDER = ['fruit','veggie','protein','grain','dairy','snack','other']

export default function FavouritesPage() {
  const [foods,  setFoods]  = useState<FoodItem[]>([])
  const [filter, setFilter] = useState<string>('all')

  const refresh = () => setFoods(getFoods())

  useEffect(() => { refresh() }, [])

  const categories = Array.from(new Set(foods.map(f => f.category)))
    .sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b))

  const filtered = filter === 'all' ? foods : foods.filter(f => f.category === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-magic text-4xl text-castle-purple">⭐ My Favourites ⭐</h1>
        <p className="font-body text-castle-purple/70 mt-1">
          {foods.length === 0
            ? 'Add your first yummy food below!'
            : `${foods.length} yummy food${foods.length !== 1 ? 's' : ''} in your kingdom!`}
        </p>
      </div>

      {/* Add form */}
      <AddFoodForm onAdded={refresh} />

      {/* AI Singapore suggestions */}
      <SuggestionsPanel existingFoods={foods} onAdded={refresh} />

      {/* Category filter pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={[
              'px-4 py-1.5 rounded-full font-body font-bold text-sm border-2 min-h-[44px]',
              'transition-all duration-150 hover:scale-105',
              filter === 'all'
                ? 'bg-castle-purple text-white border-castle-purple'
                : 'bg-white text-castle-purple border-castle-purple-light',
            ].join(' ')}
          >
            🍽️ All ({foods.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={[
                'px-4 py-1.5 rounded-full font-body font-bold text-sm border-2 min-h-[44px] capitalize',
                'transition-all duration-150 hover:scale-105',
                filter === cat
                  ? 'bg-castle-purple text-white border-castle-purple'
                  : 'bg-white text-castle-purple border-castle-purple-light',
              ].join(' ')}
            >
              {cat} ({foods.filter(f => f.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {/* Food grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 card-magic bg-castle-purple-pale border-castle-purple-light">
          <p className="text-6xl mb-4 animate-float">🌟</p>
          <p className="font-magic text-2xl text-castle-purple">
            {foods.length === 0 ? 'Your kingdom awaits!' : 'No foods in this group yet!'}
          </p>
          <p className="font-body text-castle-purple/70 mt-2">
            {foods.length === 0
              ? 'Add a favourite food to get started ✨'
              : 'Try a different category or add more foods!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((food, i) => (
            <FoodCard key={food.id} food={food} onMutate={refresh} animDelay={i * 80} />
          ))}
        </div>
      )}
    </div>
  )
}
