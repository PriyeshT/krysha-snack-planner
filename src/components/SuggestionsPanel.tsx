'use client'

import { useState } from 'react'
import { FoodItem, SuggestedFood, SuggestFavoritesResponse, FoodCategory } from '@/lib/types'
import { addFood, generateId, getFairyName } from '@/lib/storage'
import { containsNut } from '@/lib/nuts'
import MagicButton from './MagicButton'

const CATEGORY_DEFAULT_EMOJI: Record<FoodCategory, string> = {
  fruit:   '🍎',
  veggie:  '🥦',
  protein: '🥩',
  grain:   '🍞',
  dairy:   '🧀',
  snack:   '🍿',
  other:   '🍽️',
}

interface SuggestionsPanelProps {
  existingFoods: FoodItem[]
  onAdded: () => void
}

export default function SuggestionsPanel({ existingFoods, onAdded }: SuggestionsPanelProps) {
  const [open,      setOpen]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<SuggestFavoritesResponse | null>(null)
  const [selected,  setSelected]  = useState<Set<number>>(new Set())
  const [error,     setError]     = useState('')
  const [addedAnim, setAddedAnim] = useState(false)

  const fairyName = getFairyName()

  const fetchSuggestions = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    setSelected(new Set())
    try {
      const res = await fetch('/api/recommend', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          type:      'suggest-favorites',
          foods:     existingFoods,
          fairyName,
        }),
      })
      const data: SuggestFavoritesResponse = await res.json()
      // Client-side safety net: strip any nut items that slipped through
      data.suggestions = (data.suggestions ?? []).filter(s => !containsNut(s.name))
      setResult(data)
      setOpen(true)
    } catch {
      setError(`${fairyName} couldn't find the Singapore food map! Try again 🗺️`)
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const selectAll = () => {
    if (!result) return
    setSelected(new Set(result.suggestions.map((_, i) => i)))
  }

  const clearAll = () => setSelected(new Set())

  const addSelected = () => {
    if (!result) return
    result.suggestions.forEach((s, i) => {
      if (!selected.has(i)) return
      const cat = (s.category as FoodCategory) in CATEGORY_DEFAULT_EMOJI
        ? (s.category as FoodCategory)
        : 'other'
      addFood({
        id:        generateId(),
        name:      s.name,
        emoji:     s.emoji || CATEGORY_DEFAULT_EMOJI[cat],
        rating:    0,
        dateAdded: new Date().toISOString(),
        category:  cat,
      })
    })
    setAddedAnim(true)
    setTimeout(() => {
      setAddedAnim(false)
      setSelected(new Set())
      setResult(null)
      setOpen(false)
      onAdded()
    }, 1200)
  }

  const selectedCount = selected.size

  return (
    <div className="card-magic bg-gradient-to-br from-castle-teal/10 to-blue-50 border-castle-teal p-5">
      {/* Header button */}
      <button
        type="button"
        onClick={() => {
          if (!open) fetchSuggestions()
          else setOpen(false)
        }}
        className="w-full flex items-center justify-between font-magic text-castle-teal text-2xl min-h-[44px]"
      >
        <span>🇸🇬 Discover Singapore Foods!</span>
        <span className={`transition-transform duration-300 text-xl ${open ? 'rotate-180' : 'rotate-0'}`}>▼</span>
      </button>

      <p className="font-body text-sm text-castle-teal/70 mt-1">
        {fairyName} will suggest 20 foods perfect for Singapore families
      </p>
      <span className="inline-flex items-center gap-1 mt-1 text-xs font-body font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
        🚫 Nut-free suggestions only
      </span>

      {/* Refresh button when already open */}
      {open && result && !loading && (
        <button
          onClick={fetchSuggestions}
          className="mt-2 font-body text-sm text-castle-teal underline hover:no-underline min-h-[44px] flex items-center gap-1"
        >
          🔄 Get 20 new suggestions
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-4 text-center py-6">
          <div className="inline-block w-8 h-8 border-4 border-castle-teal border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-body text-castle-teal font-semibold">
            {fairyName} is exploring Singapore markets… 🛒
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 card-magic bg-rose-50 border-rose-200 p-3 text-center font-body text-rose-600 text-sm">
          {error}
          <button onClick={fetchSuggestions} className="block mx-auto mt-2 underline text-rose-500">
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {open && result && !loading && (
        <div className="mt-4 space-y-4 animate-fadeInUp">
          {/* Pixie greeting */}
          <div className="bg-castle-teal/10 rounded-2xl px-4 py-3">
            <p className="font-body text-sm text-castle-teal font-semibold">{result.greeting}</p>
          </div>

          {/* Select all / clear */}
          <div className="flex gap-3 items-center">
            <button
              onClick={selectAll}
              className="font-body text-sm text-castle-purple underline hover:no-underline min-h-[44px]"
            >
              Select all 20
            </button>
            {selectedCount > 0 && (
              <button
                onClick={clearAll}
                className="font-body text-sm text-gray-400 underline hover:no-underline min-h-[44px]"
              >
                Clear
              </button>
            )}
            {selectedCount > 0 && (
              <span className="ml-auto font-body font-bold text-castle-purple text-sm">
                {selectedCount} selected
              </span>
            )}
          </div>

          {/* 20 food chips */}
          <div className="grid grid-cols-1 gap-2">
            {result.suggestions?.map((food, i) => {
              const isSelected = selected.has(i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleSelect(i)}
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                  className={[
                    'animate-fadeInUp flex items-center gap-3 p-3 rounded-2xl border-2',
                    'text-left transition-all duration-200 min-h-[44px]',
                    'hover:scale-[1.01] active:scale-[0.99]',
                    isSelected
                      ? 'bg-castle-purple border-castle-purple text-white shadow-md shadow-castle-purple/20'
                      : 'bg-white border-castle-purple-light text-castle-purple hover:border-castle-purple',
                  ].join(' ')}
                >
                  {/* Checkbox indicator */}
                  <span className={[
                    'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm',
                    isSelected
                      ? 'bg-white border-white text-castle-purple'
                      : 'border-castle-purple-light',
                  ].join(' ')}>
                    {isSelected ? '✓' : ''}
                  </span>

                  {/* Emoji */}
                  <span className="text-2xl flex-shrink-0">{food.emoji}</span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-magic text-base leading-tight ${isSelected ? 'text-white' : 'text-castle-purple'}`}>
                      {food.name}
                    </p>
                    <p className={`font-body text-xs mt-0.5 capitalize ${isSelected ? 'text-white/80' : 'text-castle-purple/60'}`}>
                      {food.category} · {food.whySuggested}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Closing note */}
          {result.closingNote && (
            <p className="font-body text-sm text-center text-castle-teal/70 italic">
              {result.closingNote}
            </p>
          )}

          {/* Add button */}
          {selectedCount > 0 && (
            <div className="sticky bottom-20 md:bottom-4 pt-2">
              <MagicButton
                onClick={addSelected}
                fullWidth
                variant="secondary"
                loading={addedAnim}
              >
                {addedAnim
                  ? `✨ Added ${selectedCount} food${selectedCount !== 1 ? 's' : ''}!`
                  : `⭐ Add ${selectedCount} food${selectedCount !== 1 ? 's' : ''} to My Kingdom!`}
              </MagicButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
