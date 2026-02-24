'use client'

import { useState, useRef, useEffect } from 'react'
import { FoodCategory, FoodItem } from '@/lib/types'
import { addFood, generateId } from '@/lib/storage'
import { containsNut } from '@/lib/nuts'
import MagicButton from './MagicButton'

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

interface AddFoodFormProps { onAdded: () => void }

interface JustAdded { emoji: string; name: string }

export default function AddFoodForm({ onAdded }: AddFoodFormProps) {
  const [open,         setOpen]         = useState(false)
  const [name,         setName]         = useState('')
  const [emoji,        setEmoji]        = useState(CATEGORY_DEFAULT_EMOJI['fruit'])
  const [emojiManual,  setEmojiManual]  = useState(false)
  const [category,     setCategory]     = useState<FoodCategory>('fruit')
  const [pickerOpen,   setPickerOpen]   = useState(false)
  const [shake,        setShake]        = useState(false)
  const [nutError,     setNutError]     = useState(false)
  const [justAdded,    setJustAdded]    = useState<JustAdded | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  // Focus name field when form opens
  useEffect(() => {
    if (open) setTimeout(() => nameRef.current?.focus(), 50)
  }, [open])

  const handleCategoryChange = (c: FoodCategory) => {
    setCategory(c)
    if (!emojiManual) setEmoji(CATEGORY_DEFAULT_EMOJI[c])
    setPickerOpen(false)
  }

  const handleEmojiPick = (e: string) => {
    setEmoji(e)
    setEmojiManual(true)
    setPickerOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      nameRef.current?.focus()
      return
    }
    if (containsNut(name)) {
      setNutError(true)
      setShake(true)
      setTimeout(() => { setNutError(false); setShake(false) }, 3500)
      nameRef.current?.focus()
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
    onAdded()

    // Flash confirmation then clear just the name — keep category/emoji for next item
    setJustAdded({ emoji, name: name.trim() })
    setTimeout(() => setJustAdded(null), 2000)

    setName('')
    setEmojiManual(false)
    setEmoji(CATEGORY_DEFAULT_EMOJI[category])
    nameRef.current?.focus()
  }

  const handleClose = () => {
    setOpen(false)
    setName('')
    setEmoji(CATEGORY_DEFAULT_EMOJI['fruit'])
    setEmojiManual(false)
    setCategory('fruit')
    setPickerOpen(false)
    setJustAdded(null)
  }

  return (
    <div className="card-magic bg-castle-purple-pale border-castle-purple-light p-5">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => open ? handleClose() : setOpen(true)}
        className="w-full flex items-center justify-between font-magic text-castle-purple text-2xl min-h-[44px]"
      >
        <span>✨ Add favourite foods!</span>
        <span className={`transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}>➕</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">

          {/* Name + emoji button on one row */}
          <div>
            <label className="block font-body font-bold text-castle-purple mb-1">
              What food is it? 🌟
            </label>
            <div className="flex gap-2 items-center">
              {/* Emoji toggle button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPickerOpen(p => !p)}
                  title="Change emoji"
                  className={[
                    'text-3xl w-[52px] h-[52px] flex items-center justify-center',
                    'rounded-2xl border-2 bg-white transition-all duration-150',
                    'hover:scale-110 active:scale-95',
                    pickerOpen
                      ? 'border-castle-purple ring-2 ring-castle-purple/30'
                      : 'border-castle-purple-light',
                  ].join(' ')}
                >
                  {emoji}
                </button>

                {/* Inline emoji picker dropdown */}
                {pickerOpen && (
                  <div className="absolute left-0 top-14 z-20 bg-white rounded-2xl shadow-xl border-2 border-castle-purple-light p-2 w-72">
                    <div className="grid grid-cols-8 gap-1">
                      {EMOJIS.map(e => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => handleEmojiPick(e)}
                          className={[
                            'text-xl p-1 rounded-xl transition-all duration-100 min-h-[36px] min-w-[36px]',
                            'hover:scale-125 active:scale-90',
                            emoji === e ? 'bg-castle-purple-pale ring-2 ring-castle-purple' : '',
                          ].join(' ')}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-center text-castle-purple/50 font-body mt-2">
                      tap an emoji to pick it
                    </p>
                  </div>
                )}
              </div>

              {/* Name input */}
              <input
                ref={nameRef}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Seaweed, Mango, Yogurt…"
                className={[
                  'flex-1 rounded-2xl border-2 border-castle-purple-light',
                  'px-4 py-2 font-body text-lg text-black focus:outline-none focus:border-castle-purple',
                  'bg-white transition-all duration-200 min-h-[52px]',
                  shake ? 'animate-wiggle border-red-400' : '',
                ].join(' ')}
              />
            </div>

            {/* Nut warning */}
            {nutError && (
              <div className="mt-2 animate-fadeInUp flex items-start gap-2 bg-red-50 border-2 border-red-300 rounded-2xl px-4 py-3">
                <span className="text-xl flex-shrink-0">🚫</span>
                <div>
                  <p className="font-body font-bold text-red-700 text-sm">Nut-free school rule!</p>
                  <p className="font-body text-red-600 text-sm">
                    Krysha&apos;s school doesn&apos;t allow nut items in the snack box. Try sunflower seeds, pumpkin seeds, or hummus instead!
                  </p>
                </div>
              </div>
            )}
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
                  onClick={() => handleCategoryChange(c)}
                  className={[
                    'px-4 py-1.5 rounded-full font-body font-bold capitalize text-sm',
                    'border-2 transition-all duration-150 min-h-[40px]',
                    'hover:scale-105 active:scale-95',
                    category === c
                      ? 'bg-castle-purple text-white border-castle-purple'
                      : 'bg-white text-castle-purple border-castle-purple-light',
                  ].join(' ')}
                >
                  {CATEGORY_DEFAULT_EMOJI[c]} {c}
                </button>
              ))}
            </div>
          </div>

          {/* Just-added confirmation */}
          {justAdded && (
            <div className="animate-fadeInUp bg-green-50 border-2 border-green-200 rounded-2xl px-4 py-2 flex items-center gap-2">
              <span className="text-2xl">{justAdded.emoji}</span>
              <span className="font-body font-bold text-green-700">
                {justAdded.name} added! ✅ Add another?
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <MagicButton type="submit" fullWidth>
              ➕ Add Food
            </MagicButton>
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-3 rounded-2xl font-body font-bold text-castle-purple border-2 border-castle-purple-light bg-white hover:bg-castle-purple-pale transition-all min-h-[44px]"
            >
              Done
            </button>
          </div>

        </form>
      )}
    </div>
  )
}
