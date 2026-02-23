'use client'

import { useState } from 'react'
import { FoodCategory, FoodItem } from '@/lib/types'
import { addFood, generateId } from '@/lib/storage'
import MagicButton from './MagicButton'

const EMOJIS = [
  '🍎','🍊','🍋','🍇','🍓','🫐','🍒','🍑','🥭','🍍',
  '🥝','🍌','🍉','🍈','🥥','🍆','🥦','🥕','🌽','🥑',
  '🧅','🥜','🧀','🥚','🍳','🥞','🍞','🥙','🥪','🍱',
  '🍿','🧁','🍰','🍦','🥛','🧃','🫙','🥗','🍜','🫚',
]

const CATEGORIES: FoodCategory[] = ['fruit','veggie','protein','grain','dairy','snack','other']

interface AddFoodFormProps { onAdded: () => void }

export default function AddFoodForm({ onAdded }: AddFoodFormProps) {
  const [name,     setName]     = useState('')
  const [emoji,    setEmoji]    = useState('🍎')
  const [category, setCategory] = useState<FoodCategory>('fruit')
  const [open,     setOpen]     = useState(false)
  const [shake,    setShake]    = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    const food: FoodItem = {
      id:        generateId(),
      name:      name.trim(),
      emoji,
      rating:    0,
      dateAdded: new Date().toISOString(),
      category,
    }
    addFood(food)
    setName('')
    setEmoji('🍎')
    setCategory('fruit')
    setOpen(false)
    onAdded()
  }

  return (
    <div className="card-magic bg-castle-purple-pale border-castle-purple-light p-5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between font-magic text-castle-purple text-2xl min-h-[44px]"
      >
        <span>✨ Add a new favourite food!</span>
        <span className={`transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}>➕</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block font-body font-bold text-castle-purple mb-1">
              What food is it? 🌟
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Apple, Cheese, Carrot…"
              className={[
                'w-full rounded-2xl border-2 border-castle-purple-light',
                'px-4 py-2 font-body text-lg text-black focus:outline-none focus:border-castle-purple',
                'bg-white transition-all duration-200 min-h-[44px]',
                shake ? 'animate-wiggle border-red-400' : '',
              ].join(' ')}
            />
          </div>

          {/* Emoji picker */}
          <div>
            <label className="block font-body font-bold text-castle-purple mb-2">
              Pick an emoji! {emoji}
            </label>
            <div className="grid grid-cols-8 gap-1 bg-white rounded-2xl p-2 border-2 border-castle-purple-light">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={[
                    'text-2xl p-1 rounded-xl transition-all duration-150 min-h-[44px] min-w-[44px]',
                    'hover:scale-125 active:scale-90',
                    emoji === e ? 'bg-castle-purple-pale ring-2 ring-castle-purple scale-110' : '',
                  ].join(' ')}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-body font-bold text-castle-purple mb-2">
              What kind of food? 🏷️
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={[
                    'px-4 py-1.5 rounded-full font-body font-bold capitalize text-sm',
                    'border-2 transition-all duration-150 min-h-[44px]',
                    'hover:scale-105 active:scale-95',
                    category === c
                      ? 'bg-castle-purple text-white border-castle-purple'
                      : 'bg-white text-castle-purple border-castle-purple-light',
                  ].join(' ')}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <MagicButton type="submit" fullWidth>
            🌈 Add to My Kingdom!
          </MagicButton>
        </form>
      )}
    </div>
  )
}
