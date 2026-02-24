'use client'

import { useRef, useState } from 'react'
import { FoodCategory, FoodItem } from '@/lib/types'
import { updateFood, deleteFood } from '@/lib/storage'
import { containsNut } from '@/lib/nuts'
import StarRating from './StarRating'

const EMOJIS = [
  '🍎','🍊','🍋','🍇','🍓','🫐','🍒','🍑','🥭','🍍',
  '🥝','🍌','🍉','🍈','🥥','🍆','🥦','🥕','🌽','🥑',
  '🧅','🥜','🧀','🥚','🍳','🥞','🍞','🥙','🥪','🍱',
  '🍿','🧁','🍰','🍦','🥛','🧃','🫙','🥗','🍜','🫚',
]

const CATEGORIES: FoodCategory[] = ['fruit','veggie','protein','grain','dairy','snack','other']

const CATEGORY_DEFAULT_EMOJI: Record<FoodCategory, string> = {
  fruit:   '🍎',
  veggie:  '🥦',
  protein: '🥩',
  grain:   '🍞',
  dairy:   '🧀',
  snack:   '🍿',
  other:   '🍽️',
}

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
  const [removing,      setRemoving]      = useState(false)
  const [rateAnim,      setRateAnim]      = useState(false)
  const [editing,       setEditing]       = useState(false)
  const [editName,      setEditName]      = useState(food.name)
  const [editCategory,  setEditCategory]  = useState<FoodCategory>(food.category)
  const [editEmoji,     setEditEmoji]     = useState(food.emoji)
  const [emojiManual,   setEmojiManual]   = useState(true)   // existing foods keep their emoji by default
  const [pickerOpen,    setPickerOpen]    = useState(false)
  const [editNutError,  setEditNutError]  = useState(false)
  const editNameRef = useRef<HTMLInputElement>(null)

  const handleRate = (rating: number) => {
    updateFood(food.id, { rating })
    setRateAnim(true)
    setTimeout(() => { setRateAnim(false); onMutate() }, 350)
  }

  const handleDelete = () => {
    setRemoving(true)
    setTimeout(() => { deleteFood(food.id); onMutate() }, 350)
  }

  const openEdit = () => {
    setEditName(food.name)
    setEditCategory(food.category)
    setEditEmoji(food.emoji)
    setEmojiManual(true)
    setPickerOpen(false)
    setEditNutError(false)
    setEditing(true)
    setTimeout(() => editNameRef.current?.focus(), 50)
  }

  const cancelEdit = () => {
    setEditing(false)
    setPickerOpen(false)
    setEditNutError(false)
  }

  const handleCategoryChange = (c: FoodCategory) => {
    setEditCategory(c)
    if (!emojiManual) setEditEmoji(CATEGORY_DEFAULT_EMOJI[c])
    setPickerOpen(false)
  }

  const handleEmojiPick = (e: string) => {
    setEditEmoji(e)
    setEmojiManual(true)
    setPickerOpen(false)
  }

  const saveEdit = () => {
    const trimmed = editName.trim()
    if (!trimmed) { editNameRef.current?.focus(); return }
    if (containsNut(trimmed)) {
      setEditNutError(true)
      setTimeout(() => setEditNutError(false), 3000)
      editNameRef.current?.focus()
      return
    }
    updateFood(food.id, { name: trimmed, category: editCategory, emoji: editEmoji })
    setEditing(false)
    setPickerOpen(false)
    onMutate()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter')  { e.preventDefault(); saveEdit() }
    if (e.key === 'Escape') { e.preventDefault(); cancelEdit() }
  }

  if (editing) {
    return (
      <div
        style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'both' }}
        className="animate-fadeInUp card-magic bg-white border-castle-purple p-4 space-y-3"
      >
        {/* Emoji + Name row */}
        <div className="flex gap-2 items-center">
          {/* Emoji picker button */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setPickerOpen(p => !p)}
              title="Change emoji"
              className={[
                'text-3xl w-[48px] h-[48px] flex items-center justify-center',
                'rounded-2xl border-2 bg-white transition-all duration-150',
                'hover:scale-110 active:scale-95',
                pickerOpen
                  ? 'border-castle-purple ring-2 ring-castle-purple/30'
                  : 'border-castle-purple-light',
              ].join(' ')}
            >
              {editEmoji}
            </button>

            {pickerOpen && (
              <div className="absolute left-0 top-12 z-30 bg-white rounded-2xl shadow-xl border-2 border-castle-purple-light p-2 w-64">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJIS.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => handleEmojiPick(e)}
                      className={[
                        'text-xl p-1 rounded-xl transition-all duration-100 min-h-[32px] min-w-[32px]',
                        'hover:scale-125 active:scale-90',
                        editEmoji === e ? 'bg-castle-purple-pale ring-2 ring-castle-purple' : '',
                      ].join(' ')}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Name input */}
          <input
            ref={editNameRef}
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={50}
            placeholder="Food name…"
            className={[
              'flex-1 rounded-2xl border-2 px-3 py-2 font-body text-base text-black',
              'focus:outline-none transition-all duration-200 min-h-[48px] bg-white',
              editNutError ? 'border-red-400' : 'border-castle-purple-light focus:border-castle-purple',
            ].join(' ')}
          />
        </div>

        {/* Nut warning */}
        {editNutError && (
          <p className="font-body text-xs text-red-600 flex items-center gap-1">
            🚫 Nut-free school rule — try sunflower seeds or hummus instead!
          </p>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => handleCategoryChange(c)}
              className={[
                'px-3 py-1 rounded-full font-body font-bold capitalize text-xs',
                'border-2 transition-all duration-150 min-h-[36px]',
                'hover:scale-105 active:scale-95',
                editCategory === c
                  ? 'bg-castle-purple text-white border-castle-purple'
                  : 'bg-white text-castle-purple border-castle-purple-light',
              ].join(' ')}
            >
              {CATEGORY_DEFAULT_EMOJI[c]} {c}
            </button>
          ))}
        </div>

        {/* Save / Cancel */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveEdit}
            className="flex-1 bg-castle-purple text-white font-body font-bold px-4 py-2.5 rounded-2xl hover:bg-castle-purple/90 active:scale-95 transition-all min-h-[44px]"
          >
            ✅ Save
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            className="px-4 py-2.5 rounded-2xl font-body font-bold text-castle-purple border-2 border-castle-purple-light bg-white hover:bg-castle-purple-pale transition-all min-h-[44px]"
          >
            Cancel
          </button>
        </div>
      </div>
    )
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

      {/* Edit */}
      <button
        onClick={openEdit}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xl hover:scale-125 active:scale-90 transition-transform text-castle-purple/50 hover:text-castle-purple"
        aria-label={`Edit ${food.name}`}
      >
        ✏️
      </button>

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
