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
  const [removing,     setRemoving]     = useState(false)
  const [rateAnim,     setRateAnim]     = useState(false)
  const [editing,      setEditing]      = useState(false)
  const [editName,     setEditName]     = useState(food.name)
  const [editCategory, setEditCategory] = useState<FoodCategory>(food.category)
  const [editEmoji,    setEditEmoji]    = useState(food.emoji)
  const [emojiManual,  setEmojiManual]  = useState(true)
  const [pickerOpen,   setPickerOpen]   = useState(false)
  const [editNutError, setEditNutError] = useState(false)
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

  const handlePantryToggle = () => {
    updateFood(food.id, { inPantry: !food.inPantry })
    onMutate()
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

  const cancelEdit = () => { setEditing(false); setPickerOpen(false); setEditNutError(false) }

  const handleCategoryChange = (c: FoodCategory) => {
    setEditCategory(c)
    if (!emojiManual) setEditEmoji(CATEGORY_DEFAULT_EMOJI[c])
    setPickerOpen(false)
  }

  const handleEmojiPick = (e: string) => { setEditEmoji(e); setEmojiManual(true); setPickerOpen(false) }

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

  // ── Edit mode — spans full row so the form has room ───────────────────────
  if (editing) {
    return (
      <div
        style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'both' }}
        className="animate-fadeInUp card-magic bg-white border-castle-purple p-4 space-y-3 col-span-2 md:col-span-4"
      >
        {/* Emoji + Name */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setPickerOpen(p => !p)}
              title="Change emoji"
              className={[
                'text-3xl w-[48px] h-[48px] flex items-center justify-center',
                'rounded-2xl border-2 bg-white transition-all duration-150',
                'hover:scale-110 active:scale-95',
                pickerOpen ? 'border-castle-purple ring-2 ring-castle-purple/30' : 'border-castle-purple-light',
              ].join(' ')}
            >
              {editEmoji}
            </button>
            {pickerOpen && (
              <div className="absolute left-0 top-12 z-30 bg-white rounded-2xl shadow-xl border-2 border-castle-purple-light p-2 w-64">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJIS.map(e => (
                    <button
                      key={e} type="button" onClick={() => handleEmojiPick(e)}
                      className={[
                        'text-xl p-1 rounded-xl transition-all duration-100 min-h-[32px] min-w-[32px]',
                        'hover:scale-125 active:scale-90',
                        editEmoji === e ? 'bg-castle-purple-pale ring-2 ring-castle-purple' : '',
                      ].join(' ')}
                    >{e}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
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

        {editNutError && (
          <p className="font-body text-xs text-red-600 flex items-center gap-1">
            🚫 Nut-free school rule — try sunflower seeds or hummus instead!
          </p>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button
              key={c} type="button" onClick={() => handleCategoryChange(c)}
              className={[
                'px-3 py-1 rounded-full font-body font-bold capitalize text-xs',
                'border-2 transition-all duration-150 min-h-[36px] hover:scale-105 active:scale-95',
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
            type="button" onClick={saveEdit}
            className="flex-1 bg-castle-purple text-white font-body font-bold px-4 py-2.5 rounded-2xl hover:bg-castle-purple/90 active:scale-95 transition-all min-h-[44px]"
          >✅ Save</button>
          <button
            type="button" onClick={cancelEdit}
            className="px-4 py-2.5 rounded-2xl font-body font-bold text-castle-purple border-2 border-castle-purple-light bg-white hover:bg-castle-purple-pale transition-all min-h-[44px]"
          >Cancel</button>
        </div>
      </div>
    )
  }

  // ── View mode — compact vertical grid card ─────────────────────────────────
  return (
    <div
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'both' }}
      className={[
        'animate-fadeInUp card-magic flex flex-col p-3',
        food.inPantry ? 'bg-white border-castle-purple-pale' : 'bg-amber-50 border-amber-200',
        removing ? 'opacity-0 scale-90 transition-all duration-300' : '',
        rateAnim  ? 'scale-105 transition-transform duration-200' : '',
      ].join(' ')}
    >
      {/* Top row: edit + delete */}
      <div className="flex justify-between mb-1">
        <button
          onClick={openEdit}
          className="text-base hover:scale-125 active:scale-90 transition-transform text-castle-purple/40 hover:text-castle-purple p-1"
          aria-label={`Edit ${food.name}`}
        >✏️</button>
        <button
          onClick={handleDelete}
          className="text-base hover:scale-125 active:scale-90 transition-transform text-rose-300 hover:text-rose-500 p-1"
          aria-label={`Remove ${food.name}`}
        >🗑️</button>
      </div>

      {/* Emoji */}
      <div className="flex justify-center my-1">
        <span
          className={`text-4xl leading-none select-none animate-float ${!food.inPantry ? 'opacity-60' : ''}`}
          style={{ animationDelay: `${animDelay * 0.5}ms` }}
        >
          {food.emoji}
        </span>
      </div>

      {/* Name */}
      <p className="font-magic text-center text-sm text-castle-purple leading-tight mb-1 overflow-hidden"
        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
      >
        {food.name}
      </p>

      {/* Category badge */}
      <div className="flex justify-center mb-2">
        <span className={`text-xs font-body font-bold px-2 py-0.5 rounded-full border capitalize ${categoryColors[food.category]}`}>
          {food.category}
        </span>
      </div>

      {/* Stars */}
      <div className="flex justify-center mb-3">
        <StarRating value={food.rating} onChange={handleRate} size="sm" />
      </div>

      {/* Pantry toggle */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className="font-body text-xs font-semibold text-gray-500">In Pantry</span>
        <button
          onClick={handlePantryToggle}
          role="switch"
          aria-checked={food.inPantry}
          aria-label={food.inPantry ? 'In pantry — tap to mark as need to buy' : 'Not in pantry — tap to mark as in pantry'}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
            food.inPantry ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            food.inPantry ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  )
}
