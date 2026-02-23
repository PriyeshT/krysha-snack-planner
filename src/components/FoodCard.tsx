'use client'

import { useState } from 'react'
import { FoodItem } from '@/lib/types'
import { updateFood, deleteFood } from '@/lib/storage'
import StarRating from './StarRating'

const categoryColors: Record<string, string> = {
  fruit:   'bg-pink-100 text-pink-700 border-pink-200',
  veggie:  'bg-green-100 text-green-700 border-green-200',
  protein: 'bg-amber-100 text-amber-700 border-amber-200',
  grain:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  dairy:   'bg-blue-100 text-blue-700 border-blue-200',
  snack:   'bg-purple-100 text-purple-700 border-purple-200',
  other:   'bg-gray-100 text-gray-600 border-gray-200',
}

interface FoodCardProps {
  food:       FoodItem
  onMutate:   () => void
  animDelay?: number
}

export default function FoodCard({ food, onMutate, animDelay = 0 }: FoodCardProps) {
  const [removing, setRemoving]   = useState(false)
  const [rateAnim, setRateAnim]   = useState(false)

  const handleRate = (rating: number) => {
    updateFood(food.id, { rating })
    setRateAnim(true)
    setTimeout(() => { setRateAnim(false); onMutate() }, 350)
  }

  const handleDelete = () => {
    setRemoving(true)
    setTimeout(() => { deleteFood(food.id); onMutate() }, 350)
  }

  return (
    <div
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'both' }}
      className={[
        'animate-fadeInUp',
        'card-magic bg-white border-castle-purple-pale',
        'p-4 flex items-start gap-3',
        removing ? 'opacity-0 scale-90 transition-all duration-300' : '',
        rateAnim  ? 'scale-105 transition-transform duration-200' : '',
      ].join(' ')}
    >
      {/* Emoji */}
      <span className="text-4xl leading-none select-none animate-float" style={{ animationDelay: `${animDelay * 0.5}ms` }}>
        {food.emoji}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-magic text-xl text-castle-purple truncate">{food.name}</p>

        <span className={`inline-block text-xs font-body font-bold px-2 py-0.5 rounded-full border mt-1 capitalize ${categoryColors[food.category]}`}>
          {food.category}
        </span>

        <div className="mt-2">
          <StarRating value={food.rating} onChange={handleRate} size="sm" />
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl hover:scale-125 active:scale-90 transition-transform text-rose-400 hover:text-rose-600"
        aria-label={`Remove ${food.name}`}
      >
        🗑️
      </button>
    </div>
  )
}
